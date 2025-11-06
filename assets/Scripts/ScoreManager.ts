import { _decorator, Component, Label } from 'cc';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property(Label)
    playerScoreLabel: Label = null;

    @property(Label)
    botScoreLabel: Label = null;

    private _playerScore: number = 0;
    private _botScore: number = 0;

    private static _instance: ScoreManager = null;

    public static get Instance(): ScoreManager {
        return this._instance;
    }

    onLoad() {
        ScoreManager._instance = this;
        this.updateDisplay();
    }

    protected start(): void {
        this.updateDisplay();
    }
    addPlayerScore() {
        this._playerScore++;
        console.log('Player scored! Score:', this._playerScore);
        this.updateDisplay();
    }

    addBotScore() {
        this._botScore++;
        console.log('Bot scored! Score:', this._botScore);
        this.updateDisplay();
    }

    private updateDisplay() {
        if (this.playerScoreLabel) {
            this.playerScoreLabel.string = `${GameManager.Instance.username}: ${this._playerScore}`;
        }
        if (this.botScoreLabel) {
            this.botScoreLabel.string = `Bot: ${this._botScore}`;
        }
    }

    getPlayerScore(): number {
        return this._playerScore;
    }

    getBotScore(): number {
        return this._botScore;
    }

    resetScores() {
        this._playerScore = 0;
        this._botScore = 0;
        this.updateDisplay();
    }
}
