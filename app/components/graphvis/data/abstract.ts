/**
 * Abstract Data Object
 * Holds an Id, that is incremented by each derived Class on its own
 * @author Peter Hasitschka
 */
export abstract class DataAbstract {

    protected static dataList:DataAbstract[];

    protected id:number;

    constructor(protected data:Object) {
        this.id = data["id"];
    }

    public getId():number {
        return this.id;
    }

    public getData(key:string) {

        if (typeof this.data[key] === 'undefined')
            return null;
        return this.data[key];
    }

    public static getObject(id:number){
        let foundObj:DataAbstract = null;
        this.dataList.forEach((obj:DataAbstract) => {
            if (foundObj)
                return;
            if (obj.getId() === id)
                foundObj = obj;
        })
        return foundObj;
    }

    public static getDataList():DataAbstract[]{
        return DataAbstract.dataList;
    }
}