

import IPopup from '../popups/IPopup';

export default class Scene extends PIXI.Container{
    protected _mainApp: PIXI.Application;

    protected _loaded: boolean = false;

    protected _content: PIXI.Container;
    protected _popups: PIXI.Container;

    protected _scenePopups = {};
    protected _center: PIXI.Point;

    public init(application): void{
        this._mainApp = application;
        this._content = new PIXI.Container();
        this._popups = new PIXI.Container();
        this.addChild(this._content);
        this.addChild(this._popups);
    }

    public run(): void{

    }

    protected load(assets: Array<any> = []): void{
        //console.log('scene load ', assets);
        if (!this._loaded){
            assets.forEach((item) =>{
                this._mainApp.loader.add(item.name, item.url);
            }, this);
            this._mainApp.loader.load(this.loaded);
        } else {
            this.loaded();
        }
    }



    protected loaded(): void{
        this._loaded = true;
    }

    protected getPopup(name):IPopup{
        return this._scenePopups[name];
    }

    protected initPopups(popups: Array<any>): void{
        popups.forEach((item) =>{
            this._scenePopups[item.name] = item.popup;
            this._scenePopups[item.name].init();
            if(this._center){
                item.popup.x = this._center.x; // - item.popup.centerPoint.x;
                item.popup.y = this._center.y; // - item.popup.centerPoint.x;

            }
            this._popups.addChild(item.popup);
        });
    }

    public resize(width, height): void{

    }

}