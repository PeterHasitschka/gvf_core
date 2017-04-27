import {DataAbstract} from "./dataabstract";
import {BasicEntity} from "./databasicentity";
/**
 * Connection Data object.
 * Connecting two "Node" objects
 * @author Peter Hasitschka
 */
export class BasicConnection extends DataAbstract {

    protected static dataList:BasicConnection[] = [];

    // Can be used by graphs to check if already used
    protected paintingFlags = {};

    /**
     * Connection constructor
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


    public setAlreadyPaintedFlag(planeId:number) {
        this.paintingFlags[planeId] = true;
    }

    public getAlreadyPaintedFlag(planeId:number) {
        return typeof this.paintingFlags[planeId] === "undefined" ? false : this.paintingFlags[planeId];
    }

    /**
     * Get all Connecitons
     * @returns {BasicConnection[]}
     */
    public static getDataList():BasicConnection[] {
        return BasicConnection.dataList;
    }
}