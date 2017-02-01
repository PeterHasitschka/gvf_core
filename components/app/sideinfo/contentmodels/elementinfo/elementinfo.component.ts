import {SideInfoComponent} from "../../sideinfo.component";
import {OnDestroy, Component, Input} from "@angular/core";
import {GraphAbstract} from "../../../../graphvis/graphs/graphabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../../services/intergraphevents.service";
import {GraphVisConfig} from "../../../../graphvis/config";
import {ElementAbstract} from "../../../../graphvis/graphs/graphelementabstract";
import {GroupAbstract} from "../../../../graphvis/graphs/groups/groupelementabstract";
import {BasicGroup} from "../../../../graphvis/data/databasicgroup";
import {BasicEntity} from "../../../../graphvis/data/databasicentity";

@Component({
    selector: 'sideinfoelementinfo',
    templateUrl: 'gvfcore/components/app/sideinfo/contentmodels/elementinfo/elementinfo.html',
    styleUrls: ['gvfcore/components/app/sideinfo/contentmodels/elementinfo/element.css']
})

/**
 * Side-Info-Component-Content for graphs
 */
export class SideInfoContentElementInfoComponent implements OnDestroy {

    @Input() data:{};
    private elementInfo = false;

    constructor(private intergraphEventService:InterGraphEventService) {


        this.intergraphEventService.addListener(INTERGRAPH_EVENTS.ELEMENT_HOVERED, function (e) {
            this.dynInfo = [];

            let element:ElementAbstract = e.detail;
            this.dynInfo.push("Element-Type: " + element.name);
            this.dynInfo.push("Data-ID: " + element.getDataEntity().getId());

            if (element instanceof GroupAbstract) {

                let groupData = <BasicGroup>element.getDataEntity();
                this.dynInfo.push("Group Type: " + element.constructor.name);
                this.dynInfo.push("Contains " + groupData.getEntities().length + " " +
                    groupData.getEntities()[0].constructor.name + " elements");
            }

            this.dynInfo.push(JSON.stringify(element.getDataEntity().getData()));
        }.bind(this));

        this.intergraphEventService.addListener(INTERGRAPH_EVENTS.ELEMENT_LEFT, function (e) {
            //this.dynInfo = false;
        }.bind(this));
    }

    ngOnDestroy() {
        alert("Destroyed");
    }

}