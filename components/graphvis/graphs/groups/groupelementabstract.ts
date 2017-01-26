import {Plane} from "../../../plane/plane";
import {BasicGroup} from "../../data/databasicgroup";
import {ElementAbstract} from "../graphelementabstract";
import {GraphVisConfig} from "../../config";
import {INTERGRAPH_EVENTS, InterGraphEventService} from "../../../../services/intergraphevents.service";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export abstract class GroupAbstract extends ElementAbstract {

    protected groupNodeMesh:THREE.Mesh;

    protected color = GraphVisConfig.graphelements.abstractgroup.color;

    constructor(x:number, y:number, protected dataEntity:BasicGroup, plane:Plane) {

        super(x, y, dataEntity, plane);

        this.groupNodeMesh = new THREE.Mesh(new THREE.CircleGeometry(
            GraphVisConfig.graphelements.abstractgroup.size,
            GraphVisConfig.graphelements.abstractgroup.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: this.color,
                    transparent: true,
                    opacity: 0.5
                }));

        this.add(this.groupNodeMesh);

        this.setColor(this.color);
    }


    public setScale(factor:number) {
        this.scale.set(factor, factor, factor);
    }


    public highlight() {
        super.highlight();
        this.groupNodeMesh.material['color'].setHex(this.highlightColor);
    }

    public deHighlight() {
        super.deHighlight();
        this.groupNodeMesh.material['color'].setHex(this.color);
    }

    public onIntersectStart():void {
        super.onIntersectStart();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.GROUP_HOVERED, this);
        this.plane.getGraphScene().render();
    }

    public onIntersectLeave():void {
        super.onIntersectLeave();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.GROUP_LEFT, this);
        this.plane.getGraphScene().render();
    }


    public setColor(color:number):void {
        super.setColor(color);
        this.groupNodeMesh.material['color'].setHex(color);
    }


}



