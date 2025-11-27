import * as BABYLON from 'babylonjs';
// @ts-ignore: IDE sometimes can't resolve babylonjs-gui's declaration bundling
import * as GUI from 'babylonjs-gui';
import { JsonService } from './JsonService';
import { LineService } from './LineService';
import { UploadService } from './UploadService';
import {DrawService} from "./DrawService";

export class SceneService {
    createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, 20, new BABYLON.Vector3(20, -20, 20), scene);
        camera.setTarget(new BABYLON.Vector3(20, 20, 10));
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        //UI
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const button = GUI.Button.CreateSimpleButton("btnLoadJson", "Load Json");
        button.width = "120px";
        button.height = "40px";
        button.color = "white";
        button.background = "green";
        button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.left = "-320px";
        button.top = "-250px";
        advancedTexture.addControl(button);

        const jsonService = new JsonService();
        const lineService = new LineService(scene, { lineWidth: 0.08 });
        const drawService = new DrawService(lineService);

        button.onPointerUpObservable.add(() => {
            UploadService.uploadJson((jsonContent) => {
                const construction = jsonService.deserialize(jsonContent);
                //console.log('Deserialized construction:', construction);

                drawService.drawConstruction(construction);
            });
        });

        return scene;
    }
}
