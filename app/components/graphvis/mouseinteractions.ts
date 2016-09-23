import {GraphScene} from "./scene";
export class MouseInteractions {

    private mouseContainerPos = {x: null, y: null};
    private currentlyIntersected = {};

    constructor(private scene:GraphScene) {
        scene.getContainer().addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    }

    /**
     * Getting intersected objects and compares them with internal list, to decide if some were
     * left or just entered. The corresponding methods on the objects are called.
     */
    public handleIntersections() {
        if (this.mouseContainerPos.x === null || this.mouseContainerPos.y === null)
            return;

        this.scene.getThreeRaycaster().setFromCamera(this.mouseContainerPos, this.scene.getThreeCamera());
        var intersects = this.scene.getThreeRaycaster().intersectObjects(this.scene.getObjectGroup().children);

        //Check for new
        let newIntersected = {};
        intersects.forEach((intersectedObj) => {
            let obj:any = intersectedObj['object'];

            if (typeof obj.onIntersectStart === 'undefined') {
                return;
            }

            let id = obj['uuid'];
            if (typeof this.currentlyIntersected[id] === 'undefined') {
                obj.onIntersectStart();
            }
            newIntersected[id] = obj;
        });

        //Check for old
        for (let oldId in this.currentlyIntersected) {
            let oldIntersectedObj = this.currentlyIntersected[oldId];
            if (typeof newIntersected[oldId] === 'undefined') {
                let obj:any = oldIntersectedObj;
                obj.onIntersectLeave();
            }
        }
        this.currentlyIntersected = newIntersected;
    }

    private onDocumentMouseMove(event) {
        this.mouseContainerPos.x = ( event.offsetX / this.scene.getThreeRenderer().getSize()["width"] ) * 2 - 1;
        this.mouseContainerPos.y = -( event.offsetY / this.scene.getThreeRenderer().getSize()["height"] ) * 2 + 1;
        this.handleIntersections();
    }
}