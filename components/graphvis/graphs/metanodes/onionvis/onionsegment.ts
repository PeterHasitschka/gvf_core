
import {Pie} from "../pie";
import {NodeAbstract} from "../../nodes/nodeelementabstract";

export class OnionSegment extends Pie {

    protected nodes:NodeAbstract[];

    public setAffectedNodes(nodes:NodeAbstract[]){
        this.nodes = nodes;
    }

    public getAffectedNodes():NodeAbstract[]{
        return this.nodes;
    }
}