import {DataAbstract} from "./abstract";
import {BasicEntity} from "./basicentity";
/**
 * Connection Data object.
 * Connecting two "Node" objects
 * @author Peter Hasitschka
 */
export class BasicConnection extends DataAbstract {

    protected static dataList:BasicConnection[] = [];

    /**
     * Learner constructor
     * @param data Holds an id and at least a 'name' property by current definition
     */
    constructor(id:number, protected entitySrc:BasicEntity, protected entityDst:BasicEntity, data:Object) {
        super(id, data);
        BasicConnection.dataList.push(this);
    }

    public getEntities() {
        return {src: this.entitySrc, dst: this.entityDst};
    }

    public setEntitites(entitySrc:BasicEntity, entityDst:BasicEntity) {
        this.entitySrc = entitySrc;
        this.entityDst = entityDst;
    }

    /**
     * Get all Connecitons
     * @returns {BasicConnection[]}
     */
    public static getDataList():BasicConnection[] {
        return BasicConnection.dataList;
    }
}