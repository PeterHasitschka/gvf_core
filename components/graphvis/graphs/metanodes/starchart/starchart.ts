import {MetanodeAbstract} from "../metanodeabstract";
import {NodeAbstract} from "../../nodes/nodeelementabstract";
import {Plane} from "../../../../plane/plane";
import {Pie} from "../pie";
import {Label} from "../../labels/label";
export abstract class StarChart extends MetanodeAbstract {

    /**
     * Filled by parent constructor
     */
    protected metanodeOptions:any;

    protected static starChartConfig = {

        nodes: [
            // {
            //     type: NodeClassHere,
            //     properties: [
            //         {
            //             property: "someProp",
            //             color: 0x1b9e77
            //         },
            //         {
            //             property: "anotherProp",
            //             color: 0xd95f02
            //         }
            //         ,
            //         {
            //             property: "xxx",
            //             color: 0x7570b3
            //         },
            //         {
            //             property: "xxx",
            //             color: 0xe7298a
            //         }
            //     ]
            // },
            // {
            //     type: AnotherNodeClass,
            //     properties: []
            // }
        ],

        propPies: {
            maxRad: 70,
            minRad: 30,
            paddingNodeRad: 0.02 * Math.PI * 2,
            paddingPropRad: 0.04 * Math.PI * 2,
            paddingValRad: 0.005 * Math.PI * 2,
        },

        labels: {
            pieNodeLabel: false,
            pieNodeLabelDistance: 110,
            pieNodeLabelFontSize: 20,
            pieNodeLabelStrokeColor: "#888888",
            //
            piePropLabelDistance: 200,
            piePropLabelFontSize: 20,
            piePropLabelStrokeColor: "#888888",
            hidden: true,
            //
            piePropValLabelDistance: 85,
            piePropValLabelFontSize: 18,
            piePropValLabelStrokeColor: "#888888",
            hidden: true
        }
    };

    /**
     *
     * @param x X-Position
     * @param y X-Position
     * @param nodes Array of node objects
     * @param plane Plane
     * @param config (Extended) Copy of StarChart.starChartConfig (will be set in MetanodeAbstract as metanodeOptions for further usage in this class)
     */
    constructor(x:number, y:number, nodes:NodeAbstract[], plane:Plane, config) {
        super(x, y, nodes, plane, config);
        this.createMeshs(null);
        for (var meshKey in this.meshs) {
            this.add(this.meshs[meshKey]);
        }
        this.plane.getGraphScene().render();
        this.name = "Start Chart Meta-Node";
    }

    /**
     * Create all THREE.js elements which represent the star-chart
     * first the pies representing the nodetype relations are created.
     * then, for each nodetype, the property-relations are fetched and created
     * @param options
     */
    protected createMeshs(options) {
        let sortedNodes = {};
        this.metanodeOptions.nodes.forEach((nodeConfig) => {
            sortedNodes[nodeConfig.type.name] = [];
        });
        this.nodes.forEach((n:NodeAbstract) => {
            let nodeTypeIndentifier = n.constructor.name;
            if (typeof sortedNodes[nodeTypeIndentifier] !== "undefined")
                sortedNodes[nodeTypeIndentifier].push(n);
        });

        // HOLDING EVERYTHING!
        let starGroup = new THREE.Group();
        let startAngleRad = 0.0;
        this.metanodeOptions.nodes.forEach((nodeConfig) => {
            if (!sortedNodes[nodeConfig.type.name].length)
                return;

            let color = sortedNodes[nodeConfig.type.name][0].getColor();

            // Calculate angles of node-pie
            let factorUsed = sortedNodes[nodeConfig.type.name].length / this.nodes.length;
            let endAngleRad = startAngleRad + factorUsed * Math.PI * 2;

            let nodePieMesh = new Pie(startAngleRad, endAngleRad, 50, color, 0);
            let nodePieGroup = new THREE.Group();
            nodePieGroup.add(nodePieMesh);


            if (StarChart.starChartConfig.labels.pieNodeLabel) {
                let nodePieLabel = this.createNodePieLabel(nodeConfig, startAngleRad, endAngleRad, color);
                nodePieGroup.add(nodePieLabel);
                this.labels.push(nodePieLabel);
            }


            /*
             Create the property pies and add them to the nodePieGroup
             */
            let aggrPropGroup = this.getAggregatedPropGroup(nodeConfig, nodePieMesh);
            nodePieGroup.add(aggrPropGroup);


            starGroup.add(nodePieGroup);
            startAngleRad = endAngleRad;
        });
        this.meshs['stargroup'] = starGroup;
    }

    private createNodePieLabel(nodeConfig, startAngleRad, endAngleRad, color) {
        let labelPosX = this.metanodeOptions.labels.pieNodeLabelDistance * Math.sin((startAngleRad + endAngleRad) / 2);
        let labelPosY = this.metanodeOptions.labels.pieNodeLabelDistance * Math.cos((startAngleRad + endAngleRad) / 2);

        let rotDegree = ((startAngleRad + endAngleRad) / 2) * 360 / (Math.PI * 2);
        let hexStrColor = "#" + color.toString(16);
        let nodePieLabel = new Label(this.plane, nodeConfig.type.name, labelPosX, labelPosY, {
            rotateDegree: rotDegree,
            color: hexStrColor,
            fontSize: this.metanodeOptions.labels.pieNodeLabelFontSize,
            strokeColor: this.metanodeOptions.labels.pieNodeLabelStrokeColor,
            hidden: this.metanodeOptions.labels.hidden
        });
        return nodePieLabel;
    }


