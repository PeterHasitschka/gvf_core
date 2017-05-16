import {Plane} from '../../plane/plane';
import {DataAbstract} from '../data/dataabstract';
import {GraphLayoutAbstract} from './layouts/graphlayoutabstract';
import {UiService} from "../../../services/ui.service";
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../../app/sideinfo/sideinfomodel";
import {EdgeAbstract} from "./edges/edgeelementabstract";
import {LayoutInterface} from "./layouts/layoutinterface";
import {BasicGroup} from "../data/databasicgroup";
import {NodeAbstract} from "./nodes/nodeelementabstract";
import {ElementAbstract} from "./graphelementabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {GroupedObservable} from "rxjs/operator/groupBy";
import {GroupAbstract} from "./groups/groupelementabstract";
/**
 * Abstract Graph Class
 * Holding the corresponding data and the plane
 * Each Graph only holds ONE TYPE OF DATA
 * Currently there are no plans for mixing them up!
 * @author Peter Hasitschka
 */
export abstract class GraphAbstract {


    protected nodetype;
    protected layoutClass:any;
    protected layout:LayoutInterface = null;
    protected graphElements:ElementAbstract[] = [];
    protected groups:BasicGroup[];
    protected edges:EdgeAbstract[] = [];

    protected maxNodeWeight = 0;


    constructor(protected plane:Plane) {
        this.graphElements = [];


    }

    /**
     * The data of a specific type (learner, resource, ...) for this plane
     */
    protected dataGetterMethod;

    public setDataGetterMethod(fct:Function) {
        this.dataGetterMethod = fct;
    }


    public init():void {
    }

    /**
     * Abstract for creating edges, which is called after loading data
     * @returns {Array}
     */
    protected createEdges():EdgeAbstract[] {
        return []
    }

    protected addEventListeners() {
        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_HOVERED, function (e) {
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_LEFT, function (e) {
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.GRAPH_LEFT, function (none) {
            this.graphElements.forEach((e:ElementAbstract) => {
                e.deHighlight();
            });
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.EMPTY_SPACE_IN_PLANE_CLICKED, function (e) {
            let p = <Plane>e.detail.plane;
            if (p.getId() !== this.plane.getId())
                return;

            this.plane.deselectSelectedGraphElement();
        }.bind(this));
    }


    /**
     * Get a @see{NodeAbstract} Object by its data-id
     * If not found, null is returned
     * @param id
     * @returns {NodeAbstract}
     */
    protected getNodeByDataId(id:number):NodeAbstract {
        let foundNode:NodeAbstract = null;
        this.graphElements.forEach((node:NodeAbstract) => {
            if (foundNode)
                return;
            if (!node.getDataEntity())
                return;
            let data = node.getDataEntity();
            if (data.getId() == id)
                foundNode = node;
        });
        return foundNode;
    }

    /**
     * Get a node by its Data-Entity
     * @param entity
     * @returns {NodeAbstract[]}
     */
    protected getNodeByDataEntity(entity:DataAbstract):NodeAbstract[] {

        let out:NodeAbstract[] = [];
        this.graphElements.forEach((node:NodeAbstract) => {
            if (node.getDataEntity().getId() === entity.getId())
                out.push(node);
        });
        return out;
    }

    public getGraphElements() {
        return this.graphElements;
    }

    /**
     * Edge Getter
     * @returns {EdgeAbstract[]}
     */
    public getEdges():EdgeAbstract[] {
        return this.edges;
    }


    public getMaxNodeWeight():number {
        return this.maxNodeWeight;
    }
}