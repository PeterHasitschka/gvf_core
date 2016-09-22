import {Component, Input, OnInit} from '@angular/core';
import {SideInfoModel, SideInfoContentType} from "./sideinfomodel";


@Component({
    selector: 'sideinfo',
    templateUrl: 'app/components/app/sideinfo/sideinfo.html',
    styleUrls: ['app/components/app/sideinfo/sideinfo.css']
})
/**
 * Little window in sidebars for showing information
 */
export class SideInfoComponent implements OnInit {

    @Input() private infomodel:SideInfoModel

    public types;
    constructor() {
        //Necessary since template can't handle global enums
        this.types = SideInfoContentType;
    }

    ngOnInit():void {
        console.log(this.infomodel);

    }
}
