import {ResourceGraph} from './graphs/resourcegraph';

export class GraphVisConfig {

    public static scene = {
        view_angle: 100,
        near: 0.1,
        far: 10000,

        camera: {
            z: 300
        }
    }

    /**
     * Defines the numbers of planes in a row
     * depending on the bootstrap class
     */
    public static plane_grid = {
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2
    }


    public static active_graphs = {
        'resource': ResourceGraph
    }


}