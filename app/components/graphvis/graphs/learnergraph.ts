

import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeLearner} from './nodes/learner';

import {GraphLayoutRandom} from './layouts/random';


/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class LearnerGraph extends GraphAbstract {

    protected data: Resource[];
    constructor(plane: Plane) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getLearners.bind(DataService.getInstance());
        
        this.nodetype = NodeLearner;
        this.layout = GraphLayoutRandom;
    }

    /**
     * Init method. Super class calls loadData()
     * After loading data the afterLoad callback is called
     */
    public init(): void {
        super.init();
    }

}