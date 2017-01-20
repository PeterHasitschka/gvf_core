

import {DataAbstract} from "./abstract";
/**
 * Entity Data object
 * Holding data of a single Learner
 * @author Peter Hasitschka
 */
export class BasicEntity extends DataAbstract {

    protected static dataList:BasicEntity[] = [];

    /**
     * Entity constructor
     * @param data Holds an id and at least a 'name' property by current definition
     */
    constructor(protected data: Object) {
        super(data);
        BasicEntity.dataList.push(this);
    }



    /**
     * Get all Entity
     * @returns {BasicEntity[]}
     */
    public static getDataList():BasicEntity[]{
        return BasicEntity.dataList;
    }
}