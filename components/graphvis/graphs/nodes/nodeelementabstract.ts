import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {DataAbstract} from "../../data/dataabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../services/intergraphevents.service";
import {EdgeAbstract} from "../edges/edgeelementabstract";
export abstract class NodeAbstract extends ElementAbstract {


    protected nodeMesh:THREE.Mesh;

    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane) {

        super(x, y, dataEntity, plane);
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
        this.nodeMesh.material['color'].setHex(this.highlightColor);

        // this.edges.forEach((e:EdgeAbstract) => {
        //     e.highlight();
        // });
        super.highlight();
    }


    public deHighlight() {
        this.nodeMesh.material['color'].setHex(this.color);
        // this.edges.forEach((e:EdgeAbstract) => {
        //     e.deHighlight();
        // });
        super.deHighlight();
    }


    /**
     * On Mouse-Hover
     * Sending an Event for notifying that node was intersected
     */
    public onIntersectStart():void {
        super.onIntersectStart();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.NODE_HOVERED, this);
        this.plane.getGraphScene().render();
    }

    /**
     * On Mouse-Leave
     * Sending an Event for notifying that node was left
     */
    public onIntersectLeave():void {
        super.onIntersectLeave();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.NODE_LEFT, this);
        this.plane.getGraphScene().render();
    }
}
