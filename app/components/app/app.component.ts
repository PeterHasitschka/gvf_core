import {Component, ViewChild, OnInit} from '@angular/core';
import {Plane} from '../plane/plane';
import {GraphworkspaceComponent} from '../graphworkspace/graphworkspace.component';
import {DataService} from '../../services/data.service';
import {UiService} from "../../services/ui.service";
import {SideInfoModel, SideInfoPositions, SideInfoContentType} from "./sideinfo/sideinfomodel";
import {Subscription} from "rxjs/Rx";

import {SideInfoPositionPipe} from "./sideinfo/contentmodels/sideinfopipe";

@Component({
    selector: 'afel-app',
    templateUrl: 'app/components/app/app.html',
    styleUrls: ['app/components/app/app.css'],
    providers: [DataService, UiService]
})
/**
 * Overall component loaded in the index.html (<afel-app/>)
 * Defining the HTML/CSS Grid system and loading the @see{GraphworkspaceComponent} component
 * @author Peter Hasitschka
 */
export class AppComponent implements OnInit {

    @ViewChild(GraphworkspaceComponent) graphworkspace:GraphworkspaceComponent;

    private posEnum;
    // private sideInfoElements;
    // private sideInfoSubscription:Subscription;

    /**
     * Constructor
     */
    constructor(private dataService:DataService, private uiService:UiService) {

        //this.sideInfoElements = this.uiService.sideInfoElements;

        // this.sideInfoSubscription = this.uiService.sideInfoEvent.subscribe((data)=> {
        //     console.log(data);
        //     this.sideInfoElements = data;
        // });

        this.posEnum = SideInfoPositions;
    }


    ngOnInit() {
        this.uiService.addSideInfoElement(new SideInfoModel(
            "Prototype",
            SideInfoPositions.Left,
            SideInfoContentType.Text,
            {text: "Prototype Version for demonstrating and planning feature described in D3.1"}
            )
        );

        //console.log(this.sideInfoElements);
    }


    /**
     * Dummy action to create a dummy plane triggered by button.
     * @todo: Remove if not necessary anymore
     */
    addDummyPlane():void {
        this.graphworkspace.addPlane(new Plane("Plane something " + Math.random(), 'resource', this.uiService));
    }

    /**
     * Console.log the data from the @see{DataService} Service.
     * @todo: Remove if not necessary anymore
     */
    showData():void {
    }
}