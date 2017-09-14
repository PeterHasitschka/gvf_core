import {Component, ViewChild, HostListener} from '@angular/core';
import {OnInit} from '@angular/core';
import {Plane} from '../plane/plane';
import {GraphVisConfig} from '../graphvis/config';
import {DataService} from "../../services/data.service";
import {UiService} from "../../services/ui.service";
import {ApiService} from "../../services/apiservice";


@Component({
    selector: 'graphworkspace',
    templateUrl: 'gvfcore/components/graphworkspace/graphworkspace.component.html',
    styleUrls: ['gvfcore/components/graphworkspace/graphworkspace.css'],
})

/**
 * Component holding all @see{PlaneComponent} elements.
 * Responsible for managing, adding, and removing them.
 * @author Peter Hasitschka
 */
export class GraphworkspaceComponent implements OnInit {

    private planes:Plane[];

    @ViewChild('graphworkspace_svgoverlay') svgElement;

    constructor(private dataService:DataService, private uiService:UiService, private apiService:ApiService) {
        this.planes = [];
        this.uiService.setGraphWorkSpace(this);
    }


    ngOnInit():void {
        // Necessary for mousemoves
        this.uiService.setGraphWorkSpaceSvgElement(this.svgElement.nativeElement);

        this.apiService.sendEvent("initready", null);


        this.sayGoodbye();


        // DataService.getInstance().fetchData().then(() => {
        //     //console.log("Fetched Demo Data", DataService.getInstance().getDemoEntities());
        // });
    }

    /**
     * A message to all my current colleagues and those who will work on GVF in the future.
     * Please take care of my baby and NEVER EVER THINK ABOUT WRITING PROJECT RELATED STUFF INTO THE CORE!
     */
    private sayGoodbye() {
        console.log("%c🐬🐬🐬🐬%c\tSo Long, and Thanks for All the Fish\t%c🐬🐬🐬🐬",
            "font-weight:bold; font-size:20px; color:white; background:black",
            "font-weight:bold; font-size:20px; color:cyan; background:black",
            "font-weight:bold; font-size:20px; color:white; background:black");
        console.log("%cIt was just a fantastic time with you guys!\n" +
            "I wish you all the best for the future. Please take care of my baby, the GVF!\n" +
            "Best, Peter!",
        "font-weight:bold; font-size:18px; color:yellow; background:black");
    }

    /**
     * Returning all registered planes
     */
    public getPlanes():Plane[] {
        return this.planes;
    }

    /**
     * Adding a new @see{Plane} object
     * @param {Plane}
     */
    public addPlane(plane):void {
        this.planes.push(plane);
    }

    /**
     * Calculating the bootstrap-grid classes, defined in the @see{GraphVisConfig}
     * @returns string - classes
     */
    public getGridClasses():string {
        var c = GraphVisConfig.plane_grid;
        var out = "col-xs-" + (12 / c.xs) + " col-sm-" + (12 / c.sm) +
            " col-md-" + (12 / c.md) + " col-lg-" + (12 / c.lg);
        return out;
    }

} 