export declare enum GeometryType {
    MULTI_POLY = "MultiPolygon",
    POLY = "Polygon"
}
export declare enum MapStyle {
    DARK = "Dark",
    LIGHT = "Light"
}
export declare enum ButtonType {
    ZOOM_IN = "Zoom In",
    ZOOM_OUT = "Zoom Out"
}
export interface IViewport {
    width?: number;
    height?: number;
    latitude: number;
    longitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
    transitionInterpolator?: any;
    transitionDuration?: number;
}
export interface IPointInfo {
    color: string;
    object: any;
    x: number;
    y: number;
    layer: any;
}
export interface Padding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export declare type PanHandler = (viewport: IViewport, userAction?: boolean) => void;
