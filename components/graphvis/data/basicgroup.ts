import {DataAbstract} from "./abstract";
import {BasicEntity} from "./basicentity";
export class BasicGroup extends DataAbstract {


    protected static dataList:BasicGroup[] = [];


    constructor(id:number, private entities:BasicEntity, data:Object) {
        super(id, data);
        BasicGroup.dataList.push(this);
    }


    public static getDataList():BasicGroup[] {
        return BasicGroup.dataList;
    }
}