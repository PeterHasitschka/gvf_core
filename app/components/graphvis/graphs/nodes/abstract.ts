

export abstract class NodeAbstract extends THREE.Mesh {

    constructor() {
        var geometry = new THREE.CircleGeometry(150, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        super(geometry, material);
    }
}