import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';


export class ResourceGraph extends GraphAbstract {

    protected data: Resource[];
    constructor(plane: Plane) {
        super(plane);
    }


    loadData(): void {
        DataService.getInstance().getResources().then(rs => {
            this.data = rs;
            console.log("Resource Data Loaded");
        });
    }
}