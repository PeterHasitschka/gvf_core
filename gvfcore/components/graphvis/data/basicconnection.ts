

import {DataAbstract} from "./abstract";
/**
 * Connection Data object
 * Holding data of a single Learner
 * @author Peter Hasitschka
 */
export class BasicConnection extends DataAbstract {

    protected static dataList:BasicConnection[] = [];

    /**
     * Learner constructor
     * @param data Holds an id and at least a 'name' property by current definition
     */
    constructor(protected data: Object) {
        super(data);
        BasicConnection.dataList.push(this);
    }



    /**
     * Get all Connecitons
     * @returns {BasicConnection[]}
     */
    public static getDataList():BasicConnection[]{
        return BasicConnection.dataList;
    }
}