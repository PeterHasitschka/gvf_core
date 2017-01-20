import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {DataService} from '../../../services/data.service';

import {GraphLayoutRandom} from './layouts/random';
import {EdgeBasic} from "./edges/basic";
import {EdgeAbstract} from "./edges/abstract";
import {NodeAbstract} from "./nodes/abstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {GraphLayoutFdl} from "./layouts/fdl";
import {UiService} from "../../../services/ui.service";
import {NodeSimple} from "./nodes/simple";
import {BasicEntity} from "../data/basicentity";
import {BasicConnection} from "../data/basicconnection";


/**
 * Basic graph
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class BasicGraph extends GraphAbstract {

    protected data:BasicEntity[];
    protected edges:EdgeAbstract[];

    constructor(protected plane:Plane) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getDemoEntities.bind(DataService.getInstance());

        this.nodetype = NodeSimple;
        this.layoutClass = GraphLayoutFdl;
    }


    public init():void {
        super.init();
    }

    /**
     * Create edges that connect resources that share learners
     * @returns {EdgeAbstract[]}
     */
    protected createEdges():EdgeAbstract[] {

        let connections = DataService.getInstance().getDemoConnections();
        let edges:EdgeAbstract[] = [];

        connections.forEach((connection:BasicConnection) => {
            let src = connection.getData("src");
            let dst = connection.getData("dst");

            let n1:NodeAbstract = this.getNodeByDataId(src);
            let n2:NodeAbstract = this.getNodeByDataId(dst);
            let edge = new EdgeBasic(n1, n2, this.plane);
                        n1.addEdge(edge);
                        n2.addEdge(edge);
                        edges.push(edge);
        });

        return  edges;
    }
}
