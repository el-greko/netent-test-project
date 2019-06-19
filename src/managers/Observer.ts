
const observerSingleton: PIXI.utils.EventEmitter = new PIXI.utils.EventEmitter();
export default observerSingleton;
//TODO: just for tests
window['observer'] = observerSingleton;