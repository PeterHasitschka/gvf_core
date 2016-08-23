import {DataAbstract} from './abstract';

/**
 * Learner Data object
 * Holding data of a single Learner
 * @author Peter Hasitschka
 */
export class Learner extends DataAbstract {
    private static idCounter = 0;

    constructor(data: Object) {
        super(data);

        this.id = Learner.idCounter;
        Learner.idCounter++;
    }

}