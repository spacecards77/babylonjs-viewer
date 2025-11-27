import * as BABYLON from 'babylonjs';
// @ts-ignore: IDE sometimes can't resolve babylonjs-gui's declaration bundling
import * as GUI from 'babylonjs-gui';

export class SceneService {
    createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        //UI
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var button = GUI.Button.CreateSimpleButton("btnLoadJson", "Load Json");
        // place button in the bottom-right with a small margin
        button.width = "120px";
        button.height = "40px";
        button.color = "white";
        button.background = "green";
        button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.left = "-320px";
        button.top = "-250px";
        advancedTexture.addControl(button);

        // Our built-in 'sphere' shape.
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
        // Move the sphere upward 1/2 its height
        let startPos = 2;
        sphere.position.y = startPos;

        // Our built-in 'ground' shape.
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.8, 0.5); // RGB for a greenish color
        ground.material = groundMaterial;
        groundMaterial.bumpTexture = new BABYLON.Texture("./normal.jpg", scene);
        //groundMaterial.bumpTexture.level = 0.125;


        var redMaterial = new BABYLON.StandardMaterial("redMaterial", scene);
        redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // RGB for red
        sphere.material = redMaterial;

        var sphereVelocity = 0;
        var gravity = 0.009;
        var reboundLoss = 0.1;

        scene.registerBeforeRender(() => {
            sphereVelocity += gravity;
            let newY = sphere.position.y - sphereVelocity;
            sphere.position.y -= sphereVelocity
            if (newY < 1) {
                sphereVelocity = (reboundLoss - 1) * sphereVelocity;
                newY = 1;
            }
            sphere.position.y = newY;
            if (Math.abs(sphereVelocity) <= gravity && newY < 1 + gravity) {
                sphere.position.y = startPos++;
            }
        });

        return scene;
    }
}
