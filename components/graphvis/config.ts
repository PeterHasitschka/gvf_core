// import {ResourceGraph} from '../../../afel/graphs/resourcegraph';
// import {LearnerGraph} from '../../../afel/graphs/learnergraph';
import {BasicGraph} from "./graphs/graphbasic";
import {SimpleGroups} from "./graphs/graphgroupssimple";

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
            z: 330
        },

        backplane: {
            color: 0xFFEEEE,
            padding: 0,
            z: -1
        }
    };

    public static graphelements = {
        abstractnode: {
            segments: 32,
            size: 3,
            color: 0xff33ff,
            highlight_color: 0xff3333,
            z_pos: 0.0,
        },
        abstractgroup: {
            segments: 128,
            size: 50,
            color: 0xffcc55,
            highlight_color: 0xff3333,
            z_pos: 0.0
        }

    };

    public static edges = {
        abstractedge: {
            color: 0xaaaaff,
            z_pos: -1.0,
            thickness: 0.6
        }
    };

    /**
     * Defines the numbers of planes in a row
     * depending on the bootstrap class
     */
    public static plane_grid = {
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2
    };

    public static intergraph_connections = {
        width: 0.1,
        color: "grey"
    }


    public static active_graphs = {
        'basic': BasicGraph,
        'basicgroups': SimpleGroups
    };


}