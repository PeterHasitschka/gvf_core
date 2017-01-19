import {NodeSimple} from '../../../app/components/graphvis/graphs/nodes/simple';
import {GraphVisConfig} from '../../../app/components/graphvis/config';
import {DataAbstract} from "../../../app/components/graphvis/data/abstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../app/services/intergraphevents.service";
import {GraphScene} from "../../../app/components/graphvis/scene";
import {Plane} from "../../../app/components/plane/plane";

/**
 * A Learner node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeLearner extends NodeSimple {

    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane) {
        super(x, y, dataEntity, plane);

        this.color = GraphVisConfig.nodes.learnernode.color;
        this.setColor(this.color);
    }

    /**
     * On Mouse-Hover
     * Sending an Event for notifying that node was intersected
     */
    public onIntersectStart():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.LEARNER_NODE_HOVERED, this);
        super.onIntersectStart();
    }

    /**
     * On Mouse-Leave
     * Sending an Event for notifying that node was left
     */
    public onIntersectLeave():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.LEARNER_NODE_LEFT, this);
        super.onIntersectLeave();
    }
}