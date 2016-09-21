import {GraphVisConfig} from '../../config';
import {DataAbstract} from "../../data/abstract";


/**
 * Abstract class of a Node for the GraphVis
 * Derived from the @see{THREE.Mesh} class.
 * Thus, it holds a geometry and a material
 * @author Peter Hasitschka
 */
export abstract class NodeAbstract extends THREE.Mesh {

    protected threeMaterial:THREE.MeshBasicMaterial;
    protected threeGeometry:THREE.Geometry;
    protected zPos;
    protected color:number;
    protected dataEntity:DataAbstract;

    constructor(x:number, y:number) {

        var config = GraphVisConfig.nodes;

        let color = config.abstractnode.color;

        var geometry = new THREE.CircleGeometry(
            config.abstractnode.size,
            config.segments);

        var material = new THREE.MeshBasicMaterial(
            {
                color: color
            });

        super(geometry, material);

        this.color = color;
        this.threeGeometry = geometry;
        this.threeMaterial = material;
        this.zPos = config.abstractnode.z_pos;

        x = x === undefined ? 0.0 : x;
        y = y === undefined ? 0.0 : y;

        this.setPosition(x, y);
    }


    public setPosition(x:number, y:number):void {
        this.position.setX(x);
        this.position.setY(y);
    }

    public getPosition():THREE.Vector3 {
        return this.position;
    }

    public getDataEntity():DataAbstract {
        return this.dataEntity;
    }
}