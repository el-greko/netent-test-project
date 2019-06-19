import Stage = PIXI.core.Stage;
import Scene from '../scenes/Scene';

export default class ScenesManager{

    private _scenes = {};
    private _mainApp: PIXI.Application;
    private _mainContainer: PIXI.Container;
    private _curSceneName: string;

    public init(application): void{
        this._mainApp= application;
        this._mainContainer = new PIXI.Container();
        this._mainApp.stage.addChild(this._mainContainer);
    }

    public add(name: string, scene: Scene): void{
        this._scenes[name] = scene;
        scene.init(this._mainApp);
        this._mainContainer.addChild(scene);
    }

    public run(name): void{
        this._curSceneName = name;
        this._scenes[name].run(name);
    }

    public get currScene(): Scene{
       return this._scenes[this._curSceneName];
    }

}