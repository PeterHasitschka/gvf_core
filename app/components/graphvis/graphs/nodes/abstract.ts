/**
 * Abstract class of a Node for the GraphVis
 * Derived from the @see{THREE.Mesh} class.
 * Thus, it holds a geometry and a material
 * @author Peter Hasitschka
 */
export abstract class NodeAbstract extends THREE.Mesh {

    protected threeMaterial: THREE.Material;
    protected threeGeometry: THREE.Geometry;

    constructor() {
        var geometry = new THREE.CircleGeometry(150, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        super(geometry, material);

        this.threeGeometry = geometry;
        this.threeMaterial = material;
    }
}