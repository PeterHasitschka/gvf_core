import {DataAbstract} from './abstract';
import {Resource} from "./resource";
import {Activity} from "./activity";

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


    public static getLearnersByResource(resource:Resource):Learner[]{

        let outList:Learner[] = [];
        Activity.getDataList().forEach((activitiy:Activity) => {
            if (activitiy.getType() !== Activity.TYPE_LEARNING)
                return;
            if(activitiy.getData(Activity.RESOURCE_ID) === resource.getId())
                outList.push(<Learner>Learner.getObject(activitiy.getData(Activity.LEARNER_ID)));
        });

        return outList;
    }

    public static getDataList():Learner[]{
        return Learner.dataList;
    }
}