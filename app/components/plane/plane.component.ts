import {Component, Input} from '@angular/core';
import {Plane} from './plane';
import {DataService} from '../../services/data.service';
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../app/sideinfo/sideinfomodel";
import {UiService} from "../../services/ui.service";


@Component({
    selector: 'graph-plane',
    templateUrl: 'app/components/plane/plane.component.html',
    styleUrls: ['app/components/plane/plane.css'],
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


    constructor(private uiService:UiService) {
        this.id = PlaneComponent.counter;
        PlaneComponent.counter++;
    }

    /**
     * Initializing the scene on the @see{Plane} after making sure that
     * the container HTML element exists now
     */
    ngAfterViewInit():void {
        this.uiService.addSideInfoElement(new SideInfoModel(
            this.plane.getName(),
            SideInfoPositions.Left,
            SideInfoContentType.GraphSettings,
            {
                graphtype: this.plane.getGraphType()
            }
            )
        );

        window.setTimeout(function () {
            this.plane.initScene(this.id);
        }.bind(this), 0)
    }

    public getId():number {
        return this.id;
    }
} 
