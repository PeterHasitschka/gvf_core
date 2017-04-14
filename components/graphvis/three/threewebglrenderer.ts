import WebGLRendererParameters = THREE.WebGLRendererParameters;
import Scene = THREE.Scene;
import Camera = THREE.Camera;
import RenderTarget = THREE.RenderTarget;
import {GraphVisConfig} from "../config";
export class ThreeWebGlRendererMoving extends THREE.WebGLRenderer {

    protected tic = 500;
    protected numrenderings = 0;
    protected lastAvgPerSecond = 0;

    /**
     * This inheritance just exists for debugging the renderings
     * @param parameters
     */
    constructor(parameters?:WebGLRendererParameters) {
        super(parameters);

        if (GraphVisConfig.scene.debug.intervalledRenderStatistics)
            this.resetNumRenders();
        /*
         Common inheritance does not work, since the render method of the parent might be set after creating
         the constructor. Thus we just swap them around...
         */
        this['renderParent'] = this.render;
        this.render = this._render;
    }

    private resetNumRenders() {
        this.lastAvgPerSecond = this.numrenderings * (1000 / this.tic);
        this.numrenderings = 0;
        window.setTimeout(this.resetNumRenders.bind(this), this.tic);
    }

    public getNumRenderingsAvgPerSecond():number {
        return this.lastAvgPerSecond;
    }

    /*
     The render method which now is called on render().
     To call super.render() we call the original method...
     Nice hack... I know...
     */
    public _render(scene:Scene, camera:Camera, renderTarget?:RenderTarget, forceClear?:boolean) {
        this['renderParent'](scene, camera, renderTarget, forceClear);
        if (GraphVisConfig.scene.debug.intervalledRenderStatistics)
            this.numrenderings++;
    }
}