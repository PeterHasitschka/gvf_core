

import {MyDemoApi} from "../mydemoapp/mydemoapi";



export class GvfPlugins {

    /**
     * Add your plugin classes here!
     */
    static plugins = {
        onInit : [
            MyDemoApi
        ]
    }
}