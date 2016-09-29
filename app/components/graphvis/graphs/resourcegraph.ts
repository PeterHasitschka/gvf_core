import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeResource} from './nodes/resource';

import {GraphLayoutRandom} from './layouts/random';
import {EdgeBasic} from "./edges/basic";
import {Activity} from "../data/activity";
import {EdgeAbstract} from "./edges/abstract";
import {NodeAbstract} from "./nodes/abstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {NodeLearner} from "./nodes/learner";
import {Learner} from "../data/learner";


/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class ResourceGraph extends GraphAbstract {

    protected data:Resource[];
    protected edges:EdgeAbstract[];

    constructor(protected plane:Plane) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getResources.bind(DataService.getInstance());

        this.nodetype = NodeResource;
        this.layoutClass = GraphLayoutRandom;

        this.addEventListeners();
    }

    /**
     * Adding event listeners for hovered and un-hovered learner(!) nodes but also for same nodes
     */
    private addEventListeners() {
        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_HOVERED, function (e) {
            let node:NodeResource = e.detail;
            node.highlightNode();
            this.plane.getGraphScene().render();
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_LEFT, function (e) {
            let node:NodeResource = e.detail;
            node.deHighlightNode();
            this.plane.getGraphScene().render();
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.LEARNER_NODE_HOVERED, function (e) {

            let node:NodeLearner = e.detail;
            let affectedResources:Resource[] = Resource.getResourcesByLearner(<Learner>node.getDataEntity());
            affectedResources.forEach((r:Resource) => {
                let affectedResourceNodes = this.getNodeByDataEntity(r);
                affectedResourceNodes.forEach((n:NodeResource) => {
                    n.highlightNode();
                });
            });
            this.plane.getGraphScene().render();
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.LEARNER_NODE_LEFT, function (e) {

            this.nodes.forEach((n:NodeResource) => {
                n.deHighlightNode();
            });
            this.plane.getGraphScene().render();
        }.bind(this));
    }


    public init():void {
        super.init();
    }

    /**
     * Create edges that connect resources that share learners
     * @returns {EdgeAbstract[]}
     */
    protected createEdges():EdgeAbstract[] {
        let activities = DataService.getInstance().getActivities();
        let edges:EdgeAbstract[] = [];

        let learnings = {};
        activities.forEach((activity:Activity) => {
            if (activity.getType() !== Activity.TYPE_LEARNING)
                return;
            let rId = activity.getData(Activity.RESOURCE_ID);
            let lId = activity.getData(Activity.LEARNER_ID);
            if (typeof learnings[lId] == 'undefined')
                learnings[lId] = [];
            learnings[lId].push(rId);
        });

        for (let lKey in learnings) {
            if (learnings[lKey].length < 2)
                continue;

            learnings[lKey].forEach((rKey:number, i) => {

                if (i < learnings[lKey].length - 1) {
                    let n1:NodeAbstract = this.getNodeByDataId(rKey);
                    let n2:NodeAbstract = this.getNodeByDataId(learnings[lKey][i + 1]);

                    let resourceConnection = new EdgeBasic(n1, n2, this.plane);
                    n1.addEdge(resourceConnection);
                    n2.addEdge(resourceConnection);
                    edges.push(resourceConnection);
                }
            });

        }
        console.log("Resource Graph has an amount of edges:" + edges.length)
        return edges;
    }
}
