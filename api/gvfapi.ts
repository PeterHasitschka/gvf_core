import {Plane} from "../components/plane/plane";
import {UiService} from "../services/ui.service";

export class GvfApi {


    constructor() {

        console.log("GVF API created");

        window.addEventListener("initready", function (data) {
            console.log("API: Graphworkspace loaded!");
        }, false);
    }


    static addPlane(name:string, type:Function) {
        UiService.getInstance().getGraphWorkSpace().addPlane(new Plane(name, type, UiService.getInstance()));
    }
}