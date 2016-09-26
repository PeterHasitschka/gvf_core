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


    constructor(protected plane:Plane) {
        this.nodes = [];
    }

    /**
     * Init method for loading data and creating the layout and nodes
     */
    public init():void {
        this.layout = new this.layoutClass(this.plane);
        this.loadData();

        let edges:EdgeAbstract[] = this.createEdges();
        edges.forEach((edge:EdgeAbstract) => {
            this.plane.getGraphScene().addObject(edge);
        });

        this.layout.calculateLayout(this.nodes, function () {
            console.log("Finished calculating layout");
        });

        this.plane.getGraphScene().render();
    }


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
        //this.plane.getGraphScene().render();

        this.layout.setInitPositions(this.nodes, () => {
            //this.plane.getGraphScene().render();
        });
    }


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


    protected getNodeByDataEntity(entity:DataAbstract):NodeAbstract[] {

        let out:NodeAbstract[] = [];
        this.nodes.forEach((node:NodeAbstract) => {
            if (node.getDataEntity().getId() === entity.getId())
                out.push(node);
        });
        return out;
    }
}