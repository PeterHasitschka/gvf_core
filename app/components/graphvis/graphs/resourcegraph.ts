import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeResource} from './nodes/resource';

import {GraphLayoutRandom} from './layouts/random';


/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class ResourceGraph extends GraphAbstract {

    protected data:Resource[];

    constructor(plane:Plane) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getResources.bind(DataService.getInstance());

        this.nodetype = NodeResource;
        this.layout = GraphLayoutRandom;
    }

    /**
     * Init method. Super class calls loadData()
     * After loading data the afterLoad callback is called
     */
    public init():void {
        super.init();
    }

}
