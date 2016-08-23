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
    }

    /**
     * Init method. Super class calls loadData()
     * After loading data the afterLoad callback is called
     */
    public init(): void {
        super.init();
        this.loadData(data => { this.afterLoad(data) });
    }

    /**
     * Called as callback after data was loaded asynchronously
     * @param data - Array of data objects
     */
    private afterLoad(data: Resource[]): void {
        this.data = data;
        console.log("Resource Data Loaded", this.data);
        for (let i = 0; i < this.data.length; i++) {

            let dimensions = this.plane.calculateCanvasSize();
            let x_range = dimensions['x'] - 20;
            let y_range = dimensions['y'] - 20;
            var posX = Math.random() * x_range - x_range / 2;
            var posY = Math.random() * y_range - y_range / 2;

            let n = new NodeSimple(posX, posY);
            this.plane.getGraphScene().getThreeScene().add(n);
        }
        this.plane.getGraphScene().render();
    }


    protected loadData(after_load): void {
        DataService.getInstance().getResources().then(rs => {
            after_load(rs);
        });
    }
}