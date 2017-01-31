import {Component, Input, ViewEncapsulation, HostListener} from '@angular/core';
import {Plane} from './plane';
import {DataService} from '../../services/data.service';
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../app/sideinfo/sideinfomodel";
import {UiService} from "../../services/ui.service";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../services/intergraphevents.service";


@Component({
    selector: 'graph-plane',
    templateUrl: 'gvfcore/components/plane/plane.component.html',
    styleUrls: ['gvfcore/components/plane/plane.css'],
    encapsulation: ViewEncapsulation.None,  //To allow applying css on dynamically created canvas
})
/**
 * Component holding a @see{Plane} object
 * Additionally it contains an id, that defines the container for the scene
 * @author{Peter Hasitschka}
 */
export class PlaneComponent {

    private static counter:number = 0;

    private allData = {
        learners: null,
        resources: null,
        activities: null
    }

    // The plane object
    @Input() plane:Plane;
    private id:number;


    constructor(private uiService:UiService, private intergrapheventService:InterGraphEventService) {
        this.id = PlaneComponent.counter;
        PlaneComponent.counter++;
    }

    /**
     * Send event when mouse left this graph!
     * @param event
     */
    @HostListener('mousemove', ['$event'])
    onMousemove(event:MouseEvent) {
        if (this.intergrapheventService.planeHovered === this.getId())
            return;
        this.intergrapheventService.planeHovered = this.getId();
        this.intergrapheventService.send(INTERGRAPH_EVENTS.GRAPH_LEFT, null);
    }

    /**
     * Initializing the scene on the @see{Plane} after making sure that
     * the container HTML element exists now
     */
    ngAfterViewInit():void {
        // this.uiService.addSideInfoElement(new SideInfoModel(
        //     this.plane.getName(),
        //     SideInfoPositions.Left,
        //     SideInfoContentType.GraphSettings,
        //     {
        //         graphtype: this.plane.getGraphType()
        //     }
        //     )
        // );

        window.setTimeout(function () {
            this.plane.initScene(this.id);
        }.bind(this), 0)
    }

    public getId():number {
        return this.id;
    }


} 
