import {ResourceGraph} from './graphs/resourcegraph';
import {LearnerGraph} from './graphs/learnergraph';

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
        segments: 32,
        abstractnode: {
            size: 5,
            color: 0xff00ff,
            highlight_color: 0xff0000,
            z_pos: 0.0,
        },

        resourcenode: {
            color: 0x0000ff
        },
        learnernode: {
            color: 0x00aa00
        }
    }

    public static edges = {
        abstractedge: {
            color: 0xff0000,
            z_pos: -1.0
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
        'resource': ResourceGraph,
        'learner': LearnerGraph
    }


}