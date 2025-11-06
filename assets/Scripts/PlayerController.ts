import {
    _decorator,
    Component,
    Node,
    input,
    Input,
    EventKeyboard,
    EventTouch,
    KeyCode,
    Vec3,
    UITransform,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    public moveSpeed: number = 1000;

    @property
    public boundaryRight: number = 275;

    @property
    public boundaryLeft: number = -275;

    private _moveDirection: number = 0;
    private _currentPos: Vec3 = new Vec3();
    private _isTouching: boolean = false;
    private _targetTouchX: number = 0;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this._isTouching = true;
        const touchPos = event.getUILocation();

        const worldPos = this.node.parent
            .getComponent(UITransform)
            ?.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        if (worldPos) {
            this._targetTouchX = worldPos.x;
        }
    }

    onTouchMove(event: EventTouch) {
        if (this._isTouching) {
            const touchPos = event.getUILocation();
            const worldPos = this.node.parent
                .getComponent(UITransform)
                ?.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
            if (worldPos) {
                this._targetTouchX = worldPos.x;
            }
        }
    }

    onTouchEnd(event: EventTouch) {
        this._isTouching = false;
    }

    update(deltaTime: number) {
        this.node.getPosition(this._currentPos);

        if (this._moveDirection !== 0) {
            this._currentPos.x +=
                this._moveDirection * this.moveSpeed * deltaTime;
        }

        if (this._isTouching) {
            const diff = this._targetTouchX - this._currentPos.x;
            this._currentPos.x += diff * 10 * deltaTime;
        }

        this._currentPos.x = Math.max(
            this.boundaryLeft,
            Math.min(this.boundaryRight, this._currentPos.x)
        );

        this.node.setPosition(this._currentPos);
    }
}
