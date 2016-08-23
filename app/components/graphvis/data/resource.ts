import {DataAbstract} from './abstract';

/**
 * Resource Data object
 * Holding data of a single Learning-Resource
 * @author Peter Hasitschka
 */
export class Resource extends DataAbstract {
    private static idCounter = 0;

    constructor(data: Object) {
        super(data);

        this.id = Resource.idCounter;
        Resource.idCounter++;
    }

}