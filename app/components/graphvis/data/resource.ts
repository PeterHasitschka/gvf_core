import {DataAbstract} from './abstract';
import {Learner} from "./learner";
import {Activity} from "./activity";

/**
 * Resource Data object
 * Holding data of a single Learning-Resource
 * @author Peter Hasitschka
 */
export class Resource extends DataAbstract {

    protected static dataList:Resource[] = [];

    constructor(protected data:Object) {
        super(data);
        Resource.dataList.push(this);
    }


    public static getDataList():Resource[] {
        return Resource.dataList;
    }


    public static getResourcesByLearner(learner:Learner):Resource[] {

        let outList:Resource[] = [];
        Activity.getDataList().forEach((activitiy:Activity) => {
            if (activitiy.getType() !== Activity.TYPE_LEARNING)
                return;
            if (activitiy.getData(Activity.LEARNER_ID) === learner.getId())
                outList.push(<Resource>Resource.getObject(activitiy.getData(Activity.RESOURCE_ID)));
        });

        return outList;
    }

}