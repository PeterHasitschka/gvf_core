import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';

export class ResourceGraph extends GraphAbstract {
    constructor(plane: Plane) {
        super(plane);
    }
}