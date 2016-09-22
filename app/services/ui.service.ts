import {Injectable} from "@angular/core";
import {SideInfoComponent} from "../components/app/sideinfo/sideinfo.component";
import {SideInfoModel} from "../components/app/sideinfo/sideinfomodel";
@Injectable()
/**
 * Service for allowing the UI elements to communicate.
 * @author Peter Hasitschka
 */
export class UiService {

    private sideInfoElements:SideInfoModel[];

    constructor() {

        console.log("Created UI SERVICE");
        this.sideInfoElements = [];
    }


    addSideInfoElement(sideInfo:SideInfoModel) {
        this.sideInfoElements.push(sideInfo);
    }

    getSideInfoElements():SideInfoModel[] {
        return this.sideInfoElements;
    }

}