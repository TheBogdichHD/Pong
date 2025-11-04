import { screen, macro, Component, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    onLoad() {
        screen.on('orientation-change', this.onOrientationChange, this);
    }

    onOrientationChange(orientation: number) {
        if (
            orientation === macro.ORIENTATION_LANDSCAPE_LEFT ||
            orientation === macro.ORIENTATION_LANDSCAPE_RIGHT
        ) {
            console.log('Landscape mode active');
        }
    }
}