    private getAggregatedPropGroup(nodeConfig, nodePie:Pie):THREE.Group {

        let propGroup = new THREE.Group();

        let startAngle = nodePie.getAngles().start + this.metanodeOptions.propPies.paddingNodeRad;
        let endAngle = nodePie.getAngles().end - this.metanodeOptions.propPies.paddingNodeRad;
        let propWidth = (endAngle - startAngle) / nodeConfig.properties.length;

        let currStartAngle = startAngle;

        /*
         Go THROUGH MULTIPLE PROPERTIES!
         */
        nodeConfig.properties.forEach((propConfig, key) => {
            let propName = propConfig.property;
            let color = propConfig.color;


            let collectedPropVals = this.collectPropertyValuesOfNodes(nodeConfig.type, propName);

            let propValCount = 0;
            let propValLength = Object.keys(collectedPropVals.vals).length;

            // If not the last property of the nodes --> padding between them
            let betweenPropPadding = key === nodeConfig.properties.length - 1 ? 0 : this.metanodeOptions.propPies.paddingPropRad;

            /*
             Go THROUGH VALUES
             */


            let propPieWidth = (propWidth - betweenPropPadding) / propValLength;
            let propLabel = this.createPropLabel(propName, currStartAngle, currStartAngle + propWidth, color);
            propGroup.add(propLabel);
            this.labels.push(propLabel);

            for (var propVal in collectedPropVals.vals) {

                let valOccurenceAmount = collectedPropVals.vals[propVal];
                // Value between 0 and 1 representing the number of occurences
                let occurenceRelation = collectedPropVals.max === collectedPropVals.min ? 1 :
                (valOccurenceAmount - collectedPropVals.min) / (collectedPropVals.max - collectedPropVals.min);

                let radius = this.metanodeOptions.propPies.minRad +
                    (this.metanodeOptions.propPies.maxRad - this.metanodeOptions.propPies.minRad) * occurenceRelation;

                let valPadding = this.metanodeOptions.propPies.paddingValRad;
                if (propValCount === propValLength - 1)
                    valPadding = 0;

                let propPie = new Pie(currStartAngle,
                    currStartAngle + propPieWidth - valPadding,
                    radius,
                    color,
                    1);

                let propLabel = this.createPropValPieLabel(propVal, currStartAngle, currStartAngle + propPieWidth - valPadding, color);

                currStartAngle = currStartAngle + propPieWidth;

                propGroup.add(propPie);
                propGroup.add(propLabel);
                this.labels.push(propLabel);


                propValCount++;
            }
            // Add padding between properties
            currStartAngle += betweenPropPadding;
        });
        return propGroup;
    }


    private createPropLabel(title, startAngleRad, endAngleRad, color) {
        let labelPosX = this.metanodeOptions.labels.piePropLabelDistance * Math.sin((startAngleRad + endAngleRad) / 2);
        let labelPosY = this.metanodeOptions.labels.piePropLabelDistance * Math.cos((startAngleRad + endAngleRad) / 2);

        let rotDegree = (((startAngleRad + endAngleRad) / 2 ) * 360 / (Math.PI * 2)) + 90;
        let hexStrColor = "#" + color.toString(16);
        let nodePieLabel = new Label(this.plane, title, labelPosX, labelPosY, {
            rotateDegree: rotDegree,
            color: hexStrColor,
            fontSize: this.metanodeOptions.labels.piePropLabelFontSize,
            strokeColor: this.metanodeOptions.labels.piePropLabelStrokeColor,
            hidden: this.metanodeOptions.labels.hidden
        });
        return nodePieLabel;
    }

    private createPropValPieLabel(title, startAngleRad, endAngleRad, color) {
        let labelPosX = this.metanodeOptions.labels.piePropValLabelDistance * Math.sin((startAngleRad + endAngleRad) / 2);
        let labelPosY = this.metanodeOptions.labels.piePropValLabelDistance * Math.cos((startAngleRad + endAngleRad) / 2);

        let rotDegree = (((startAngleRad + endAngleRad) / 2 ) * 360 / (Math.PI * 2)) + 90;
        let hexStrColor = "#" + color.toString(16);
        let nodePieLabel = new Label(this.plane, title, labelPosX, labelPosY, {
            rotateDegree: rotDegree,
            color: hexStrColor,
            fontSize: this.metanodeOptions.labels.piePropValLabelFontSize,
            strokeColor: this.metanodeOptions.labels.piePropValLabelStrokeColor,
            hidden: this.metanodeOptions.labels.hidden
        });
        return nodePieLabel;
    }


    /**
     * Collect number of occurrences of values of a given property on a specific node type
     * Further returns min and max occurrences
     * @param nodeClass Class of the nodes to filter the right ones
     * @param property Key of the property
     * @returns {{min: number, max: number, vals: {}}}
     */
    private collectPropertyValuesOfNodes(nodeClass, property) {
        let outData = {
            min: 1000000,
            max: -1000000,
            vals: {}
        };
        // Aggregate
        this.nodes.forEach((n:NodeAbstract) => {
            if (n.constructor !== nodeClass)
                return;
            let val = n.getDataEntity().getData(property);
            if (typeof outData.vals[val] === "undefined")
                outData.vals[val] = 0;
            outData.vals[val]++;
        });

        // Find min and max
        for (var k in outData.vals) {
            outData.min = Math.min(outData.min, outData.vals[k]);
            outData.max = Math.max(outData.max, outData.vals[k]);
        }
        return outData;
    }

}
