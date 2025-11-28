import * as BABYLON from 'babylonjs';

export enum LineType {
    Box,
    Cylinder,
    Line
}

export class LineService {
    private _lines: BABYLON.Mesh[] = [];
    private readonly _scene: BABYLON.Scene;
    private readonly _lineWidth: number;
    private readonly _defaultLineType: LineType;

    constructor(scene: BABYLON.Scene, options: { lineWidth: number, lineType?: LineType }) {
        this._scene = scene;
        this._lineWidth = options.lineWidth;
        this._defaultLineType = options.lineType ?? LineType.Box;
    }

    drawLine(start: BABYLON.Vector3, end: BABYLON.Vector3, options?: { color?: BABYLON.Color3, lineType?: LineType }): BABYLON.Mesh {
        const lineType = options?.lineType ?? this._defaultLineType;
        const distance = BABYLON.Vector3.Distance(start, end);

        let line: BABYLON.Mesh;

        switch (lineType) {
            case LineType.Box:
                line = BABYLON.MeshBuilder.CreateBox("line", {
                    width: this._lineWidth,
                    height: this._lineWidth,
                    depth: distance
                }, this._scene);
                break;

            case LineType.Cylinder:
                line = BABYLON.MeshBuilder.CreateCylinder("line", {
                    height: distance,
                    diameter: this._lineWidth
                }, this._scene);
                break;

            case LineType.Line:
                line = BABYLON.MeshBuilder.CreateLines("line", {
                    points: [start, end]
                }, this._scene);
                break;
        }

        if (lineType !== LineType.Line) {
            line.position = start.add(end).scale(0.5);

            const direction = end.subtract(start).normalize();
            const up = (lineType === LineType.Cylinder) ? new BABYLON.Vector3(0, 1, 0) : new BABYLON.Vector3(0, 0, 1);
            let axis = BABYLON.Vector3.Cross(up, direction);
            let angle = Math.acos(BABYLON.Vector3.Dot(up, direction));

            if (axis.length() < 0.001) {
                axis = new BABYLON.Vector3(1, 0, 0);
            }

            line.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis.normalize(), angle);

            if (options?.color) {
                const material = new BABYLON.StandardMaterial("lineMaterial", this._scene);
                material.diffuseColor = options.color;
                line.material = material;
            }
        }

        this._lines.push(line);
        return line;
    }

    clearAllLines(): void {
        for (const line of this._lines) {
            line.dispose();
        }
        this._lines = [];
    }
}
