import {OnDestroy, Component} from "@angular/core";
import {InterGraphEventService} from "../../../../../services/intergraphevents.service";
import {UiService} from "../../../../../services/ui.service";
import {Plane} from "../../../../plane/plane";
import {GroupGraphAbstract} from "../../../../graphvis/graphs/graphgroupabstract";
import {GroupCombinedGraphAbstract} from "../../../../graphvis/graphs/graphgroupcombinedabstract";
import {CombinedCommunityGraph} from "../../../../../../afel/graph/graphs/combinedcommunitygraph";


@Component({
    selector: 'appdevtools',
    templateUrl: 'gvfcore/components/app/sideinfo/contentmodels/devcontrol/appdevtools.html',
    styleUrls: ['gvfcore/components/app/sideinfo/contentmodels/devcontrol/appdevtools.css']
})

/**
 * Side-Info-Component-Content for graphs
 */
export class SideInfoContentAppDevToolsComponent implements OnDestroy {


    private logLevel = UiService.logLevelLimit;

    constructor(private intergraphEventService:InterGraphEventService) {

    }

    private onSliderChange(val) {
        this.logLevel = val;
        UiService.logLevelLimit = val;
    }

    private compareCommunityPlanes() {
        let planes = Plane.getPlanes();
        let p1 = planes[2];
        let p2 = planes[3];

        CombinedCommunityGraph.generateComparedGraph(
            <GroupGraphAbstract>p1.getGraph(),
            <GroupGraphAbstract>p2.getGraph()
        );
    }

    ngOnDestroy() {
        alert("Destroyed");
    }

}