import {DataAbstract} from './abstract';

/**
 * Activity Data object
 * Holding data of a single Activity that relates to at least a Learner
 * @author Peter Hasitschka
 */
export class Activity extends DataAbstract {

    protected static dataList:Activity[] = [];

    public static TYPE_LEARNING = "learning";
    public static TYPE_COMMUNICATING = "communicating";

    constructor(protected data:Object) {
        super(data);
        Activity.dataList.push(this);
    }

    public getType():string {
        return this.data["type"];
    }

}