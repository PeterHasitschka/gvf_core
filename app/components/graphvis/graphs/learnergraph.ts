import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeLearner} from './nodes/learner';

import {GraphLayoutRandom} from './layouts/random';
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {NodeResource} from "./nodes/resource";
import {Learner} from "../data/learner";
import {Activity} from "../data/activity";
import {NodeAbstract} from "./nodes/abstract";
import {EdgeColored} from "./edges/colored";
import log1p = require("core-js/fn/math/log1p");


/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class LearnerGraph extends GraphAbstract {

    protected data:Resource[];

    constructor(plane:Plane, private dataService:DataService) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getLearners.bind(DataService.getInstance());

        this.nodetype = NodeLearner;
        this.layout = GraphLayoutRandom;

        this.addEventListeners();

    }


    private addEventListeners() {
        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_HOVERED, function (e) {

            let node:NodeResource = e.detail;
            let affectedLearners:Learner[] = Learner.getLearnersByResource(<Resource>node.getDataEntity());
            affectedLearners.forEach((l:Learner) => {
                let affectedLearnerNodes = this.getNodeByDataEntity(l);

                affectedLearnerNodes.forEach((n:NodeLearner) => {
                    n.highlightNode();
                })
            });
            this.plane.getGraphScene().render();
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_LEFT, function (e) {
            this.nodes.forEach((n:NodeLearner) => {
                n.deHighlightNode();
            });
            this.plane.getGraphScene().render();
        }.bind(this));
    }

    /**
     * Init method. Super class calls loadData()
     * After loading data the afterLoad callback is called
     */
    public init():void {
        super.init();
        this.connectLearnersMultiples();
    }


    private connectLearnersMultiples() {
        let activities = DataService.getInstance().getActivities();

        let resources = {};
        let communications = {};
        activities.forEach((activity:Activity) => {
            if (activity.getType() === Activity.TYPE_LEARNING) {
                let rId = activity.getData(Activity.RESOURCE_ID);
                let lId = activity.getData(Activity.LEARNER_ID);
                if (typeof resources[rId] == 'undefined')
                    resources[rId] = [];
                resources[rId].push(lId);
            }
            else if (activity.getType() === Activity.TYPE_COMMUNICATING) {
                let l1Id = activity.getData(Activity.LEARNER1_ID);
                let l2Id = activity.getData(Activity.LEARNER2_ID);

                if (typeof communications[l1Id] === "undefined")
                    communications[l1Id] = [];
                communications[l1Id].push(l2Id);
            }
        });

        for (let rId in resources) {
            let learners = resources[rId];

            if (learners.length < 2)
                continue;

            for (let i in learners) {
                let lKey = parseInt(i);
                if (lKey >= learners.length - 1)
                    continue;

                let lId1 = learners[lKey];
                let lId2 = learners[lKey + 1];
                let n1:NodeAbstract = this.getNodeByDataId(lId1);
                let n2:NodeAbstract = this.getNodeByDataId(lId2);

                let learningConnection = new EdgeColored(
                    n1.getPosition().x,
                    n1.getPosition().y,
                    n2.getPosition().x,
                    n2.getPosition().y,
                    this.plane, 0xaa00aa);

                this.plane.getGraphScene().addObject(learningConnection);
            }
        }
        //this.plane.getGraphScene().render();

        for (let l1Id in communications) {
            let l1Communicators = communications[l1Id];

            for (let l2Key in l1Communicators) {
                let l2Id = l1Communicators[l2Key];

                let n1:NodeAbstract = this.getNodeByDataId(parseInt(l1Id));
                let n2:NodeAbstract = this.getNodeByDataId(l2Id);

                let communicationConnection = new EdgeColored(
                    n1.getPosition().x,
                    n1.getPosition().y,
                    n2.getPosition().x,
                    n2.getPosition().y,
                    this.plane, 0xaaaa00);
                this.plane.getGraphScene().addObject(communicationConnection);
            }
        }

        this.plane.getGraphScene().render();
    }

}