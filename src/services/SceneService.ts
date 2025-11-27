import * as BABYLON from 'babylonjs';
// @ts-ignore: IDE sometimes can't resolve babylonjs-gui's declaration bundling
import * as GUI from 'babylonjs-gui';
import { JsonService } from './JsonService';
import { LineService } from './LineService';

export class SceneService {
    createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        var scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        //UI
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var button = GUI.Button.CreateSimpleButton("btnLoadJson", "Load Json");
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
        const lineService = new LineService(scene, { lineWidth: 0.1 });

        button.onPointerUpObservable.add(() => {
            const sampleJson = `{
  "Geometry": {
    "Nodes": [
      {
        "ID": 1,
        "X": 0,
        "Y": 4.5,
        "Z": -0.3
      },
      {
        "ID": 2,
        "X": -0.10945409092309966,
        "Y": 10.5,
        "Z": 7.494540909230988
      },
      {
        "ID": 3,
        "X": -0.10945409092309966,
        "Y": 16.5,
        "Z": 7.494540909230988
      }
    ],
    "Members": [
      {
        "ID": 1,
        "N1": 1,
        "N2": 2
      },
      {
        "ID": 2,
        "N1": 2,
        "N2": 3
      },
      {
        "ID": 3,
        "N1": 3,
        "N2": 1
      }
    ],
    "Sections": {}
  },
  "Materials": {},
  "Constraints": {},
  "Releases": {}
}`;
            const construction = jsonService.deserialize(sampleJson);
            console.log('Deserialized construction:', construction);

            // Clear previously drawn lines
            lineService.clearAllLines();

            lineService.drawLine(new BABYLON.Vector3(1, 1, 1),
                new BABYLON.Vector3(2, 2, 2));
            lineService.drawLine(new BABYLON.Vector3(2, 2, 2),
                new BABYLON.Vector3(3, 0, 3));
            lineService.drawLine(new BABYLON.Vector3(3, 0, 3),
                new BABYLON.Vector3(1, 1, 1));
            // Draw a line for each member between its two nodes
            /*const geom = construction.geometry;
            for (const m of geom.members) {
                const n1 = geom.idToNode.get(m.node1Id);
                const n2 = geom.idToNode.get(m.node2Id);
                if (!n1 || !n2) continue;
                const p1 = new BABYLON.Vector3(n1.x, n1.y, n1.z);
                const p2 = new BABYLON.Vector3(n2.x, n2.y, n2.z);
                lineService.drawLine(p1, p2, { color: new BABYLON.Color3(0.2, 0.6, 0.9) });
            }*/
        });

        /*// Our built-in 'sphere' shape.
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
        });*/

        return scene;
    }
}
