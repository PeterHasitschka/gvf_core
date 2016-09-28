import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Plane} from '../plane/plane';
import {GraphVisConfig} from '../graphvis/config';
import {DataService} from "../../services/data.service";
import {UiService} from "../../services/ui.service";

@Component({
    selector: 'graphworkspace',
    templateUrl: 'app/components/graphworkspace/graphworkspace.component.html',
})
/**
 * Component holding all @see{PlaneComponent} elements.
 * Responsible for managing, adding, and removing them.
 * @author Peter Hasitschka
 */
export class GraphworkspaceComponent implements OnInit {

    private planes:Plane[];

    constructor(private dataService:DataService, private uiService:UiService) {
        this.planes = [];
    }

    ngOnInit():void {

        this.dataService.fetchData().then(() => {

            console.log("Creating two basic planes");
            this.addPlane(new Plane("Resource Graph", 'resource', this.uiService));
            this.addPlane(new Plane("Learner Graph", 'learner', this.uiService));
        });
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