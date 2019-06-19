import Component from './Component';
import observerSingleton from '../managers/Observer';

export default class InfoPanel extends Component{
    public static EVENT_BALANCE_UPDATED: string = 'event.balance.updated';
    public static EVENT_WIN_UPDATED: string = 'event.win.updated';

    private _tfStyle = {fontFamily: 'Arial', fontSize: 18, fill: 0xfff200, align: 'left'};

    private _backPanel: PIXI.Graphics;
    private _txBalanceAmount: PIXI.Text;
    private _txWinAmount: PIXI.Text;

    public init(): void{

        this._backPanel = new PIXI.Graphics();
        this._backPanel.beginFill(0x000000);
        this._backPanel.drawRect(0, 0, 120, 60);
        this.addChild(this._backPanel);

        let txBalance = new PIXI.Text('money: ', this._tfStyle);
        this.addChild(txBalance);
        txBalance.x = 7;
        txBalance.y= 8;

        this._txBalanceAmount =new PIXI.Text('0', this._tfStyle);
        this.addChild(this._txBalanceAmount);
        this._txBalanceAmount.x = 86;
        this._txBalanceAmount.y= 7;


        let txWin = new PIXI.Text('win: ', this._tfStyle);
        txWin.y = 50;
        this.addChild(txWin);
        txWin.x=7;
        txWin.y=32

        this._txWinAmount =new PIXI.Text('0', this._tfStyle);
        this.addChild(this._txWinAmount);
        this._txWinAmount.y=32;
        this._txWinAmount.x=86;

        this.subscribe();
    }

    private subscribe(): void{
        observerSingleton.addListener(InfoPanel.EVENT_BALANCE_UPDATED, this.updateBalance);
        observerSingleton.addListener(InfoPanel.EVENT_WIN_UPDATED, this.updateWin);

    }

    public updateBalance(balance): void{
        this._txBalanceAmount.text = balance.toString();
    }

    public updateWin(win): void{
        this._txWinAmount.text = win.toString();
    }



}