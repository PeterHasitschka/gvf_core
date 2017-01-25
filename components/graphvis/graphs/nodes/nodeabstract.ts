import {ElementAbstract} from "../elementabstract";
import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {DataAbstract} from "../../data/abstract";
export abstract class NodeAbstract extends ElementAbstract {


    protected nodeMesh:THREE.Mesh;

    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane) {

        super(x, y, plane);
        this.name = "Node Abstract";

        this.nodeMesh = new THREE.Mesh(new THREE.CircleGeometry(
            GraphVisConfig.graphelements.abstractnode.size,
            GraphVisConfig.graphelements.abstractnode.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: GraphVisConfig.graphelements.abstractnode.color
                }));

        this.add(this.nodeMesh);
        //this.nodeMesh['onIntersectStart'] = this.onIntersectStart;
    }


    public setColor(color:number):void {
        super.setColor(color);
        this.nodeMesh.material['color'].setHex(color);
    }


    public highlight() {
        super.highlight();
        this.nodeMesh.material['color'].setHex(this.highlightColor);
    }


    public deHighlight() {
        super.deHighlight();
        this.nodeMesh.material['color'].setHex(this.color);
    }
}
