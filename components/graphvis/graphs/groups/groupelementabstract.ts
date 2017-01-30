import {Plane} from "../../../plane/plane";
import {BasicGroup} from "../../data/databasicgroup";
import {ElementAbstract} from "../graphelementabstract";
import {GraphVisConfig} from "../../config";
import {INTERGRAPH_EVENTS, InterGraphEventService} from "../../../../services/intergraphevents.service";
import {BasicEntity} from "../../data/databasicentity";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import Object3D = THREE.Object3D;

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export abstract class GroupAbstract extends ElementAbstract {

    protected groupNodeMesh:THREE.Mesh;

    protected color = GraphVisConfig.graphelements.abstractgroup.color;


    constructor(x:number, y:number, protected dataEntity:BasicGroup, plane:Plane, protected subNodeType) {

        super(x, y, dataEntity, plane);

        this.groupNodeMesh = new THREE.Mesh(new THREE.CircleGeometry(
            GraphVisConfig.graphelements.abstractgroup.size,
            GraphVisConfig.graphelements.abstractgroup.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: this.color,
                    transparent: true,
                    opacity: 0.5
                }));

        this.add(this.groupNodeMesh);

        this.setColor(this.color);
        this.addSubnodes();

    }


    protected addSubnodes() {
        this.getDataEntity().getEntities().forEach((dataEntity:BasicEntity) => {
            let node = new this.subNodeType((Math.random() * 25 - 12.5), (Math.random() * 25 - 12.5), dataEntity, this.plane);
            this.add(<Object3D>node);
        });
    }

    public setScale(factor:number) {
        this.groupNodeMesh.scale.set(factor, factor, factor);
    }


    public highlight() {
        this.groupNodeMesh.material['color'].setHex(this.highlightColor);
        super.highlight();
    }

    public deHighlight() {
        this.groupNodeMesh.material['color'].setHex(this.color);
        super.deHighlight();
    }

    public onIntersectStart():void {
        super.onIntersectStart();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.GROUP_HOVERED, this);

        let groupedData = (<BasicGroup>this.getDataEntity()).getEntities();
        groupedData.forEach((data:BasicEntity) => {
            data.getRegisteredGraphElements().forEach((element:ElementAbstract) => {
                element.highlight();
            })
        });
        this.plane.getGraphScene().render();
    }

    public onIntersectLeave():void {
        super.onIntersectLeave();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.GROUP_LEFT, this);

        let groupedData = (<BasicGroup>this.getDataEntity()).getEntities();

        groupedData.forEach((data:BasicEntity) => {
            data.getRegisteredGraphElements().forEach((element:ElementAbstract) => {
                element.deHighlight();
            })
        });

        this.plane.getGraphScene().render();
    }


    public setColor(color:number):void {
        super.setColor(color);
        this.groupNodeMesh.material['color'].setHex(color);
    }


    public getDataEntity():BasicGroup {
        return this.dataEntity;
    }


}



