import 'pixi.js';
import ScenesManager from './managers/ScenesManager';
import GameScene from './scenes/GameScene';

const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundColor: 0x1099bb,
    width: 960,
    height: 536
});
document.body.appendChild(app.view);

const scenesManager = new ScenesManager();
scenesManager.init(app);
scenesManager.add(GameScene.NAME, new GameScene());
scenesManager.run(GameScene.NAME);

window['scenes'] = scenesManager;
let size = [960, 536];
let ratio = size[0] / size[1];
function resize() {
    let w,h;
    if (window.innerWidth / window.innerHeight >= ratio) {
        w = window.innerHeight * ratio;
        h = window.innerHeight;
    } else {
        w = window.innerWidth;
        h = window.innerWidth / ratio;
    }
    app.renderer.view.style.width = w + 'px';
    app.renderer.view.style.height = h + 'px';
    app.renderer.view.style.marginTop = (window.innerHeight-h)/2+'px';
    app.renderer.view.style.marginLeft = (window.innerWidth-w)/2+'px';


}

window.addEventListener('resize', resize);

resize();