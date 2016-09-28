import {GraphVisConfig} from '../../config';
import {start} from "repl";
import {GraphObject} from "../graphobjectinterface";
import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "../nodes/abstract";


/**
 * Abstract class of an Edge for the GraphVis
 * Derived from the @see{THREE.Line} class.
 * Thus, it holds a geometry and a material
 * @author Peter Hasitschka
 */
export abstract class EdgeAbstract extends THREE.Line implements GraphObject {


    protected threeMaterial:THREE.LineBasicMaterial;
    protected threeGeometry:THREE.Geometry;
    protected zPos;
    protected color:number;
    protected plane:Plane;
    protected sourceNode:NodeAbstract;
    protected destNode:NodeAbstract;


    constructor(sourceNode:NodeAbstract, destNode:NodeAbstract, plane:Plane) {

        let startX:number = sourceNode.getPosition()['x'];
        let startY:number = sourceNode.getPosition()['y'];
        let endX:number = destNode.getPosition()['x'];
        let endY:number = destNode.getPosition()['y'];

        let config = GraphVisConfig.edges;
        let color = config.abstractedge.color;

        let material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: config.abstractedge.thickness
        });
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(startX, startY, config.abstractedge.z_pos));
        geometry.vertices.push(new THREE.Vector3(endX, endY, config.abstractedge.z_pos));


        super(geometry, material);
        this.plane = plane;

        this.sourceNode = sourceNode;
        this.destNode = destNode;

        this.color = color;
        this.threeGeometry = geometry;
        this.threeMaterial = material;
        this.zPos = config.abstractedge.z_pos;
    }

    public setColor(color:number) {
        this.color = color;
        this.threeMaterial.color.setHex(color);
    }

    public updatePositions() {
        //console.warn("Implement");
        this.threeGeometry.vertices[0]['x'] = this.sourceNode.getPosition()['x'];
        this.threeGeometry.vertices[0]['y'] = this.sourceNode.getPosition()['y'];
        this.threeGeometry.vertices[1]['x'] = this.destNode.getPosition()['x'];
        this.threeGeometry.vertices[1]['y'] = this.destNode.getPosition()['y'];
        this.threeGeometry.verticesNeedUpdate = true;


    }

    public onIntersectStart():void {
        //console.log("Intersected an edge");
    }

    public onIntersectLeave():void {
        //console.log("UN-Intersected an edge");
    }

    public getSourceNode():NodeAbstract {
        return this.sourceNode;
    }

    public getDestNode():NodeAbstract {
        return this.destNode;
    }
}


