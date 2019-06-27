import { IPointInfo, IViewport, MapStyle, Padding } from "../lib/types";
import { Position } from "geojson";
import React from "react";
interface IMapContainerProps {
    fitBounds?: Position[];
    fitBoundsPadding?: Partial<Padding>;
    viewport?: IViewport;
    layers?: any[];
    style: MapStyle;
    onClick: (info: IPointInfo) => void;
    onMapClick?: (mapPosition: Position, screenPosition: Position) => void;
    onPointHover: (info: IPointInfo) => void;
    onOverlayHover: (info: IPointInfo) => void;
    onViewportChange?: (viewport: IViewport) => void;
    isDoubleClickDisabled?: boolean;
    wantsZoomButtons?: boolean;
    isEmbedded?: boolean;
    disableTransitions?: boolean;
}
interface IMapContainerState {
    viewport: IViewport;
}
export declare class MapContainer extends React.Component<IMapContainerProps, IMapContainerState> {
    static defaultProps: Partial<IMapContainerProps>;
    state: IMapContainerState;
    private mapRef;
    render(): JSX.Element;
    getMapCanvas(): HTMLCanvasElement | undefined;
    private handleZoomOutOnClick;
    private handleZoomInOnClick;
    private onViewportChange;
}
export {};
