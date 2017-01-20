import {Plane} from '../../plane/plane';
import {DataAbstract} from '../data/abstract';
import {NodeAbstract} from '../graphs/nodes/abstract';
import {GraphLayoutAbstract} from '../graphs/layouts/abstract';
import {UiService} from "../../../services/ui.service";
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../../app/sideinfo/sideinfomodel";
import {EdgeAbstract} from "./edges/abstract";
import {LayoutInterface} from "./layouts/layoutinterface";
/**
 * Abstract Graph Class
 * Holding the corresponding data and the plane
 * Each Graph only holds ONE TYPE OF DATA
 * Currently there are no plans for mixing them up!
 * @author Peter Hasitschka
 */
export abstract class GraphAbstract {

    /**
     * The data of a specific type (learner, resource, ...) for this plane
     */
    protected data:DataAbstract[];
    protected dataGetterMethod;

    protected nodetype:any;
    protected layoutClass:any;
    protected layout:LayoutInterface = null;
    protected nodes:NodeAbstract[];
    protected edges:EdgeAbstract[];


    constructor(protected plane:Plane) {
        this.nodes = [];
    }

    /**
     * Init method for loading data and creating the layout and nodes
     */
    public init():void {
        this.loadData();
        this.edges = this.createEdges();
        this.layout = new this.layoutClass(this.plane, this.nodes, this.edges);

        this.edges.forEach((edge:EdgeAbstract) => {
            this.plane.getGraphScene().addObject(edge);
        });
        this.layout.setInitPositions(() => {
            //this.plane.getGraphScene().render();
            this.layout.calculateLayout(function () {
                console.log("Finished calculating layout");
                this.plane.getGraphScene().render();
            }.bind(this));
        });
    }

    /**
     * Abstract for creating edges, which is called after loading data
     * @returns {Array}
     */
    protected createEdges():EdgeAbstract[] {
        return []
    }


    /**
     * Loading data with the defined getter method
     * Nodes get created and stored in array
     * Afterwards layout gets calculated by the defined layout class
     */
    protected loadData():void {
        this.data = this.dataGetterMethod();

        this.data.forEach((data:DataAbstract) => {
            let n = new this.nodetype(0, 0, data, this.plane);
            this.plane.getGraphScene().addObject(n);
            this.nodes.push(n);
        });
    }

    /**
     * Get a @see{NodeAbstract} Object by its data-id
     * If not found, null is returned
     * @param id
     * @returns {NodeAbstract}
     */
    protected getNodeByDataId(id:number):NodeAbstract {
        let foundNode:NodeAbstract = null;
        this.nodes.forEach((node:NodeAbstract) => {
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
        this.nodes.forEach((node:NodeAbstract) => {
            if (node.getDataEntity().getId() === entity.getId())
                out.push(node);
        });
        return out;
    }

    /**
     * Edge Getter
     * @returns {EdgeAbstract[]}
     */
    public getEdges():EdgeAbstract[] {
        return this.edges;
    }
}