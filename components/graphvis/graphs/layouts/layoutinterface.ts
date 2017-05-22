/**
 * Implementation Interface for Layouts
 */
export interface LayoutInterface {

    setInitPositions(onFinish):void;
    calculateLayout(onFinish):void;
    reCalculateLayout(onFinish):void;
}