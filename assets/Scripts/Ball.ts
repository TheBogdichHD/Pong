import {
    _decorator,
    Component,
    Prefab,
    RigidBody2D,
    Vec2,
    Vec3,
    instantiate,
} from 'cc';
import { ScoreManager } from './ScoreManager';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    @property
    speed: number = 500;

    @property
    topBoundary: number = 360;

    @property
    bottomBoundary: number = -360;

    @property(Prefab)
    scoreEffectPrefab: Prefab = null;

    private _rigidBody: RigidBody2D = null;

    onLoad() {
        this._rigidBody = this.getComponent(RigidBody2D);
    }

    start() {
        this.scheduleOnce(() => {
            this.serveBall();
        }, 0.5);
    }

    update(deltaTime: number) {
        // Check if ball touched top boundary (Bot side - Player scores)
        if (this.node.position.y >= this.topBoundary) {
            console.log('Ball touched TopBoundary! Player scores!');
            this.spawnScoreEffect(this.node.position);
            ScoreManager.Instance.addPlayerScore();
            this.resetBall();
        }
        // Check if ball touched bottom boundary (Player side - Bot scores)
        else if (this.node.position.y <= this.bottomBoundary) {
            console.log('Ball touched BottomBoundary! Bot scores!');
            this.spawnScoreEffect(this.node.position);
            ScoreManager.Instance.addBotScore();
            this.resetBall();
        }
    }

    serveBall() {
        const angle =
            ((Math.random() * 90 - 135 * Math.random() + 135 / 2) * Math.PI) /
            180;
        const velocity = new Vec2(
            Math.sin(angle) * this.speed,
            Math.cos(angle) * this.speed
        );
        this._rigidBody.linearVelocity = velocity;
    }

    resetBall() {
        this.node.setPosition(0, 0, 0);
        this._rigidBody.linearVelocity = Vec2.ZERO;
        this.scheduleOnce(() => this.serveBall(), 1);
    }

    spawnScoreEffect(ballPosition: Vec3) {
        if (!this.scoreEffectPrefab) return;

        const effect = instantiate(this.scoreEffectPrefab);
        effect.setPosition(ballPosition);
        this.node.parent.addChild(effect);

        this.scheduleOnce(() => effect.destroy(), 1);
    }
}
