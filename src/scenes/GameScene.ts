import Scene from './Scene';

import observerSingleton from '../managers/Observer';
import {ACTION_BET, ACTION_INIT, EVENT_RESPONSE_BET, EVENT_RESPONSE_INIT, provider} from '../managers/DataProvider';
import ButtonSpin from '../components/ButtonSpin';
import SlotMachine from '../components/SlotMachine';
import {TweenLite} from 'gsap';
import InfoPanel from '../components/InfoPanel';
import PopupWin from '../popups/PopupWin';


const ASSETS = [
    {name: 'bet.line', url: './assets/Bet_Line.png'},
    {name: 'background', url: './assets/BG.png'},
    {name: 'btn.spin', url: './assets/BTN_SPIN.png'},
    {name: 'btn.spin.disabled', url: './assets/BTN_SPIN_d.png'},
    {name: 'sym.0', url: './assets/SYM1.png'},
    {name: 'sym.1', url: './assets/SYM3.png'},
    {name: 'sym.2', url: './assets/SYM4.png'},
    {name: 'sym.3', url: './assets/SYM5.png'},
    {name: 'sym.4', url: './assets/SYM6.png'},
    {name: 'sym.5', url: './assets/SYM7.png'}
];


export default class GameScene extends Scene{
    public static NAME: string = 'scene.game';

    public static STATE_IDLE: string = 'state.idle';
    public static STATE_WAIT_BET: string = 'state.wait.bet';
    public static STATE_LOST_BET: string = 'state.lost.bet';
    public static STATE_WIN_BET: string = 'state.win.bet';

    private _background: PIXI.Sprite;
    private _slotMachine: SlotMachine;
    private _spinButton: ButtonSpin;
    private _infoPanel: InfoPanel;

    private _curState: string;

    public run(): void{
        this.subscribe();
        this.load(ASSETS);



    }

    protected loaded(): void{


        provider.send(ACTION_INIT);

    }

    private buildScene(): void{

        // add background
        this._background = new PIXI.Sprite(PIXI.Texture.fromImage('background'));
        this._content.addChild(this._background);

        // add slot machine
        this._slotMachine = new SlotMachine();
        this._slotMachine.init({

            reelstrips: provider.responseInit.reelstrips,
            initpos: provider.responseInit.initpos
        });
        this._content.addChild(this._slotMachine);

        // add info panel
        this._infoPanel = new InfoPanel();
        this._infoPanel.init();
        this._infoPanel.x = 811;
        this._infoPanel.y = 365;
        this._content.addChild(this._infoPanel);

        //add spin button
        this._spinButton = new ButtonSpin();
        this._spinButton.init();
        this._spinButton.x = 873;
        this._spinButton.y = 267;
        this._content.addChild(this._spinButton);

        // define center point
        this._center = new PIXI.Point(425, 280);

        // debug popup

        this.initPopups([{name: PopupWin.NAME, popup: new PopupWin()}]);

    }

    private onResponseInit(params): void{
        this.buildScene();
        this.setState(GameScene.STATE_IDLE);

    }

    private onResponseBet(params): void{
        //console.log('GameScene.onResponseBet params: ', params);
        if (params.win){
            this.setState(GameScene.STATE_WIN_BET);
        } else {
            this.setState(GameScene.STATE_LOST_BET);
        }

        // ACTIONS AFTER BET RESPONSE
    }

    private onSpinClick(params): void{
        // this._slotMachine.spin();

        this.setState(GameScene.STATE_WAIT_BET);

    }

    private updateSpinable(): void{
        if (provider.balance - provider.bet >= 0){
            this._spinButton.enabled = true;
        } else {
            this._spinButton.enabled = false;
        }
    }


    private setState(state): void{
        if (this._curState !== state){
            //console.log('GameScene.setState ', state);
            this._curState = state;
            switch(this._curState){
                case GameScene.STATE_IDLE:
                    this.updateSpinable();
                    this._infoPanel.updateBalance(provider.balance);
                    break;
                case GameScene.STATE_WAIT_BET:
                    provider.send(ACTION_BET);
                    this._slotMachine.spin();
                    this._infoPanel.updateBalance(provider.balance);
                    this._infoPanel.updateWin(0);

                    this._spinButton.enabled = false;

                    break;
                case GameScene.STATE_WIN_BET:
                    let winTime = 0;
                    this._slotMachine.stop(provider.responseBet.reelspos);
                    winTime += 1;

                    TweenLite.delayedCall(winTime, () =>{
                        this._infoPanel.updateBalance(provider.balance);
                        this._infoPanel.updateWin(provider.responseBet.win);
                        this.getPopup(PopupWin.NAME).show();
                        //console.log('show win');

                    });
                    winTime += 2;

                    TweenLite.delayedCall(winTime, () =>{
                        this.getPopup(PopupWin.NAME).hide();
                    });
                    winTime += 1;

                    TweenLite.delayedCall(winTime, () =>{
                        this.setState(GameScene.STATE_IDLE);
                    });
                    break;

                case GameScene.STATE_LOST_BET:
                    let lostTime = 0;
                    this._slotMachine.stop(provider.responseBet.reelspos);
                    lostTime += 1;


                    TweenLite.delayedCall(lostTime, () =>{
                        this._infoPanel.updateBalance(provider.balance);
                        this._infoPanel.updateWin(provider.responseBet.win);

                    });
                    lostTime += 2;

                    TweenLite.delayedCall(lostTime, () =>{
                        this.setState(GameScene.STATE_IDLE);
                    });


                    break;
            }
        }
    }

    public resize(width, height): void{
        console.log('GameScreen.resize ', width, height);
        this._content.x = width / 2 - this._content.width / 2;
        this._content.y = height / 2 - this._content.height * 0.4;
    }

    private subscribe(): void{
        observerSingleton.addListener(EVENT_RESPONSE_INIT, this.onResponseInit.bind(this));
        observerSingleton.addListener(EVENT_RESPONSE_BET, this.onResponseBet.bind(this));
        observerSingleton.addListener(ButtonSpin.EVENT_SPIN_CLICK, this.onSpinClick.bind(this));
    }
}