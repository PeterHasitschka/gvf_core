import {Injectable} from "@angular/core";
import {Plane} from "../components/plane/plane";
import {NodeAbstract} from "../components/graphvis/graphs/nodes/nodeelementabstract";
@Injectable()


export class AnimationService {

    static instance:AnimationService;
    static isCreating:Boolean = false;

    private calcExponential = false;

    private animations = {};
    private numAnimations = 0;

    private maxIterations = null;
    private currIteartions = 0;


    constructor() {
        if (!AnimationService.isCreating) {
            return AnimationService.getInstance();
        }
    }

    static getInstance() {
        if (AnimationService.instance == null) {
            AnimationService.isCreating = true;
            AnimationService.instance = new AnimationService();
            AnimationService.instance.startAnimations();
            AnimationService.isCreating = false;
        }
        return AnimationService.instance;
    }

    private startAnimations() {
        if (this.maxIterations !== null && (this.currIteartions > this.maxIterations))
            return;
        this.currIteartions++;

        if (this.numAnimations > 0)
            this.animate();
        window.requestAnimationFrame(this.startAnimations.bind(this));
    }

    /**
     *
     * Register an animation that will be performed automatically.
     *
     * @param {string} identifier String to identify same animation if already exists
     * @param {float} goal Goal value
     * @param {object | null} object Object to perform getter and setter. If not null it will be the FIRST PARAM of getter and setter.
     * @param {function} getter_fct Function to get the current value
     * @param {function} setter_fct Function to set the new value
     * @param {integer} setter_fct_param_num Number of parameter to use. Starts with 0. Others are set to null. If Obj is set it will be prepended
     * @param {float} factor for Speed
     * @param {float} pow Exponent for calculating speed
     * @param {float} threshold Threshold > 0 when animation stops
     * @param {type} callback_fct Function to call after finishing animation
     * @param {boolean} add_to_current If true, not the delta but the value added to current will be set
     */
    public register(identifier:string, goal, object, getter_fct:Function, setter_fct:Function,
                    setter_fct_param_num:number, factor:number, pow:number, threshold:number, callback_fct:Function, add_to_current:boolean, plane:Plane) {

        //Check if already exists. If is so, remove old from list
        this.unregister(identifier);

        if (!add_to_current)
            add_to_current = false;

        if (setter_fct_param_num === null) {
            setter_fct_param_num = 1;
        }

        if (!callback_fct)
            callback_fct = function () {
            };

        var anim_obj = {
            identifier: identifier,
            goal: goal,
            max_diff: null, //Will be set at first animation call
            object: object,
            getter_fct: getter_fct,
            setter_fct: setter_fct,
            setter_fct_param_num: setter_fct_param_num,
            factor: factor,
            pow: pow,
            threshold: threshold,
            callback_fct: callback_fct,
            add_to_current: add_to_current,
            iterations: 0,   //For testing,
            plane: plane
        };

        let animExisted = (typeof this.animations[identifier] !== "undefined" && this.animations[identifier] !== null);
        this.animations[identifier] = anim_obj;
        if (!animExisted)
            this.numAnimations++;
    };


