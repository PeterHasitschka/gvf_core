import {ResourceGraph} from './graphs/resourcegraph';

/**
 * Configurations related to the Graph Visualization
 * @author Peter Hasitschka
 */
export class GraphVisConfig {

    /**
     * Scene related configuration
     */
    public static scene = {
        near: 0.1,
        far: 10000,

        camera: {
            z: 300
        }
    }

    public static nodes = {
        segments: 10,
        abstractnode: {
            size: 7,
            color: 0xff00ff,
            z_pos: 0.0
        },

        resourcenode: {

        }
    }

    /**
     * Defines the numbers of planes in a row
     * depending on the bootstrap class
     */
    public static plane_grid = {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1
    }


    public static active_graphs = {
        'resource': ResourceGraph
    }


}