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
    ZOOM_OUT = "Zoom Out",
    DOWNLOAD = "Download"
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
export declare type PanHandler = (viewport: IViewport) => void;