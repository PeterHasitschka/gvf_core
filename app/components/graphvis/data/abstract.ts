/**
 * Abstract Data Object
 * Holds an Id, that is incremented by each derived Class on its own
 * @author Peter Hasitschka
 */
export abstract class DataAbstract {

    protected static dataList:DataAbstract[];

    protected id:number;

    /**
     * Data object, which at least holds an ID taken as parameter on constructor
     * @param data
     */
    constructor(protected data:Object) {
        this.id = data["id"];
    }

    public getId():number {
        return this.id;
    }

    /**
     * Getting a data value
     * @param key {string} Key of the property
     * @returns {any} null if not existing, else value
     */
    public getData(key:string) {

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
        let foundObj:DataAbstract = null;
        this.dataList.forEach((obj:DataAbstract) => {
            if (foundObj)
                return;
            if (obj.getId() === id)
                foundObj = obj;
        })
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