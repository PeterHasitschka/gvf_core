import {Injectable} from "@angular/core";
import {SideInfoComponent} from "../components/app/sideinfo/sideinfo.component";
import {SideInfoModel, SideInfoPositions} from "../components/app/sideinfo/sideinfomodel";
import {BehaviorSubject} from "rxjs/Rx";


@Injectable()
/**
 * Service for allowing the UI elements to communicate.
 * Optional singleton concept => Usage in non-components (where injection does not work): DataService.getInstance()
 * @author Peter Hasitschka
 */
export class UiService {

    public sideInfoElements:SideInfoModel[];

    constructor() {

        this.sideInfoElements = [];
        console.log("Created UI SERVICE");
    }


    addSideInfoElement(sideInfo:SideInfoModel) {
        window.setTimeout(function () {
            this.sideInfoElements.push(sideInfo);
        }.bind(this));
    }

    getSideInfoElements():SideInfoModel[] {
        return this.sideInfoElements;
    }

}