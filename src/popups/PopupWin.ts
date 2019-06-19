import IPopup from './IPopup';

export default class PopupWin extends PIXI.Container implements IPopup{
    public static NAME: string = 'popup.win';
    private _backPanel: PIXI.Graphics;
    private _txWin: PIXI.Text;
    //public centerPoint: PIXI.Point;


    public init():void{

        this._backPanel = new PIXI.Graphics();
        this._backPanel.beginFill(0x000000, 0.8);
        // this._backPanel.lineStyle(1,0x000000, 0.7);
        this._backPanel.drawRect(0, 0, 716, 300);
        this.addChild(this._backPanel);


        this._txWin = new PIXI.Text('YOU WON!', {fontFamily: 'Arial', fontSize: 100, fill: 0xfff200, align: 'left'});
        this.addChild(this._txWin);
        this._txWin.x = 100;
        this._txWin.y= 100;
        this.pivot = new PIXI.Point(this.width/2, this.height/2);
        this.visible = false;

    }
    public show():void{
        this.visible = true;
    }
    public hide():void{
        this.visible = false;
    }
}