import { _decorator, Component, Node, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BotController')
export class BotController extends Component {
    @property(Node)
    ball: Node = null;

    @property
    moveSpeed: number = 350;

    @property
    reactionDelay: number = 0.1;

    @property
    difficulty: number = 0.8;

    @property
    boundaryLeft: number = -265;

    @property
    boundaryRight: number = 265;

    private _targetX: number = 0;
    private _reactionTimer: number = 0;

    start() {
        if (!this.ball) {
            console.error('Bot needs a ball reference!');
        }
    }

    update(deltaTime: number) {
        if (!this.ball) return;

        this._reactionTimer += deltaTime;

        if (this._reactionTimer >= this.reactionDelay) {
            this._reactionTimer = 0;
            this.calculateTargetPosition();
        }

        this.moveTowardsTarget(deltaTime);
    }

    calculateTargetPosition() {
        const ballX = this.ball.position.x;

        const maxError = 100 * (1 - this.difficulty);
        const error = (Math.random() * 2 - 1) * maxError;

        this._targetX = ballX + error;

        this._targetX = Math.max(
            this.boundaryLeft,
            Math.min(this.boundaryRight, this._targetX)
        );
    }

    moveTowardsTarget(deltaTime: number) {
        const currentPos = this.node.position;
        const distanceToTarget = this._targetX - currentPos.x;

        if (Math.abs(distanceToTarget) < 5) return;

        const direction = Math.sign(distanceToTarget);
        const moveAmount = direction * this.moveSpeed * deltaTime;

        const finalMove =
            Math.abs(moveAmount) > Math.abs(distanceToTarget)
                ? distanceToTarget
                : moveAmount;

        this.node.setPosition(
            currentPos.x + finalMove,
            currentPos.y,
            currentPos.z
        );
    }

    setDifficulty(level: number) {
        this.difficulty = Math.max(0, Math.min(1, level));
        this.reactionDelay = 0.3 - this.difficulty * 0.2;
        this.moveSpeed = 200 + this.difficulty * 200;
    }
}
