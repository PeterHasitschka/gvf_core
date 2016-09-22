import {DataAbstract} from './abstract';

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

}