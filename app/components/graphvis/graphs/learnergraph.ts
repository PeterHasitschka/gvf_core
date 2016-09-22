import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeLearner} from './nodes/learner';

import {GraphLayoutRandom} from './layouts/random';
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {NodeResource} from "./nodes/resource";


/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class LearnerGraph extends GraphAbstract {

    protected data:Resource[];

    constructor(plane:Plane, private dataService:DataService) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getLearners.bind(DataService.getInstance());

        this.nodetype = NodeLearner;
        this.layout = GraphLayoutRandom;


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_HOVERED, function (e) {
            let node:NodeResource = e.detail;
            console.log("I AM THE LEARNER GRAPH, JUST REGISTERED AN RESOURCE-HOVER EVENT ON ITS NODE " + node.getDataEntity().getId());
        });
    }

    /**
     * Init method. Super class calls loadData()
     * After loading data the afterLoad callback is called
     */
    public init():void {
        super.init();
    }

}