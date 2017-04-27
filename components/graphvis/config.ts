import {MetanodeSimple} from "./graphs/metanodes/metanodesimple";

/**
 * Configurations related to the Graph Visualization
 * @author Peter Hasitschka
 */
export class GraphVisConfig {

    public static environment = {
        title: "<i>Graph-Visualization-Framework</i> (GVF)",
        showleftcol: true
    };

    /**
     * Scene related configuration
     */
    public static scene = {
        near: 0.1,
        far: 10000,

        camera: {
            z: 330,
            zoomfactor: 1.1
        },

        backplane: {
            color: '#FFEEEE',
            padding: 0,
            z: -100
        },
        debug: {
            animationStatistics: true,
            intervalledRenderStatistics: false,
            clickDebug: false,
            hoverDebug: false,
            dataDebug: true
        }
    };

    public static graphelements = {
        abstractnode: {
            segments: 32,
            size: 3,
            color: 0xff33ff,
            highlight_color: 0xff3333,
            select_color: 0xff0000,
            z_pos: 0.0,
        },
        abstractgroup: {
            segments: 128,
            size: 50,
            color: 0xffcc55,
            highlight_color: 0x00FFFF,
            z_pos: -1.0,
            opacity: 0.5,
        },
        metanode: {
            type: MetanodeSimple,
            zoom : 0.7
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
        width: 1.0,
        color: "red" // SVG stroke color
    };
}