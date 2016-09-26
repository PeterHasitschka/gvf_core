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
    private sourceNode:NodeAbstract;
    private destNode:NodeAbstract;

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

        this.color = color;
        this.threeGeometry = geometry;
        this.threeMaterial = material;
        this.zPos = config.abstractedge.z_pos;
    }

    public setColor(color:number) {
        this.color = color;
        this.threeMaterial.color.setHex(color);
    }

    public updatePositions(){
        console.warn("Implement");
    }

    public onIntersectStart():void {
        //console.log("Intersected an edge");
    }

    public onIntersectLeave():void {
        //console.log("UN-Intersected an edge");
    }
}


