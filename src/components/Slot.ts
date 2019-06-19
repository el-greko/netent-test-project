import Component from './Component';

export default class Slot extends Component{

    private _slotSprite:PIXI.extras.AnimatedSprite;
    constructor(){
        super();

    }

    public init(textures: Array<string>): void{
        let arrTextures = [];
        textures.forEach((item: string, idx) =>{
            arrTextures[idx] = PIXI.Texture.fromImage(item);

        });


        this._slotSprite = new PIXI.extras.AnimatedSprite(arrTextures);
        this._slotSprite.x -= this._slotSprite.width / 2;
        this._slotSprite.gotoAndStop(0);
        this.addChild(this._slotSprite);
    }

    public set currentSymbol(n: number){
        this._slotSprite.gotoAndStop(n);
    }

    public get currentSymbol(): number{
        return this._slotSprite.currentFrame;
    }
}