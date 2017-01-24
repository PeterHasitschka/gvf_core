import {ElementAbstract} from "../elementabstract";
import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {DataAbstract} from "../../data/abstract";
export abstract class NodeAbstract extends ElementAbstract {


    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane) {

        super(x, y, plane, new THREE.CircleGeometry(
            GraphVisConfig.graphelements.abstractnode.size,
            GraphVisConfig.graphelements.abstractnode.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: GraphVisConfig.graphelements.abstractnode.color
                })
        );
    }
}
