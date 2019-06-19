import {TweenLite} from 'gsap';
import observerSingleton from './Observer';

export const ACTION_INIT: string = 'action.send.init';
export const ACTION_BET: string = 'action.send.bet';

export const EVENT_RESPONSE_INIT: string = 'event.response.init';
export const EVENT_RESPONSE_BET: string = 'event.response.bet';


class DataProvider{


    private initMock = {

        reelstrips: [
            [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
            [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
            [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]
        ],
        initpos: [0, 0, 0],
        balance: 100,
        bet: 5
    };


    private spinMock = [
        {win: 0, reelspos: [0, 4, 9]},
        {win: 0, reelspos: [1, 2, 3]},
        {win: 0, reelspos: [0, 4, 9]},
        {win: 10, reelspos: [2, 2, 2]},
        {win: 0, reelspos: [0, 4, 9]},
        {win: 0, reelspos: [5, 3, 1]},
        {win: 0, reelspos: [2, 4, 4]},
        {win: 10, reelspos: [0, 4, 4]}

    ];

    public responseInit: any;
    public responseBet: any;


    private _isBusy: boolean = false;
    private _balance: number = 0;
    private _bet: number = 0;

    public send(action: string): void{
        this._isBusy = true;
        // TweenLite.delayedCall(1, () =>{
        //this.onResponse({});
        switch(action){
            case ACTION_INIT:
                TweenLite.delayedCall(1, () =>{
                    this.responseInit = this.initMock;
                    this._balance = this.responseInit.balance;
                    this._bet = this.responseInit.bet;
                    observerSingleton.emit(EVENT_RESPONSE_INIT, this.responseInit);
                });
                break;
            case ACTION_BET:
                if (this.balance - this.bet > 0){
                    this.balance -= this.bet;
                    TweenLite.delayedCall(1, () =>{
                        this.responseBet = this.getRandomSpinMock();
                         this._balance += this.responseBet.win;

                        observerSingleton.emit(EVENT_RESPONSE_BET, this.responseBet);
                    });
                }
                break;
        }

        // });
    }

    private getRandomSpinMock(): any{
       return this.spinMock[Math.floor(Math.random() * this.spinMock.length)];
    }

    public set balance(bl: number){
        this._balance = bl;
    }

    public get balance(): number{
        return this._balance;
    }

    public set bet(bt: number){
        this._bet = bt;
    }
    public get bet(): number{
        return this._bet;
    }


}


export const provider = new DataProvider();