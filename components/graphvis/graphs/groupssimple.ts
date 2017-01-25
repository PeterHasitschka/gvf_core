import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {DataService} from '../../../services/data.service';

import {EdgeAbstract} from "./edges/abstract";
import {GraphLayoutFdl} from "./layouts/fdl";
import {NodeSimple} from "./nodes/simple";
import {BasicGroup} from "../data/basicgroup";
import {GraphLayoutRandom} from "./layouts/random";
import {GroupSimple} from "./groups/simple";
import {ElementAbstract} from "./elementabstract";
import {GroupAbstract} from "./groups/abstract";


/**
 * Basic graph
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class SimpleGroups extends GraphAbstract {

    protected edges:EdgeAbstract[];
    protected graphElements:GroupAbstract[];

    constructor(protected plane:Plane) {
        super(plane);


        this.dataGetterMethod = DataService.getInstance().getDemoGroups.bind(DataService.getInstance());

        this.nodetype = GroupSimple;

        //this.layoutClass = GraphLayoutRandom;
        this.layoutClass = GraphLayoutFdl;
    }


    public init():void {
        super.init();
        this.setInitiScales();
    }


    protected setInitiScales() {
        let nums = [];
        this.graphElements.forEach((g:GroupAbstract) => {
            let groupDataObj = <BasicGroup>g.getDataEntity();
            nums.push(groupDataObj.getEntities().length);
        });
        let max = Math.max.apply(Math, nums);

        this.graphElements.forEach((g:GroupAbstract) => {
            let groupDataObj = <BasicGroup>g.getDataEntity();
            g.setScale(groupDataObj.getEntities().length / max);
        });

        this.plane.getGraphScene().render();
    }

}
