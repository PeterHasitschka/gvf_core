import {Component, ViewChild, OnInit, HostListener} from '@angular/core';
import {Plane} from '../plane/plane';
import {GraphworkspaceComponent} from '../graphworkspace/graphworkspace.component';
import {DataService} from '../../services/data.service';
import {UiService} from "../../services/ui.service";
import {SideInfoModel, SideInfoPositions, SideInfoContentType} from "./sideinfo/sideinfomodel";
import {Subscription} from "rxjs/Rx";

import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../services/intergraphevents.service";
import {ApiService} from "../../services/apiservice";
import {GvfPlugins} from "../../../plugins/plugins";
import {GvfPluginInterface} from "../../../plugins/plugininterface";
import {BasicGraph} from "../graphvis/graphs/graphbasic";
import {SimpleGroups} from "../graphvis/graphs/graphgroupssimple";

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
    constructor(private dataService:DataService, private uiService:UiService, private intergrapheventService:InterGraphEventService) {

        this.posEnum = SideInfoPositions;
    }



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

        this.uiService.addSideInfoElement(new SideInfoModel(
            '<i class="fa fa-hand-spock-o" aria-hidden="true"></i> App-Dev Tools',
            SideInfoPositions.Right,
            SideInfoContentType.AppDevTools
        ));


        this.loadPlugins();
    }


    /**
     * Simple Plugin Loader.
     */
    loadPlugins() {


        let pluginList = GvfPlugins.plugins.onInit;
        UiService.consolelog("Loading " + pluginList.length + "plugins",this,null, 3);
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
        this.graphworkspace.addPlane(new Plane("Plane something " + Math.random(), BasicGraph, this.uiService));
    }

    addDummyGroupPlane() {
        this.graphworkspace.addPlane(new Plane("Dummy Groups (Communities)", SimpleGroups, this.uiService));
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