// Enums
// --------------------------------------------------------

export enum GeometryType {
  MULTI_POLY = "MultiPolygon",
  POLY = "Polygon",
}

export enum MapStyle {
  DARK = "Dark",
  LIGHT = "Light",
}

export enum ButtonType {
  ZOOM_IN = "Zoom In",
  ZOOM_OUT = "Zoom Out",
}

// Interfaces
// --------------------------------------------------------

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

// Handlers
// --------------------------------------------------------

export type PanHandler = (viewport: IViewport) => void;
