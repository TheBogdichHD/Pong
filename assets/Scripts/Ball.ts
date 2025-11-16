import {
    _decorator,
    Component,
    Prefab,
    RigidBody2D,
    Vec2,
    Vec3,
    instantiate,
    AudioSource,
    CircleCollider2D,
    Contact2DType,
    Collider2D,
    AudioClip,
} from 'cc';
import { ScoreManager } from './ScoreManager';
import { hapticFeedback } from '@tma.js/sdk';

const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    @property
    speed: number = 500;

    @property
    topBoundary: number = 360;

    @property
    bottomBoundary: number = -360;

    @property
    minAngle: number = 20;

    @property
    maxAngle: number = 80;

    @property(Prefab)
    scoreEffectPrefab: Prefab = null;

    @property(AudioClip)
    hitSound: AudioClip = null;

    @property(AudioClip)
    scoreSound: AudioClip = null;

    @property
    enableVibration: boolean = true;

    private _rigidBody: RigidBody2D = null;
    private _lastScorer: 'player' | 'bot' = 'player';
    private _audioSource: AudioSource = null;
    private _hapticInitialized: boolean = false;

    onLoad() {
        this._rigidBody = this.getComponent(RigidBody2D);
        this._rigidBody.gravityScale = 0;
        this._rigidBody.linearDamping = 0;

        this._audioSource = this.getComponent(AudioSource);

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
        }
    }

    onCollision(selfCollider: Collider2D, otherCollider: Collider2D) {
        this.playHitSound();
    }

    triggerVibration() {
        if (!this.enableVibration) return;

        try {
            if (hapticFeedback.impactOccurred.isAvailable()) {
                hapticFeedback.impactOccurred('medium');
            }
        } catch (e) {
            console.error('Vibration error:', e);
        }
    }

    playHitSound() {
        const randomVolume = 0.7 + Math.random() * 0.3;

        this._audioSource.volume = randomVolume;
        this._audioSource.playOneShot(this.hitSound, randomVolume);
    }

    playScoreSound() {
        const randomVolume = 0.7 + Math.random() * 0.3;

        this._audioSource.volume = randomVolume;
        this._audioSource.playOneShot(this.scoreSound, randomVolume);
    }

    start() {
        this.scheduleOnce(() => {
            this.serveBall('player');
        }, 0.5);
    }

    update(deltaTime: number) {
        if (this.node.position.y >= this.topBoundary) {
            this._lastScorer = 'player';
            ScoreManager.Instance.addPlayerScore();
            this.makeScore();
        } else if (this.node.position.y <= this.bottomBoundary) {
            this._lastScorer = 'bot';
            ScoreManager.Instance.addBotScore();
            this.makeScore();
        }
    }

    makeScore() {
        this.spawnScoreEffect(this.node.position);
        this.playScoreSound();
        this.triggerVibration();
        this.resetBall();
    }

    serveBall(winner: 'player' | 'bot') {
        const angleRange = this.maxAngle - this.minAngle;
        const angle =
            ((this.minAngle + Math.random() * angleRange) * Math.PI) / 180;

        const horizontalDirection = Math.random() > 0.5 ? 1 : -1;

        const verticalDirection = winner === 'player' ? -1 : 1;

        const velocity = new Vec2(
            Math.sin(angle) * this.speed * horizontalDirection,
            Math.cos(angle) * this.speed * verticalDirection
        );

        this._rigidBody.linearVelocity = velocity;
        console.log(
            `Ball served toward ${winner === 'player' ? 'bot' : 'player'}`
        );
    }

    resetBall() {
        this.node.setPosition(0, 0, 0);
        this._rigidBody.linearVelocity = Vec2.ZERO;
        this.scheduleOnce(() => {
            this.serveBall(this._lastScorer);
        }, 1);
    }

    spawnScoreEffect(ballPosition: Vec3) {
        if (!this.scoreEffectPrefab) return;

        const effect = instantiate(this.scoreEffectPrefab);
        effect.setPosition(ballPosition);
        this.node.parent.addChild(effect);

        this.scheduleOnce(() => effect.destroy(), 1);
    }
}
