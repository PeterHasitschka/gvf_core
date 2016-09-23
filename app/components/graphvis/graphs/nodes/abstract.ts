import {GraphVisConfig} from '../../config';
import {DataAbstract} from "../../data/abstract";
import {GraphObject} from "../graphobjectinterface";
import {Plane} from "../../../plane/plane";


/**
 * Abstract class of a Node for the GraphVis
 * Derived from the @see{THREE.Mesh} class.
 * Thus, it holds a geometry and a material
 * @author Peter Hasitschka
 */
export abstract class NodeAbstract extends THREE.Mesh implements GraphObject {

    protected threeMaterial:THREE.MeshBasicMaterial;
    protected threeGeometry:THREE.Geometry;
    protected zPos;
    protected color:number;
    protected isHighlighted = false;
    protected highlightColor:number;
    protected plane:Plane;

    protected dataEntity:DataAbstract;

    constructor(x:number, y:number, plane:Plane) {

        var config = GraphVisConfig.nodes;

        let color = config.abstractnode.color;
        let highlightColor = config.abstractnode.highlight_color;

        var geometry = new THREE.CircleGeometry(
            config.abstractnode.size,
            config.segments);

        var material = new THREE.MeshBasicMaterial(
            {
                color: color
            });

        super(geometry, material);

        this.plane = plane;
        this.color = color;
        this.highlightColor = highlightColor
        this.threeGeometry = geometry;
        this.threeMaterial = material;
        this.zPos = config.abstractnode.z_pos;

        x = x === undefined ? 0.0 : x;
        y = y === undefined ? 0.0 : y;

        this.setPosition(x, y);
    }


    public setPosition(x:number, y:number):void {
        this.position.setX(x);
        this.position.setY(y);
    }

    public getPosition():THREE.Vector3 {
        return this.position;
    }

    public getDataEntity():DataAbstract {
        return this.dataEntity;
    }


    public highlightNode() {
        if (this.isHighlighted)
            return;
        this.isHighlighted = true;
        this.threeMaterial.color.setHex(this.highlightColor);
        this.plane.getGraphScene().render();
    }

    public deHighlightNode() {
        if (!this.isHighlighted)
            return;
        this.isHighlighted = false;
        this.threeMaterial.color.setHex(this.color);
        this.plane.getGraphScene().render();
    }

    public onIntersectStart():void {
        //console.log("Intersected a node " + this.dataEntity.getId());
        this.highlightNode();
    }

    public onIntersectLeave():void {
        //console.log("UN-Intersected a node " + this.dataEntity.getId());
        this.deHighlightNode();
    }
}