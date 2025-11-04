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
    public moveSpeed: number = 500;

    @property
    public boundaryTop: number = 250;

    @property
    public boundaryBottom: number = -250;

    @property
    public enableKeyboard: boolean = true;

    @property
    public enableTouch: boolean = true;

    private _moveDirection: number = 0;
    private _currentPos: Vec3 = new Vec3();
    private _isTouching: boolean = false;
    private _targetTouchY: number = 0;

    onLoad() {
        if (this.enableKeyboard) {
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        }

        if (this.enableTouch) {
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
            input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    }

    onDestroy() {
        if (this.enableKeyboard) {
            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        }

        if (this.enableTouch) {
            input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
            input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this._moveDirection = 1;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this._moveDirection = -1;
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this._moveDirection = 0;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this._moveDirection = 0;
                break;
        }
    }

    onTouchStart(event: EventTouch) {
        this._isTouching = true;
        const touchPos = event.getUILocation();

        const worldPos = this.node.parent
            .getComponent(UITransform)
            ?.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        if (worldPos) {
            this._targetTouchY = worldPos.y;
        }
    }

    onTouchMove(event: EventTouch) {
        if (this._isTouching) {
            const touchPos = event.getUILocation();
            const worldPos = this.node.parent
                .getComponent(UITransform)
                ?.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
            if (worldPos) {
                this._targetTouchY = worldPos.y;
            }
        }
    }

    onTouchEnd(event: EventTouch) {
        this._isTouching = false;
    }

    update(deltaTime: number) {
        this.node.getPosition(this._currentPos);

        if (this._moveDirection !== 0) {
            this._currentPos.y +=
                this._moveDirection * this.moveSpeed * deltaTime;
        }

        if (this._isTouching) {
            const diff = this._targetTouchY - this._currentPos.y;
            this._currentPos.y += diff * 10 * deltaTime;
        }

        this._currentPos.y = Math.max(
            this.boundaryBottom,
            Math.min(this.boundaryTop, this._currentPos.y)
        );

        this.node.setPosition(this._currentPos);
    }
}
