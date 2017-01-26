/**
 * Abstract Data Object
 * Holds an Id, that is incremented by each derived Class on its own
 * @author Peter Hasitschka
 */
export abstract class DataAbstract {

    protected static dataList:DataAbstract[];

    /**
     * Data object, which at least holds an ID taken as parameter on constructor
     * @param data
     */
    constructor(protected id:number, protected data:Object) {
    }

    public getId():number {
        return this.id;
    }

    /**
     * Getting a data value or the whole data set
     * @param key {string} Key of the property. If Undefined, the whole data set is returned
     * @returns {any} null if not existing, else value or dataset
     */
    public getData(key:string = null) {
        if (key === null)
            return this.data;

        if (typeof this.data[key] === 'undefined')
            return null;
        return this.data[key];
    }

    /**
     * Static function to get a data object by its ID
     * Returns null if not found
     * @param id {number} ID to find
     * @returns {DataAbstract|null}
     */
    public static getObject(id:number) {
        let foundObj = null;
        this.dataList.forEach((obj) => {
            if (foundObj)
                return;
            if (obj.getId() === id)
                foundObj = obj;
        });
        return foundObj;
    }

    /**
     * Get all data objects of the derived entity-type as list
     * @returns {DataAbstract[]}
     */
    public static getDataList():DataAbstract[] {
        return DataAbstract.dataList;
    }
}