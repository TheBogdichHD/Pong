import { _decorator, Component, view, ResolutionPolicy, Label } from 'cc';
import { init, viewport, initData, retrieveLaunchParams } from '@tma.js/sdk';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;

    public username: string = 'Name';

    public static get Instance(): GameManager {
        return this._instance;
    }

    onLoad() {
        GameManager._instance = this;
        try {
            init();

            const launchParams = retrieveLaunchParams();

            console.log(launchParams);

            console.log('Telegram Mini App initialized');
            console.log('Platform:', launchParams.tgWebAppPlatform);
            console.log('Version:', launchParams.tgWebAppVersion);

            // Mount viewport first
            viewport.mount();

            // Get user data
            if (launchParams.tgWebAppData) {
                const user = launchParams.tgWebAppData.user;
                if (user) {
                    console.log('User ID:', user.id);
                    console.log('Username:', user.username);
                    console.log('First Name:', user.first_name);
                    this.username = user.username;
                }
            }

            // Expand viewport (works on all versions)
            if (viewport.expand.isAvailable()) {
                viewport.expand();
            }

            // Request fullscreen (Telegram 8.0+ only)
            if (viewport.requestFullscreen.isAvailable()) {
                viewport.requestFullscreen();
            }

            this.setupLandscape();
        } catch (error) {
            console.log('Not in Telegram environment:', error);
            this.setupLandscape();
        }
    }

    setupLandscape() {
        view.setDesignResolutionSize(640, 960, ResolutionPolicy.SHOW_ALL);
        view.resizeWithBrowserSize(true);
    }
}
