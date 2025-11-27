import * as BABYLON from 'babylonjs';
import { Construction } from '../entities';
import { LineService } from './LineService';

export class DrawService {
    constructor(private lineService: LineService) {
    }

    drawConstruction(construction: Construction) {
        this.lineService.clearAllLines();

        const geom = construction.geometry;
        for (const m of geom.members) {
            const n1 = geom.idToNode.get(m.node1Id);
            const n2 = geom.idToNode.get(m.node2Id);
            if (!n1 || !n2) {
                if (!n1) console.warn(`Invalid Node1Id for member ${m.id}: Node1Id=${m.node1Id}`);
                if (!n2) console.warn(`Invalid Node2Id for member ${m.id}: Node2Id=${m.node2Id}`);
                continue;
            }
            const p1 = new BABYLON.Vector3(n1.x, n1.y, n1.z);
            const p2 = new BABYLON.Vector3(n2.x, n2.y, n2.z);
            this.lineService.drawLine(p1, p2, { color: new BABYLON.Color3(0.2, 0.6, 0.9) });
        }

        console.log(`Model displayed: ${geom.members.length} members drawn`);
    }
}

