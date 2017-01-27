import {Component, ViewChild, OnInit, HostListener} from '@angular/core';
import {Plane} from '../plane/plane';
import {GraphworkspaceComponent} from '../graphworkspace/graphworkspace.component';
import {DataService} from '../../services/data.service';
import {UiService} from "../../services/ui.service";
import {SideInfoModel, SideInfoPositions, SideInfoContentType} from "./sideinfo/sideinfomodel";
import {Subscription} from "rxjs/Rx";

import {SideInfoPositionPipe} from "./sideinfo/contentmodels/sideinfopipe";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../services/intergraphevents.service";
import {ApiService} from "../../services/apiservice";
import {GvfPlugins} from "../../../plugins/plugins";
import {GvfPluginInterface} from "../../../plugins/plugininterface";

@Component({
    selector: 'gvf-app',
    templateUrl: 'gvfcore/components/app/app.html',
    styleUrls: ['gvfcore/components/app/app.css'],
    providers: [DataService, UiService, InterGraphEventService, ApiService]
})
/**
 * Overall component loaded in the index.html (<gvf-app/>)
 * Defining the HTML/CSS Grid system and loading the @see{GraphworkspaceComponent} component
 * @author Peter Hasitschka
 */
export class AppComponent implements OnInit {

    @ViewChild(GraphworkspaceComponent) graphworkspace:GraphworkspaceComponent;

    private posEnum;


    /**
     * Constructor
     */
    constructor(private dataService:DataService, private uiService:UiService) {

        this.posEnum = SideInfoPositions;
    }


    /**
     * Ensure that no highlights of nodes etc. remain when mouse is moved outside graphs
     * @type {number}
     */
    /*
     private mouseMoveConter = 0;
     @HostListener('mousemove', ['$event'])
     onMousemove(event:MouseEvent) {
     this.mouseMoveConter++;
     this.mouseMoveConter %= 20;

     if (this.mouseMoveConter !== 0)
     return;

     for (let i in event["path"]) {
     let elm = <HTMLElement>event["path"][i];
     if (elm.tagName === "GRAPH-PLANE") {
     return;
     }
     }
     InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.OUTSIDE_ALL_GRAPHS, null);
     }
     */


    ngOnInit() {
        this.uiService.addSideInfoElement(new SideInfoModel(
            '<i class="fa fa-info-circle" aria-hidden="true"></i> Status',
            SideInfoPositions.Left,
            SideInfoContentType.Text,
            {
                text: "Prototype of GVF.<br>" +
                "Different graphs visualizing different entities and connections can be shown.<br>" +
                "A basic simple FDL algorithm is used.<br>" +
                "Basic Connections between different graphs can be shown.<br>" +
                "Simple groups (communities) can be represented in seperate graphs (WIP)<br>" +
                "<br>-- P.H., 26.01.2017"
            }
            )
        );


        this.uiService.addSideInfoElement(new SideInfoModel(
            '<i class="fa fa-info-circle" aria-hidden="true"></i> Element-Info',
            SideInfoPositions.Right,
            SideInfoContentType.DynamicInfo,
            {
                //graphtype: this.plane.getGraphType()
            }
            )
        );

        //console.log(this.sideInfoElements);

        this.loadPlugins();
    }


    /**
     * Simple Plugin Loader.
     */
    loadPlugins() {
        console.log("Loading plugins");

        let pluginList = GvfPlugins.plugins.onInit;
        console.log("Loading plugins");
        for (let pluginClass of pluginList) {
            let plugin = new pluginClass();
            plugin.runAfterInit();
        }
    }


    /**
     * Dummy action to create a dummy plane triggered by button.
     * @todo: Remove if not necessary anymore
     */
    addDummyPlane():void {
        this.graphworkspace.addPlane(new Plane("Plane something " + Math.random(), 'basic', this.uiService));
    }

    addDummyGroupPlane() {
        this.graphworkspace.addPlane(new Plane("Dummy Groups (Communities)", 'basicgroups', this.uiService));
    }

    /**
     * Console.log the data from the @see{DataService} Service.
     * @todo: Remove if not necessary anymore
     */
    showData():void {
    }


    onShowInterConnectionsClick(evt) {
        //console.log(evt);
        this.uiService.setGraphWorkSpaceSvgElementVisible(evt.target.checked);
    }
}