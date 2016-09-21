import { Component, Input } from '@angular/core';



@Component({
    selector: 'sideinfo',
    templateUrl: 'app/components/app/sideinfo/sideinfo.html',
    styleUrls: ['app/components/app/sideinfo/sideinfo.css']
})
/**
 * Little window in sidebars for showing information
 */
export class SideInfoComponent {

    public title: string;
    public text: string;
    @Input() identifier: string;
    @Input() title: string;
    constructor() {
        this.text = "text";
    }
}