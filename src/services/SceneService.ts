import * as BABYLON from 'babylonjs';
// @ts-ignore: IDE sometimes can't resolve babylonjs-gui's declaration bundling
import * as GUI from 'babylonjs-gui';
import {JsonService} from './JsonService';
import {LineService, LineType} from './LineService';
import {UploadService} from './UploadService';
import {DrawService} from "./DrawService";
import {Construction} from "../entities";

export class SceneService {
    private construction: Construction | null = null;
    private jsonService: JsonService | null = null;
    private lineService: LineService | null = null;
    private drawService: DrawService | null = null;
    private lineType: LineType = LineType.Box;

    createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, 20, new BABYLON.Vector3(20, -20, 20), scene);
        camera.setTarget(new BABYLON.Vector3(20, 20, 10));
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        //services
        this.jsonService = new JsonService();
        this.lineService = new LineService(scene, {lineWidth: 0.08});
        this.drawService = new DrawService(this.lineService);

        //UI
        const uiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // TODO: Use structure like below
        /*const lineTypeOptions = [
            {text: "Box", value: LineType.Box},
            {text: "Cylinder", value: LineType.Cylinder},
            {text: "Line", value: LineType.Line}
        ];*/

        const lineTypeDropdown = new GUI.SelectionPanel("lineTypePanel");
        lineTypeDropdown.width = "120px";
        lineTypeDropdown.height = "150px";
        lineTypeDropdown.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        lineTypeDropdown.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        lineTypeDropdown.left = "-320px";
        lineTypeDropdown.top = "-320px";
        uiTexture.addControl(lineTypeDropdown);

        const group = new GUI.RadioGroup("Line Type");
        group.addRadio("Box", (ind) => {
            this.lineType = LineType.Box;
            this.drawConstruction();
        }, true);
        group.addRadio("Cylinder", (ind) => {
            this.lineType = LineType.Cylinder;
            this.drawConstruction();
        });
        group.addRadio("Line", (ind) => {
            this.lineType = LineType.Line;
            this.drawConstruction();
        });

        lineTypeDropdown.addGroup(group);


        const btnLoadJson = GUI.Button.CreateSimpleButton("btnLoadJson", "Load Json");
        btnLoadJson.width = "120px";
        btnLoadJson.height = "40px";
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
