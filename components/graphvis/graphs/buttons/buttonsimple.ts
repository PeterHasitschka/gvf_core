import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
export class ButtonSimple extends ElementAbstract {

    protected buttonMesh:THREE.Mesh;
    protected opacityLow;


    constructor(x:number, y:number, plane:Plane, options:Object) {
        if (!options)
            options = {};

        super(x, y, null, plane, options);

        this.opacityLow = 0.5;

        if (typeof options['color'] !== "undefined")
            this.color = options['color'];

        this.buttonMesh = new THREE.Mesh(new THREE.CircleGeometry(
            20, 32
            ),
            new THREE.MeshBasicMaterial(
                {
                    color: this.color,
                    opacity: 0.5
                }));


        this.add(this.buttonMesh);

        console.log(this);
        this.hoverTextYOffset = 40;
    }

    public onIntersectStart():void {
        this.setOpacity(1.0);
        super.onIntersectStart();
    }

    public onIntersectLeave():void {
        this.setOpacity(this.opacityLow);
        super.onIntersectLeave();
    }

    public onClick():void {
        alert("Button Simple clicked.");
    }


}