    public animate() {
        let planesToRender = {};

        for (var id in this.animations) {
            var curr_anim = this.animations[id];
            if (!curr_anim)
                continue;

            var curr_val = curr_anim.getter_fct(curr_anim.object);

            if (curr_anim.max_diff === null)
                curr_anim.max_diff = this.animMultiVarOperations.sub(curr_anim.goal, curr_val);

            var delta;
            if (this.calcExponential) {
                delta = this.getStepByExpSlowdown(curr_val,
                    curr_anim.goal,
                    curr_anim.max_diff,
                    curr_anim.factor,
                    curr_anim.pow,
                    curr_anim.threshold
                );
            } else {
                let speed = curr_anim.factor * 10;
                let steps = Math.max(100 / speed, 1);
                delta = this.animMultiVarOperations.div(curr_anim.max_diff, steps);
                if (curr_anim.iterations === steps) {
                    delta = this.animMultiVarOperations.sub(curr_val, curr_val);
                }
            }

            if (this.animMultiVarOperations.length(delta) !== 0.0) {
                var val_to_set = delta;
                if (curr_anim.add_to_current)
                    val_to_set = this.animMultiVarOperations.add(curr_val, delta);
            }
            else {
                //Set value to the final difference
                val_to_set = this.animMultiVarOperations.sub(curr_anim.goal, curr_val);

                //If absolute values -> Set to goal
                if (curr_anim.add_to_current)
                    val_to_set = curr_anim.goal;
            }

            //Build parameter array for setter function
            var params_for_setting = [];

            if (curr_anim.object)
                params_for_setting.push(curr_anim.object);

            for (var param_count = 0; param_count < curr_anim.setter_fct_param_num; param_count++)
                params_for_setting.push(null);
            params_for_setting.push(val_to_set);

            //Call setter fct
            curr_anim.setter_fct.apply(null, params_for_setting);

            //Animation ready
            if (this.animMultiVarOperations.length(delta) === 0.0) {
                //console.log("Animation", "Animation '"  curr_anim.identifier + "' ready", 7);

                this.unregister(curr_anim.identifier);
                curr_anim.callback_fct();
                continue;
            }

            curr_anim.iterations++;

            if (typeof planesToRender[curr_anim.plane.getId()] === "undefined")
                planesToRender[curr_anim.plane.getId()] = curr_anim.plane;
        }

        for (let planeId in planesToRender) {
            planesToRender[planeId].getGraphScene().render();
        }
    }


    private getStepByExpSlowdown(curr, goal, max_diff, factor, pow, threshold) {

        if (typeof curr !== 'object')
            curr = parseFloat(curr);
        if (typeof goal !== 'object')
            goal = parseFloat(goal);
        if (typeof max_diff !== 'object')
            max_diff = parseFloat(max_diff);

        var diff = this.animMultiVarOperations.sub(goal, curr);


        var max_val = this.animMultiVarOperations.gt(curr, goal) ? curr : goal;
        var min_val = this.animMultiVarOperations.gt(goal, curr) ? curr : goal;

        var abs_diff = this.animMultiVarOperations.sub(max_val, min_val);

        if (this.animMultiVarOperations.length(abs_diff) > threshold) {

            //Normalize to a small value
            var normalized_diff = this.animMultiVarOperations.length(diff) / this.animMultiVarOperations.length(max_diff);

            var power = Math.pow(Math.abs(normalized_diff), pow);
            power /= 2;

            //console.log("Animation", [max_diff, diff, normalized_diff, pow, power, factor], 8);

            return this.animMultiVarOperations.mult(power * factor, diff);
        }
        else {
            //return 0.0;
            //Same as 0.0 but with still existing object
            return this.animMultiVarOperations.sub(curr, curr);
        }

    };


    public finishAllAnimations() {
        while (this.numAnimations > 0) {
            for (var id in this.animations) {
                let curr_anim = this.animations[id];
                if (!curr_anim)
                    return;
                this.finish(curr_anim);
            }
        }
        // Reset
        this.animations = {};
        this.numAnimations = 0;
    }

    public finishAnimation(identifier) {
        var canceled = false;
        for (var id in this.animations) {
            let curr_anim = this.animations[id];
            if (!curr_anim)
                return;
            if (canceled)
                return;
            if (curr_anim.identifier === identifier) {
                this.finish(curr_anim);
                canceled = true;
            }
        }
    }

    /**
     * Finish a specific animation by object
     * @param {object} animation
     */
    private finish(animation) {
        var params_for_setting = [];
        if (animation.object)
            params_for_setting.push(animation.object);

        var val = animation.goal;
        if (!animation.add_to_current) {
            val -= animation.getter_fct(animation.object);
        }
        for (var param_count = 0; param_count < animation.setter_fct_param_num; param_count++)
            params_for_setting.push(null);

        params_for_setting.push(val);

        animation.setter_fct.apply(null, params_for_setting);
        this.unregister(animation.identifier);
        return;
    };


