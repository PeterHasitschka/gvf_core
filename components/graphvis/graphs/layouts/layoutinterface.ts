/**
 * Implementation Interface for Layouts
 */
export interface LayoutInterface {

    setInitPositions(onFinish):void;
    calculateLayout(onFinish, newNodes):void;
    reCalculateLayout(onFinish):void;
}