import {Plane} from '../../plane/plane';
import {GraphAbstract} from './graphabstract';
import {DataService} from '../../../services/data.service';

import {GraphLayoutRandom} from './layouts/graphlayoutrandom';
import {EdgeBasic} from "./edges/edgeelementbasic";
import {EdgeAbstract} from "./edges/edgeelementabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {GraphLayoutFdl} from "./layouts/graphlayoutfdl";
import {UiService} from "../../../services/ui.service";
import {NodeSimple} from "./nodes/nodelementsimple";
import {BasicEntity} from "../data/databasicentity";
import {BasicConnection} from "../data/databasicconnection";
import {NodeAbstract} from "./nodes/nodeelementabstract";
import {GraphAutoCreateAbstract} from "./graphautocreateabstract";


/**
 * Basic graph
 * @author Peter Hasitschka
 */
export class BasicGraph extends GraphAutoCreateAbstract {

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
        console.log(connections);
        connections.forEach((connection:BasicConnection) => {
            let entities = connection.getEntities();
            let src = entities.src;
            let dst = entities.dst;

            let n1:NodeAbstract = this.getNodeByDataId(src.getId());
            let n2:NodeAbstract = this.getNodeByDataId(dst.getId());

            console.log(n1,n2);
            let edge = new EdgeBasic(n1, n2, this.plane);
                        n1.addEdge(edge);
                        n2.addEdge(edge);
                        edges.push(edge);
        });

        return  edges;
    }
}