    public unregister(identifier) {
        let animExists = (typeof this.animations[identifier] !== "undefined" && this.animations[identifier] !== null);
        if (!animExists)
            return;

        this.animations[identifier] = null;
        this.numAnimations--;

        if (this.numAnimations === 0)
            this.animations = {};
    }


    public collapseNodes(nodes:NodeAbstract[], plane:Plane, pos, callback:Function, saveOrigPos = true):void {
        let movementsToFinish = nodes.length;
        nodes.forEach((n:NodeAbstract) => {
            n.hideLabel();
            n.setLabelZoomAdjustmentBlocked(true);
            if (saveOrigPos)
                n.saveOrigPosition();
            this.register(
                "nodepos_" + n.getUniqueId(),
                {'x': pos.x, 'y': pos.y},
                null,
                n.getPosition2DForAnimation.bind(n),
                n.setPosition2DForAnimation.bind(n),
                0,
                1,
                0.00001,
                0.1,
                function () {
                    movementsToFinish--;
                    if (movementsToFinish === 0) {
                        if (callback)
                            callback();
                    }
                }.bind(this),
                true,
                plane
            );
        });
    }


    public restoreNodeOriginalPositions(nodes:NodeAbstract[], plane:Plane, callback:Function):void {
        let movementsToFinish = nodes.length;
        nodes.forEach((n:NodeAbstract) => {

            // May be deleted due to existance in other metanode
            if (n === null)
                return;

            n.setLabelZoomAdjustmentBlocked(false);

            this.register(
                "nodepos_" + n.getUniqueId(),
                {'x': n.getOrigPosition().x, 'y': n.getOrigPosition().y},
                null,
                n.getPosition2DForAnimation.bind(n),
                n.setPosition2DForAnimation.bind(n),
                0,
                0.5,
                0.001,
                1,
                function () {
                    movementsToFinish--;
                    // console.log("MOVEMENTS TO BE FINSHED", movementsToFinish);
                    if (movementsToFinish === 0) {
                        if (callback)
                            callback();
                    }
                },
                true,
                plane
            );
        });
    }

    public getAnimationCount() {
        return this.numAnimations;
    }


    public animMultiVarOperations = {
        add: function (a, b) {

            if (typeof a !== 'object' && typeof b !== 'object')
                return a + b;
            var c = {};
            for (var k in a) {
                c[k] = a[k] + b[k];
            }

            return c;
        },
        sub: function (a, b) {

            if (typeof a !== 'object' && typeof b !== 'object')
                return a - b;
            var c = {};
            for (var k in a) {
                c[k] = a[k] - b[k];
            }

            return c;
        },
        mult: function (a, b) {

            if (typeof a !== 'object' && typeof b !== 'object')
                return a * b;
            var c = {};

            if (typeof a !== 'object')
                for (var k in b) {
                    c[k] = a * b[k];
                }
            else if (typeof b !== 'object')
                for (var k in a) {
                    c[k] = a[k] * b;
                }
            else
                for (var k in a) {
                    c[k] = a[k] * b[k];
                }
            return c;
        },
        div: function (a, b) {
            if (typeof a !== 'object' && typeof b !== 'object')
                return a / b;
            var c = {};
            if (typeof a !== 'object')
                for (var k in b) {
                    c[k] = a / b[k];
                }
            else if (typeof b !== 'object')
                for (var k in a) {
                    c[k] = a[k] / b;
                }
            else
                for (var k in a) {
                    c[k] = a[k] / b[k];
                }

            return c;
        },
        length: function (a) {

            if (typeof a !== 'object')
                return a;
            var c = 0;
            for (var k in a) {
                c += Math.pow(a[k], 2);
            }
            return Math.sqrt(c);
        },
        gt: function (a, b) {
            if (typeof a !== 'object' && typeof b !== 'object')
                return a > b;

            return this.length(a) > this.length(b);
        }
    };
}