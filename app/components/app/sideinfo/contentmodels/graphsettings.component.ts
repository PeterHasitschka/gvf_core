import {SideInfoComponent} from "../sideinfo.component";
import {OnDestroy, Component, Input} from "@angular/core";
import {GraphAbstract} from "../../../graphvis/graphs/abstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../services/intergraphevents.service";
import {NodeAbstract} from "../../../graphvis/graphs/nodes/abstract";
import {NodeResource} from "../../../../../afel/graphs/nodes/resource";
import {GraphVisConfig} from "../../../graphvis/config";
import {ResourceGraph} from "../../../../../afel/graphs/resourcegraph";
import {LearnerGraph} from "../../../../../afel/graphs/learnergraph";

@Component({
    selector: 'sideinfocontentgraph',
    templateUrl: 'app/components/app/sideinfo/contentmodels/graph.html',
    // styleUrls: ['app/components/app/sideinfo/sideinfo.css']
})

/**
 * Side-Info-Component-Content for graphs
 */
export class SideInfoContentGraphsettingsComponent implements OnDestroy {

    @Input() data:{};
    private nodeInfo = false;

    constructor(private intergraphEventService:InterGraphEventService) {

        this.intergraphEventService.addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_HOVERED, function (e) {
            if (typeof this.data.graphtype === "undefined") {
                console.warn("Graph-Side-Info. Could not find graphtype in data");
                return;
            }
            if (GraphVisConfig.active_graphs[this.data.graphtype] !== ResourceGraph)
                return;

            let node:NodeAbstract = e.detail;
            this.nodeInfo = [];
            this.nodeInfo.push("Resource Node - ID: " + node.getDataEntity().getId());
            this.nodeInfo.push("Title: " + node.getDataEntity().getData('title'));
            this.nodeInfo.push("Complexity: " + node.getDataEntity().getData('complexity'));
        }.bind(this));

        this.intergraphEventService.addListener(INTERGRAPH_EVENTS.LEARNER_NODE_HOVERED, function (e) {
            if (typeof this.data.graphtype === "undefined") {
                console.warn("Graph-Side-Info. Could not find graphtype in data");
                return;
            }
            if (GraphVisConfig.active_graphs[this.data.graphtype] !== LearnerGraph)
                return;

            let node:NodeAbstract = e.detail;
            this.nodeInfo = [];
            this.nodeInfo.push("Learner Node - ID: " + node.getDataEntity().getId());
            this.nodeInfo.push("Name: " + node.getDataEntity().getData('name'));
            this.nodeInfo.push("Experience: " + node.getDataEntity().getData('experience'));
        }.bind(this));

        this.intergraphEventService.addListener(INTERGRAPH_EVENTS.LEARNER_NODE_LEFT, function (e) {
            this.nodeInfo = false;
        }.bind(this));
        this.intergraphEventService.addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_LEFT, function (e) {
            this.nodeInfo = false;
        }.bind(this));
    }

    ngOnDestroy() {
        alert("Destroyed");
    }

}