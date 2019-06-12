import { Position } from "geojson";
import React from "react";
import { MapStyle, IViewport, ButtonType, PanHandler, IPointInfo, Padding } from "../lib/types";
export interface ICoordinatesExtents {
    maxLng: number;
    maxLat: number;
    minLat: number;
}
export declare const StylesByMapStyle: {
    [MapStyle.DARK]: string;
    [MapStyle.LIGHT]: string;
};
interface IMapProps {
    layers?: any[];
    style: MapStyle;
    viewport: IViewport;
    buttons: ButtonType[][];
    width: number;
    height: number;
    onViewportChange: PanHandler;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onClick: (info: IPointInfo | undefined) => void;
    onMapClick?: (mapPosition: Position, screenPosition: Position) => void;
    onPointHover: (info: IPointInfo | undefined) => void;
    onOverlayHover: (info: IPointInfo | undefined) => void;
    fitBounds?: Position[];
    fitBoundsPadding?: Partial<Padding>;
    isDoubleClickDisabled?: boolean;
    isEmbedded?: boolean;
}
interface IMapState {
    tooltip: {
        x: number;
        y: number;
        content: string;
    } | undefined;
}
export declare class MapCore extends React.Component<IMapProps, IMapState> {
    state: IMapState;
    private deck;
    mapCanvas: any;
    private overlayCanvas;
    componentDidUpdate(prevProps: IMapProps): void;
    render(): JSX.Element;
    private handleButtonOnClick;
    getMergedCanvas(): HTMLCanvasElement;
    private handleUpdateMapRef;
    private handleUpdateDeckRef;
    private onLayerHover;
    private onLayerClick;
    private createPointInfo;
}
export {};
