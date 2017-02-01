import {Plane} from "../../../plane/plane";
import {BasicGroup} from "../../data/databasicgroup";
import {ElementAbstract} from "../graphelementabstract";
import {GraphVisConfig} from "../../config";
import {INTERGRAPH_EVENTS, InterGraphEventService} from "../../../../services/intergraphevents.service";
import {BasicEntity} from "../../data/databasicentity";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import Object3D = THREE.Object3D;
import {UiService} from "../../../../services/ui.service";
import {LearnerGraph} from "../../../../../afel/graph/graphs/learnergraph";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export abstract class GroupAbstract extends ElementAbstract {

    protected groupNodeMesh:THREE.Mesh;

    protected color = GraphVisConfig.graphelements.abstractgroup.color;

    protected subNodes;

    protected scaleFactor = 1;


    constructor(x:number, y:number, protected dataEntity:BasicGroup, plane:Plane, protected subNodeType, options:Object) {

        super(x, y, dataEntity, plane, options);

        this.groupNodeMesh = new THREE.Mesh(new THREE.CircleGeometry(
            GraphVisConfig.graphelements.abstractgroup.size,
            GraphVisConfig.graphelements.abstractgroup.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: this.color,
                    transparent: true,
                    opacity: GraphVisConfig.graphelements.abstractgroup.opacity
                }));

        this.add(this.groupNodeMesh);
        this.groupNodeMesh.position.setZ(GraphVisConfig.graphelements.abstractgroup.z_pos);
        this.subNodes = [];

        this.setColor(this.color);
        this.addSubnodes();

    }


    protected addSubnodes() {
        this.getDataEntity().getEntities().forEach((dataEntity:BasicEntity) => {
            let node = new this.subNodeType(0, 0, dataEntity, this.plane, {skip_highlighting_on_hover: false});
            this.add(<Object3D>node);
            this.subNodes.push(node);
        });
    }

    public setScale(factor:number) {
        this.groupNodeMesh.scale.set(factor, factor, factor);
        this.scaleFactor = factor;
        this.updateSubNodePositions();

    }

    protected updateSubNodePositions() {
        this.subNodes.forEach((node:NodeAbstract) => {
            let pos = this.calculateSubNodePosition(node);
            node.setPosition(pos.x, pos.y);
        });
        this.plane.getGraphScene().render();
    }

    /**
     * Calculating random polar coordinates depending on the group-nodes scaled radius
     * @param node
     * @returns {{x: number, y: number}}
     */
    protected calculateSubNodePosition(node:NodeAbstract) {
        let radius = this.groupNodeMesh.geometry.boundingSphere.radius * this.scaleFactor;

        let phi = Math.random() * Math.PI * 2;
        let randRadius = Math.random() * (radius - 5);

        return {x: randRadius * Math.cos(phi), y: randRadius * Math.sin(phi)};
    }


    public highlight(render=false) {
        this.groupNodeMesh.material['color'].setHex(this.highlightColor);
        super.highlight(render);
    }

    public deHighlight(render=false) {
        this.subNodes.forEach((e:ElementAbstract) => {
            e.deHighlight(render);
        });


        this.groupNodeMesh.material['color'].setHex(this.color);
        super.deHighlight(render);
    }


    public onIntersectStart():void {
        super.onIntersectStart();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.GROUP_HOVERED, this);


        /**
         * Highlight all nodes which are referring to the sub-entities
         */

            // Render all planes with foreign nodes in the end.
        let affectedPlanes = [];
        let groupedData = (<BasicGroup>this.getDataEntity()).getEntities();
        groupedData.forEach((data:BasicEntity) => {
            data.getRegisteredGraphElements().forEach((element:ElementAbstract, index:number) => {
                element.highlight();
                if (affectedPlanes.indexOf(element.getPlane()) === -1)
                    affectedPlanes.push(element.getPlane());
            })
        });

        affectedPlanes.forEach((p:Plane) => {
            p.getGraphScene().render();
        });

        /**
         * Connect own nodes to nodes in other graphs by intergraphconnections
         */
        this.subNodes.forEach((element:ElementAbstract) => {
            // Connect with the same nodes in other planes
            let data = element.getDataEntity();
            if (data.getRegisteredGraphElements().length > 1)
                data.getRegisteredGraphElements().forEach((otherGraphElement:ElementAbstract) => {
                    if (otherGraphElement === element)
                        return;
                    if (otherGraphElement.getPlane().getGraph().constructor === LearnerGraph)
                        return;
                    UiService.getInstance().addNodesToIntergraphConnection(element, otherGraphElement, "red");
                });
        });

        this.plane.getGraphScene().render();
    }

    public onIntersectLeave():void {
        super.onIntersectLeave();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.GROUP_LEFT, this);

        let groupedData = (<BasicGroup>this.getDataEntity()).getEntities();

        // Render all planes with foreign nodes in the end.
        let affectedPlanes = [];
        groupedData.forEach((data:BasicEntity) => {
            data.getRegisteredGraphElements().forEach((element:ElementAbstract) => {
                element.deHighlight();
                if (affectedPlanes.indexOf(element.getPlane()) === -1)
                    affectedPlanes.push(element.getPlane());
            })
        });

        affectedPlanes.forEach((p:Plane) => {
            p.getGraphScene().render();
        });

        UiService.getInstance().clearIntergraphConnections();
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



