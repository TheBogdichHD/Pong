import { _decorator, Component, Node, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BotController')
export class BotController extends Component {
    @property(Node)
    ball: Node = null;

    @property
    moveSpeed: number = 300;

    @property
    reactionDelay: number = 0.1; // Bot reaction time (higher = easier to beat)

    @property
    difficulty: number = 0.8; // 0-1, how accurate bot is (0.5 = medium, 0.8 = hard)

    @property
    boundaryLeft: number = -275; // Adjust to your game boundaries

    @property
    boundaryRight: number = 275;

    private _targetX: number = 0;
    private _reactionTimer: number = 0;

    start() {
        if (!this.ball) {
            console.error('Bot needs a ball reference!');
        }
    }

    update(deltaTime: number) {
        if (!this.ball) return;

        // Update reaction timer
        this._reactionTimer += deltaTime;

        // Only recalculate target position periodically (reaction delay)
        if (this._reactionTimer >= this.reactionDelay) {
            this._reactionTimer = 0;
            this.calculateTargetPosition();
        }

        // Move towards target
        this.moveTowardsTarget(deltaTime);
    }

    calculateTargetPosition() {
        // Track ball's X position with some error based on difficulty
        const ballX = this.ball.position.x;

        // Add random error (lower difficulty = more error)
        const maxError = 100 * (1 - this.difficulty);
        const error = (Math.random() * 2 - 1) * maxError;

        this._targetX = ballX + error;

        // Clamp to boundaries
        this._targetX = Math.max(
            this.boundaryLeft,
            Math.min(this.boundaryRight, this._targetX)
        );
    }

    moveTowardsTarget(deltaTime: number) {
        const currentPos = this.node.position;
        const distanceToTarget = this._targetX - currentPos.x;

        // Dead zone - don't move if close enough
        if (Math.abs(distanceToTarget) < 5) return;

        // Move towards target
        const direction = Math.sign(distanceToTarget);
        const moveAmount = direction * this.moveSpeed * deltaTime;

        // Clamp movement to not overshoot
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

    // Optional: Make bot harder or easier dynamically
    setDifficulty(level: number) {
        this.difficulty = Math.max(0, Math.min(1, level));
        this.reactionDelay = 0.3 - this.difficulty * 0.2; // Faster reaction at higher difficulty
        this.moveSpeed = 200 + this.difficulty * 200; // Faster movement at higher difficulty
    }
}
