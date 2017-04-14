import {OnDestroy, Component} from "@angular/core";
import {InterGraphEventService} from "../../../../../services/intergraphevents.service";
import {UiService} from "../../../../../services/ui.service";
import {Plane} from "../../../../plane/plane";
import {GroupGraphAbstract} from "../../../../graphvis/graphs/graphgroupabstract";
import {GroupCombinedGraphAbstract} from "../../../../graphvis/graphs/graphgroupcombinedabstract";
import {AnimationService} from "../../../../../services/animationservice";
import {ThreeWebGlRendererMoving} from "../../../../graphvis/three/threewebglrenderer";
import {GraphVisConfig} from "../../../../graphvis/config";
// import {CombinedCommunityGraph} from "../../../../../../afel/graph/graphs/combinedcommunitygraph";


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
    private animationService = AnimationService.getInstance();
    private planes:Plane[];
    private animationDebug = false;
    private renderDebug = false;

    constructor(private intergraphEventService:InterGraphEventService) {
        this.planes = Plane.getPlanes();
        this.renderDebug = GraphVisConfig.scene.debug.intervalledRenderStatistics;
        this.animationDebug = GraphVisConfig.scene.debug.animationStatistics;
    }

    private onSliderChange(val) {
        this.logLevel = val;
        UiService.logLevelLimit = val;
    }


    ngOnDestroy() {
        alert("Destroyed");
    }

}