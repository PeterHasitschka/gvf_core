    

    export abstract class NodeAbstract extends THREE.Mesh {

    constructor() {
        var geometry = new THREE.CircleGeometry(5, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        super(geometry, material);
    }
}