import {DataAbstract} from "./dataabstract";
import {BasicEntity} from "./databasicentity";
export class BasicGroup extends DataAbstract {


    protected static dataList:BasicGroup[] = [];

    protected entities:BasicEntity[] = [];

    constructor(id:number, entities:BasicEntity[], data:Object) {
        super(id, data);

        if (entities && entities.length > 0)
            this.entities = entities;

        BasicGroup.dataList.push(this);
    }


    public static getDataList():BasicGroup[] {
        return BasicGroup.dataList;
    }

    public addEntity(entity:BasicEntity) {

        let alreadyFound = false;
        this.entities.forEach((e:BasicEntity) => {
            if (entity.getId() === e.getId())
                alreadyFound = true;
        });

        if (alreadyFound)
            return;

        this.entities.push(entity);
    }

    public removeEntity(entity:BasicEntity) {

        let alreadyRemoved = false;
        this.entities.forEach((e:BasicEntity, i:number) => {
            if (alreadyRemoved)
                return;
            if (entity.getId() === e.getId()) {
                this.entities.splice(i, 1);
                alreadyRemoved = true;
            }

        });
    }

    public getEntities():BasicEntity[] {
        return this.entities
    }
}