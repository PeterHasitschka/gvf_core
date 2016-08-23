import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeSimple} from './nodes/simple';

/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class ResourceGraph extends GraphAbstract {

    protected data: Resource[];
    constructor(plane: Plane) {
        super(plane);

        var node = new NodeSimple();
        plane.getGraphScene().getThreeScene().add(node);
        plane.getGraphScene().render();
    }

    /**
     * Init method. Super class calls loadData()
     * @todo: Fill with graph creation
     */
    public init(): void {
        super.init();

    }


    protected loadData(): void {
        DataService.getInstance().getResources().then(rs => {
            this.data = rs;
            console.log("Resource Data Loaded", this.data);
        });
    }
}