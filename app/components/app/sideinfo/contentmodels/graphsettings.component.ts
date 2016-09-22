import {SideInfoComponent} from "../sideinfo.component";
import {OnDestroy, Component, Input} from "@angular/core";
import {GraphAbstract} from "../../../graphvis/graphs/abstract";

@Component({
    selector: 'sideinfocontentgraph',
    templateUrl: 'app/components/app/sideinfo/contentmodels/graph.html',
    // styleUrls: ['app/components/app/sideinfo/sideinfo.css']
})
export class SideInfoContentGraphsettings implements OnDestroy {

    @Input() data:{};

    constructor() {

    }

    ngOnDestroy() {
        alert("Destroyed");
    }

}