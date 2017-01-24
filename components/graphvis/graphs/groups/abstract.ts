import {Plane} from "../../../plane/plane";
import {BasicGroup} from "../../data/basicgroup";
import {ElementAbstract} from "../elementabstract";
import {GraphVisConfig} from "../../config";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export abstract class GroupAbstract extends ElementAbstract {

    constructor(x:number, y:number, protected group:BasicGroup, plane:Plane) {

        super(x, y, plane, new THREE.CircleGeometry(
            GraphVisConfig.graphelements.abstractgroup.size,
            GraphVisConfig.graphelements.abstractgroup.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: GraphVisConfig.graphelements.abstractgroup.color
                })
        );
        this.color = GraphVisConfig.graphelements.abstractgroup.color;
        this.setColor(this.color);
    }

    public onIntersectStart():void {
        super.onIntersectStart();
        this.plane.getGraphScene().render();
    }

    public onIntersectLeave():void {
        super.onIntersectLeave();
        this.plane.getGraphScene().render();
    }
}