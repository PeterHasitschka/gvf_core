import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeSimple} from './nodes/simple';

export class ResourceGraph extends GraphAbstract {

    protected data: Resource[];
    constructor(plane: Plane) {
        super(plane);

        var node = new NodeSimple();
        plane.getGraphScene().getThreeScene().add(node);
        plane.getGraphScene().render();
    }


    loadData(): void {
        DataService.getInstance().getResources().then(rs => {
            this.data = rs;
            console.log("Resource Data Loaded", this.data);
        });
    }
}