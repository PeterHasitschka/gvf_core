import {NodeSimple} from './simple';
import {GraphVisConfig} from '../../config';
import {DataAbstract} from "../../data/abstract";

/**
 * A Resource node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeResource extends NodeSimple {

    constructor(x:number, y:number, protected dataEntity:DataAbstract) {
        super(x, y, dataEntity);

        this.color = GraphVisConfig.nodes.resourcenode.color;
        this.setColor(this.color);
    }

    public onIntersectStart():void {
        console.log("resource node");
        super.onIntersectStart();
    }

    public onIntersectLeave():void {

        super.onIntersectLeave();
    }
}