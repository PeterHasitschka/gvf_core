import {DataAbstract} from './abstract';

/**
 * Activity Data object
 * Holding data of a single Activity that relates to at least a Learner
 * @author Peter Hasitschka
 */
export class Activity extends DataAbstract {
    private static idCounter = 0;

    constructor(data: Object) {
        super(data);

        this.id = Activity.idCounter;
        Activity.idCounter++;
    }

}