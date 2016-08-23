import {NodeSimple} from './simple';
import {GraphVisConfig} from '../../config';

/**
 * A Learner node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeLearner extends NodeSimple {

    constructor(x: number, y: number) {
        super(x, y);
        
        this.setColor(GraphVisConfig.nodes.learnernode.color);
    }


}