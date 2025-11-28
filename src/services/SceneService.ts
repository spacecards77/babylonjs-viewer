import * as BABYLON from 'babylonjs';
// @ts-ignore: IDE sometimes can't resolve babylonjs-gui's declaration bundling
import * as GUI from 'babylonjs-gui';
import {JsonService} from './JsonService';
import {LineService, LineType} from './LineService';
import {UploadService} from './UploadService';
import {DrawService} from "./DrawService";
import {Construction} from "../entities";
import {AdvancedDynamicTexture} from "babylonjs-gui/2D/advancedDynamicTexture";

export class SceneService {
    private construction: Construction | null = null;
    private jsonService: JsonService | null = null;
    private lineService: LineService | null = null;
    private drawService: DrawService | null = null;
    private lineType: LineType = LineType.Box;

    createServices(scene: BABYLON.Scene) {
        this.jsonService = new JsonService();
        this.lineService = new LineService(scene, {lineWidth: 0.2, lineType: this.lineType});
        this.drawService = new DrawService(this.lineService);
    }

    createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        const scene = this.createSceneWithCameraAndLight(engine, canvas);

        this.createServices(scene);

        //UI
        const uiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.createLineTypeRadio(uiTexture);
        this.createUploadButton(uiTexture);

        return scene;
    }

    private createUploadButton(uiTexture: AdvancedDynamicTexture) {
        const btnLoadJson = GUI.Button.CreateSimpleButton("btnLoadJson", "Загрузить JSON");
        btnLoadJson.width = "130px";
        btnLoadJson.height = "60px";
        btnLoadJson.color = "white";
        btnLoadJson.background = "green";
        btnLoadJson.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        btnLoadJson.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        btnLoadJson.left = "-320px";
        btnLoadJson.top = "-250px";
        uiTexture.addControl(btnLoadJson);

        btnLoadJson.onPointerUpObservable.add(() => {
            UploadService.uploadJson((jsonContent) => {
                if (this.jsonService)
                    this.construction = this.jsonService.deserialize(jsonContent);

                //console.log('Deserialized construction:', this.construction);

                if (this.construction) {
                    this.drawConstruction();
                } else {
                    console.error('Failed to deserialize construction.');
                }
            });
        });
    }

    private createLineTypeRadio(uiTexture: AdvancedDynamicTexture) {
        // NEXT: Use structure like below
        /*const lineTypeOptions = [
            {text: "Box", value: LineType.Box},
            {text: "Cylinder", value: LineType.Cylinder},
            {text: "Line", value: LineType.Line}
        ];*/

        const lineTypeDropdown = new GUI.SelectionPanel("lineTypePanel");
        lineTypeDropdown.width = "130px";
        lineTypeDropdown.height = "150px";
        lineTypeDropdown.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        lineTypeDropdown.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        lineTypeDropdown.left = "-320px";
        lineTypeDropdown.top = "-320px";
        lineTypeDropdown.color = "white";
        lineTypeDropdown.background = "green";
        uiTexture.addControl(lineTypeDropdown);

        const group = new GUI.RadioGroup("Тип");
        group.addRadio("Паралл.", () => {
            this.lineType = LineType.Box;
            this.drawConstruction();
        }, true);
        group.addRadio("Цилиндр", () => {
            this.lineType = LineType.Cylinder;
            this.drawConstruction();
        });
        group.addRadio("Линия", () => {
            this.lineType = LineType.Line;
            this.drawConstruction();
        });

        lineTypeDropdown.addGroup(group);
    }

    private createSceneWithCameraAndLight(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, 20, new BABYLON.Vector3(20, -20, 20), scene);
        camera.setTarget(new BABYLON.Vector3(20, 20, 10));
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.5;
        return scene;
    }

    private drawConstruction() {
        if (this.construction && this.drawService && this.lineService) {
            this.drawService.drawConstruction(this.construction, {
                color: new BABYLON.Color3(0.2, 0.6, 0.9),
                lineType: this.lineType
            });
        }
    }
}
