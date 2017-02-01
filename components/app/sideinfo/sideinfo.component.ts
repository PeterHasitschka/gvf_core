import {Component, Input, OnInit} from '@angular/core';
import {SideInfoModel, SideInfoContentType, SideInfoPositions} from "./sideinfomodel";


@Component({
    selector: 'sideinfo',
    templateUrl: 'gvfcore/components/app/sideinfo/sideinfo.html',
    styleUrls: ['gvfcore/components/app/sideinfo/sideinfo.css']
})
/**
 * Little window in sidebars for showing information
 */
export class SideInfoComponent implements OnInit {

    @Input() private infomodel:SideInfoModel;
    @Input() private position:SideInfoPositions;

    public  types;

    constructor() {
        //Necessary since template can't handle global enums
        this.types = SideInfoContentType;
    }

    ngOnInit():void {
    }
}
