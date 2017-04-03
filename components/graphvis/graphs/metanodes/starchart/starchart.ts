import {Plane} from "../../../../plane/plane";
import {NodeAbstract} from "../../nodes/nodeelementabstract";
import {MetanodeAbstract} from "../metanodeabstract";
import {NodeDoc} from "../../../../../../moving/graph/nodes/nodedoc";
import {NodeAuthor} from "../../../../../../moving/graph/nodes/nodeauthor";
import {NodeAffiliation} from "../../../../../../moving/graph/nodes/nodeaffiliation";
import {Pie} from "./pie";
export class StarChart extends MetanodeAbstract {


    protected static startChartConfig = {

        nodeOrder: [
            NodeDoc,
            NodeAuthor,
            NodeAffiliation
        ]
    };


    constructor(x:number, y:number, nodes:NodeAbstract[], plane:Plane) {
        super(x, y, nodes, plane, {'size': 50});
        this.name = "Start Chart Meta-Node";
    }


    protected createMeshs(options) {

        let sortedNodes = {};
        StarChart.startChartConfig.nodeOrder.forEach((nodeClass) => {
            sortedNodes[nodeClass.name] = [];
        });
        this.nodes.forEach((n:NodeAbstract) => {
            let nodeTypeIndentifier = n.constructor.name;
            sortedNodes[nodeTypeIndentifier].push(n);
        });

        // HOLDING EVERYTHING!
        let group = new THREE.Group();
        let startAngleRad = 0.0;
        StarChart.startChartConfig.nodeOrder.forEach((nodeClass) => {

            if (!sortedNodes[nodeClass.name].length)
                return;

            let color = sortedNodes[nodeClass.name][0].getColor();

            let factorUsed = sortedNodes[nodeClass.name].length / this.nodes.length;
            let endAngleRad = startAngleRad + factorUsed * Math.PI * 2;
            console.log(nodeClass.name, sortedNodes[nodeClass.name].length);

            let pieMesh = new Pie(startAngleRad, endAngleRad, 100, color);
            group.add(pieMesh);
            startAngleRad = endAngleRad;
        });

        this.meshs['stargroup'] = group;
    }
}
