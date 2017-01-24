import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {DataService} from '../../../services/data.service';

import {EdgeAbstract} from "./edges/abstract";
import {GraphLayoutFdl} from "./layouts/fdl";
import {NodeSimple} from "./nodes/simple";
import {BasicGroup} from "../data/basicgroup";
import {GraphLayoutRandom} from "./layouts/random";
import {GroupSimple} from "./groups/simple";


/**
 * Basic graph
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class SimpleGroups extends GraphAbstract {

    protected data:BasicGroup[];
    protected edges:EdgeAbstract[];

    constructor(protected plane:Plane) {
        super(plane);


        this.dataGetterMethod = DataService.getInstance().getDemoEntities.bind(DataService.getInstance());

        this.nodetype = GroupSimple;

        this.layoutClass = GraphLayoutRandom;
        //this.layoutClass = GraphLayoutFdl;
    }


    public init():void {
        super.init();

        //let groupGetterFct =

        console.log(this.data);
    }

}
