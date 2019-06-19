import Component from './Component';
import Reel from './Reel';
import observerSingleton from '../managers/Observer';



const CONFIG = {
    textures: ['sym.0', 'sym.1', 'sym.2', 'sym.3', 'sym.4', 'sym.5'],
    reels: [
        {x: 186, y: 20, rows: 3, spinDelay: 0.2, stopDelay: 0.1},
        {x: 427, y: 20, rows: 3, spinDelay: 0.4, stopDelay: 0.4},
        {x: 670, y: 20, rows: 3, spinDelay: 0.6, stopDelay: 0.7}
    ],
};



export default class SlotMachine extends Component{
   public static EVENT_SLOTS_SPIN: string = 'slots.spin';


    private _reels: Array<Reel> = [];
    private _textures: Array<string> = [];
    private _reelStrips: Array<any> = [];
    private _reelInitPositions: Array<number> = [];

    /**
     *
     * @param params = {textures: Array<string>, reelstrips: Array<Array<number>>, initpos: Array<number>}
     */
    public init(params): void{
        this._textures = CONFIG.textures;
        this._reelStrips = params.reelstrips;
        this._reelInitPositions = params.initpos;
        this.build();
        observerSingleton.addListener(SlotMachine.EVENT_SLOTS_SPIN, this.spin, this);

    }

    public build(): void{
        CONFIG.reels.forEach((rconf, idx) =>{
            let reel: Reel = new Reel();
            reel.x = rconf.x;
            reel.y = rconf.y;
            reel.init({slotsrows: rconf.rows, reelstrip: this._reelStrips[idx], textures: this._textures});
            reel.reelPosition = this._reelInitPositions[idx];
            this.addChild(reel);
            this._reels.push(reel);
        });
    }

    public spin(): void{
        this._reels.forEach((reel: Reel, idx: number) =>{
            reel.spin(CONFIG.reels[idx].spinDelay);
        });
    }

    public stop(reelsposition: Array<any>): void{
       // console.log('SlotMachine.stop reelpositions: ', reelsposition);
        reelsposition.forEach((item, idx) =>{
           this._reels[idx].stop(item, CONFIG.reels[idx].stopDelay);
        });
    }

    public setPositions(reelsposition: Array<any>):void{
        reelsposition.forEach((item, idx) =>{
            this._reels[idx].reelPosition = item;//stop(item, CONFIG.reels[idx].stopDelay);
        });
    }
}