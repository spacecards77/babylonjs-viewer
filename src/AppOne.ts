import * as BABYLON from 'babylonjs'
import { SceneService } from './services/SceneService';
export class AppOne {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    sceneService: SceneService;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas)
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
        this.sceneService = new SceneService();
        this.scene = this.sceneService.createScene(this.engine, this.canvas)

    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(true);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}
