import {Component, ViewChild} from '@angular/core';
import {Plane} from '../plane/plane';
import {GraphworkspaceComponent} from '../graphworkspace/graphworkspace.component';
import {DataService} from '../../services/data.service';
import {UiService} from "../../services/ui.service";
import {SideInfoModel, SideInfoPositions, SideInfoContentType} from "./sideinfo/sideinfomodel";

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
export class AppComponent {

    @ViewChild(GraphworkspaceComponent) graphworkspace:GraphworkspaceComponent;

    /**
     * Constructor
     */
    constructor(private dataService:DataService, private uiService:UiService) {

        this.uiService.addSideInfoElement(new SideInfoModel(
            "testLeftGraph",
            SideInfoPositions.Left,
            SideInfoContentType.GraphSettings
            )
        );
        this.uiService.addSideInfoElement(new SideInfoModel(
            "Prototype",
            SideInfoPositions.Left,
            SideInfoContentType.Text,
            {text: "Prototype Version for demonstrating and planning feature described in D3.1"}
            )
        );

    }

    /**
     * Dummy action to create a dummy plane triggered by button.
     * @todo: Remove if not necessary anymore
     */
    addDummyPlane():void {
        this.graphworkspace.addPlane(new Plane("Plane something " + Math.random(), 'resource'));
    }

    /**
     * Console.log the data from the @see{DataService} Service.
     * @todo: Remove if not necessary anymore
     */
    showData():void {
        // this.dataService.getLearners().then(learners => {
        //         console.log("LEARNERS:", learners);
        //     }
        // );
        // this.dataService.getResources().then(resources => {
        //         console.log("RESOURCES:", resources);
        //     }
        // );
        // this.dataService.getActivities().then(activities => {
        //         console.log("ACTIVITIES:", activities);
        //     }
        // );
    }
}