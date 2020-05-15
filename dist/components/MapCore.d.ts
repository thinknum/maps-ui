import { Position } from "geojson";
import React from "react";
import { MapTheme } from "../lib/Theme";
import { ButtonType, IPointInfo, IViewport, MapStyle, Padding, PanHandler } from "../lib/types";
export interface ICoordinatesExtents {
    maxLng: number;
    maxLat: number;
    minLat: number;
}
export declare function getMapStyles(theme?: MapTheme): MapTheme;
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
    disableTransitions?: boolean;
    initialViewport?: IViewport;
    theme?: MapTheme;
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
    componentDidMount(): void;
    componentDidUpdate(prevProps: IMapProps): void;
    render(): JSX.Element;
    private getPadding;
    private applyFitBounds;
    private applyInitialViewport;
    private handleButtonOnClick;
    getMergedCanvas(): HTMLCanvasElement;
    private handleUpdateMapRef;
    private handleUpdateDeckRef;
    private onLayerHover;
    private onLayerClick;
    private createPointInfo;
}
export {};
