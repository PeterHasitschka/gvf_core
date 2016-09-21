import {NodeSimple} from './simple';
import {GraphVisConfig} from '../../config';
import {DataAbstract} from "../../data/abstract";

/**
 * A Learner node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeLearner extends NodeSimple {

    constructor(x:number, y:number, protected dataEntity:DataAbstract) {
        super(x, y, dataEntity);

        this.setColor(GraphVisConfig.nodes.learnernode.color);
    }
}