import {DataAbstract} from './abstract';

/**
 * Learner Data object
 * Holding data of a single Learner
 * @author Peter Hasitschka
 */
export class Learner extends DataAbstract {

    protected static dataList:Learner[] = [];

    constructor(protected data: Object) {
        super(data);
        Learner.dataList.push(this);
    }

}