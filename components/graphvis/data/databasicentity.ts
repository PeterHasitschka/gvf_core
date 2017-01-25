import {DataAbstract} from "./dataabstract";
/**
 * Entity Data object
 * Holding data of a single Entity
 * @author Peter Hasitschka
 */
export class BasicEntity extends DataAbstract {

    protected static dataList:BasicEntity[] = [];

    /**
     * Entity constructor
     * @param data Holds an id and at least a 'name' property by current definition
     */
    constructor(id:number, data:Object) {
        super(id, data);
        BasicEntity.dataList.push(this);
    }


    /**
     * Get all Entity
     * @returns {BasicEntity[]}
     */
    public static getDataList():BasicEntity[] {
        return BasicEntity.dataList;
    }
}