import {DataAbstract} from "../../data/dataabstract";
import {Plane} from "../../../plane/plane";
import {NodeSimple} from "./nodelementsimple";
import {NodeAbstract} from "./nodeelementabstract";
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {EdgeColored} from "../edges/edgeelementcolored";

/**
 * A shadow node is directly linked with another node of the same entity. to e.g. point to it from somewhere
 * @author Peter Hasitschka
 */
export class ShadowNodeSimple extends NodeSimple {

    private linkedNode:NodeAbstract;
    private link:EdgeAbstract;

    constructor(x:number, y:number, linkedNode:NodeAbstract, plane:Plane, options:Object) {
        super(x, y, linkedNode.getDataEntity(), plane, options);
        this.setColor(0x000000);
        this.linkedNode = linkedNode;

        this.link = new EdgeColored(this, this.linkedNode, this.plane, 0x000000);
        this.plane.getGraphScene().addObject(this.link);
        this.addEdge(this.link);
        this.linkedNode.addEdge(this.link);
    }
}