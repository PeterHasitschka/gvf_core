import {SideInfoComponent} from "../sideinfo.component";
import {OnDestroy, Component, Input} from "@angular/core";
import {GraphAbstract} from "../../../graphvis/graphs/graphabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../services/intergraphevents.service";
import {GraphVisConfig} from "../../../graphvis/config";

@Component({
    selector: 'sideinfodynamicinfo',
    templateUrl: 'gvfcore/components/app/sideinfo/contentmodels/graph.html',
    // styleUrls: ['gvfcore/components/app/sideinfo/sideinfo.css']
})

/**
 * Side-Info-Component-Content for graphs
 */
export class SideInfoContentDynamicInfoComponent implements OnDestroy {

    @Input() data:{};
    private nodeInfo = false;

    constructor(private intergraphEventService:InterGraphEventService) {


        this.intergraphEventService.addListener(INTERGRAPH_EVENTS.NODE_HOVERED, function(e) {
            this.dynInfo = [];
            this.dynInfo.push("node hovered");
        }.bind(this));

        this.intergraphEventService.addListener(INTERGRAPH_EVENTS.NODE_LEFT, function(e) {
            this.dynInfo = false;
        }.bind(this));

        // this.intergraphEventService.addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_HOVERED, function (e) {
        //     if (typeof this.data.graphtype === "undefined") {
        //         console.warn("Graph-Side-Info. Could not find graphtype in data");
        //         return;
        //     }
        //     if (GraphVisConfig.active_graphs[this.data.graphtype] !== ResourceGraph)
        //         return;
        //
        //     let node:NodeAbstract = e.detail;
        //     this.dynInfo = [];
        //     this.dynInfo.push("Resource Node - ID: " + node.getDataEntity().getId());
        //     this.dynInfo.push("Title: " + node.getDataEntity().getData('title'));
        //     this.dynInfo.push("Complexity: " + node.getDataEntity().getData('complexity'));
        // }.bind(this));
        //
        // this.intergraphEventService.addListener(INTERGRAPH_EVENTS.LEARNER_NODE_HOVERED, function (e) {
        //     if (typeof this.data.graphtype === "undefined") {
        //         console.warn("Graph-Side-Info. Could not find graphtype in data");
        //         return;
        //     }
        //     if (GraphVisConfig.active_graphs[this.data.graphtype] !== LearnerGraph)
        //         return;
        //
        //     let node:NodeAbstract = e.detail;
        //     this.dynInfo = [];
        //     this.dynInfo.push("Learner Node - ID: " + node.getDataEntity().getId());
        //     this.dynInfo.push("Name: " + node.getDataEntity().getData('name'));
        //     this.dynInfo.push("Experience: " + node.getDataEntity().getData('experience'));
        // }.bind(this));
        //
        // this.intergraphEventService.addListener(INTERGRAPH_EVENTS.LEARNER_NODE_LEFT, function (e) {
        //     this.dynInfo = false;
        // }.bind(this));
        // this.intergraphEventService.addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_LEFT, function (e) {
        //     this.dynInfo = false;
        // }.bind(this));
    }

    ngOnDestroy() {
        alert("Destroyed");
    }

}