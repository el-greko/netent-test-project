import Slot from './Slot';
import {Power0, Power4, TweenLite} from 'gsap';


export default class Reel extends PIXI.Container{
    private DEF_ROWS = 3;
    private DEF_REELSTRIP: Array<any> = [0, 1, 2];

    private SLOTS_DISTANCE: number = 170;

    private _rows: number;
    private _reelStrip: Array<number> = [];


    private _slots: Array<Slot> = [];

    private _rollSpeed: number = 0.03;// in seconds
    private _slotsMovingCounter: number = 0;

    private _stopSympol: number = -1;

    private _slotsContainer: PIXI.Container;

    private _slotsMoving: TweenLite;
   

    private reelObj = {y: 0};
    // private _tweens: Array<tweens.Tween> = [];
    private _reelContainer;

    private _isSpining: boolean = false;

    private _reelMask: PIXI.Graphics;

    /**
     *
     * @param params = {slotsrows: number, reelstrip: Array<number>, textures: Array<string>}
     */
    public init(params): void{
        //console.log('test tweeners : ', TweenLite);
        this.onMovingComplete.bind(this);
        this.onAcceleratingComplete.bind(this);
        this.onSlowingComplete.bind(this);
        this._slotsContainer = new PIXI.Container();
        this.addChild(this._slotsContainer);
        this._rows = params.slotsrows === undefined ? this.DEF_ROWS : params.slotsrows;
        this._reelStrip = params.reelstrip === undefined ? this.DEF_REELSTRIP : params.reelstrip;
        for (let row = 0; row < this._rows + 1; row++){
            let slot = new Slot();
            slot.init(params.textures);
            slot.y = (row - 1) * this.SLOTS_DISTANCE;

            this._slots.push(slot);

            this._slotsContainer.addChild(slot);

        }
        this.fixSlotsTextures();

        this._reelMask = new PIXI.Graphics();
        this._reelMask.beginFill(0x000000);
        this._reelMask.drawRect(-this._slotsContainer.width / 2, -10, this._slotsContainer.width, this._rows * this.SLOTS_DISTANCE);
        this.addChild(this._reelMask);

        this._slotsContainer.mask = this._reelMask;

    }


    private onMovingComplete(...args): void{
        this.fixSlotsPositions();
        this.fixSlotsTextures();

        let currposition = this._slotsMovingCounter % this._reelStrip.length;

        if (this._stopSympol > 0 && currposition === this._stopSympol - 1){
            this.slowup();
        } else if (this._stopSympol === 0 && currposition === this._reelStrip.length - 1){
            this.slowup();
        } else if (this._stopSympol === -1){
            this.keepgoing();
        } else {
            this.keepgoing();
            // console.log('onMovingComplete: stopSymbol: ', this._stopSympol, ', currposition: ', currposition);
        }


    }


    private onAcceleratingComplete(...args): void{

        this.fixSlotsPositions();
        this.fixSlotsTextures();
    }

    private onSlowingComplete(...args): void{
        this.fixSlotsPositions();
        this.fixSlotsTextures();
        ////console.log('Reel.is.stopped!: ', args, this);
    }

    private fixSlotsTextures(): void{
        this._slots.forEach((item) =>{
            let sym = this._reelStrip[Math.abs(Math.floor(item.y / this.SLOTS_DISTANCE)) % this._reelStrip.length];
            item.currentSymbol = sym;

        }, this);
    }

    private fixSlotsPositions(): void{

        this._slots.forEach((item) =>{
            if (this._slotsContainer.y + item.y >= this._rows * this.SLOTS_DISTANCE){
                item.y -= (this._rows + 1) * this.SLOTS_DISTANCE;
                // item.currentSymbol = Math.froor(item.y/this.SLOTS_DISTANCE);
            }

        }, this);
    }

    public spin(delay): void{
        ////console.log('REEL.spin() delay: ', delay);
        this._isSpining = true;
        this._stopSympol = -1;
        if (delay){
            TweenLite.delayedCall(delay, this.accelerate.bind(this));
        } else {
            this.accelerate();
        }

    }

    public stop(pos, delay): void{
        // console.log('reel.stop() position: ', pos);

        if (this._isSpining && this._stopSympol < 0){
            if (delay){
                TweenLite.delayedCall(delay, () =>{
                    this._stopSympol = pos;

                });
            } else {
                this._stopSympol = pos;

            }

        }
    }


    private accelerate(): void{
        this._slotsMovingCounter++;
        TweenLite.to(this._slotsContainer, this._rollSpeed * 10, {
            onComplete: this.onMovingComplete.bind(this),
            ease: Power4.easeIn,
            y: this._slotsMovingCounter * this.SLOTS_DISTANCE
        });
    }


    private keepgoing(): void{
        this._slotsMovingCounter++;
        ////console.log('Reel.keepgoing: ');
        TweenLite.to(this._slotsContainer, this._rollSpeed, {
            onComplete: this.onMovingComplete.bind(this),

            ease: Power0.easeNone,
            y: this._slotsMovingCounter * this.SLOTS_DISTANCE
        });


    }

    private slowup(): void{
        this._slotsMovingCounter++;
        TweenLite.to(this._slotsContainer, this._rollSpeed * 10, {
            onComplete: this.onSlowingComplete.bind(this),
            ease: Power4.easeOut,
            y: this._slotsMovingCounter * this.SLOTS_DISTANCE
        });
    }

    public set reelPosition(pos: number){
        let newOffset = pos - this._slotsMovingCounter;
        this._slotsMovingCounter = pos;
        this._slotsContainer.y = this._slotsMovingCounter * this.SLOTS_DISTANCE;

        this._slots.forEach((item) =>{
            item.y -= this.SLOTS_DISTANCE * newOffset;
            // letthis._slotsContainer.y + item.y
            /* if (this._slotsContainer.y + item.y >= this._rows * this.SLOTS_DISTANCE){
                 item.y -=this._slotsContainer.y;
             }
             if (this._slotsContainer.y + item.y < - this.SLOTS_DISTANCE){
                 item.y +=this._slotsContainer.y;
             }*/

        }, this);
        this.fixSlotsTextures();


    }

    public get reelPosition(): number{
        return this._slotsMovingCounter;
    }
}