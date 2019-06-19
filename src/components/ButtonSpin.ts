import Component from './Component';
import observerSingleton from '../managers/Observer';

export default class ButtonSpin extends Component{
    public static EVENT_SPIN_CLICK: string = 'event.button.spin';

    private _button: PIXI.Sprite;
    private _isButtonEnabled: boolean = true;
    private _textureIdle: PIXI.Texture;
    private _textureDisable: PIXI.Texture;

    public init(): void{

        this._textureIdle = PIXI.Texture.fromImage('btn.spin');
        this._textureDisable = PIXI.Texture.fromImage('btn.spin.disabled');

        this._button = new PIXI.Sprite(this._textureIdle);
        this._button.buttonMode = true;
        this._button.interactive = true;
        this._button.on('tap', this.onTap, this);
        this._button.on('click', this.onTap, this);
        this.addChild(this._button);
        this._button.anchor.set(0.5);

    }

    private onTap(...args): void{

        if (this._isButtonEnabled){
            observerSingleton.emit(ButtonSpin.EVENT_SPIN_CLICK);
        }
    }

    public set enabled(nbl: boolean){
        this._isButtonEnabled = nbl;
        if (this._isButtonEnabled){
            this._button.texture = this._textureIdle;
            this._button.buttonMode = true;
        } else {
            this._button.texture = this._textureDisable;
            this._button.buttonMode = false;
        }
    }

    public get enabled(): boolean{
        return this._isButtonEnabled;
    }
}