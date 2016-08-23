import {NodeSimple} from './simple';
import {GraphVisConfig} from '../../config';

/**
 * A Resource node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeResource extends NodeSimple {

    constructor(x: number, y: number) {
        super(x, y);
        
        this.setColor(GraphVisConfig.nodes.resourcenode.color);
    }


}