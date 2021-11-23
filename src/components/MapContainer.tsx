import { Position } from "geojson";
import React from "react";
import { SizeMe } from "react-sizeme";
import { MapTheme } from "../lib/Theme";
import { Bounds, ButtonType, IPointInfo, IViewport, MapStyle, Padding, PanHandler } from "../lib/types";
import { MapCore } from "./MapCore";
import * as styles from "./styles.scss";

interface IMapContainerProps {
  fitBounds?: Bounds;
  fitBoundsPadding?: Partial<Padding>;
  viewport?: IViewport;
  layers?: any[];
  style: MapStyle;
  theme?: MapTheme;
  onClick: (info: IPointInfo) => void;
  onMapClick?: (mapPosition: Position, screenPosition: Position) => void;
  onPointHover: (info: IPointInfo) => void;
  onOverlayHover: (info: IPointInfo) => void;
  onViewportChange?: PanHandler;
  isDoubleClickDisabled?: boolean;
  wantsZoomButtons?: boolean;
  isEmbedded?: boolean;
  disableTransitions?: boolean;
  initialViewport?: IViewport;
  preserveDrawingBuffer?: boolean;
}

interface IMapContainerState {
  viewport: IViewport;
}

export class MapContainer extends React.Component<IMapContainerProps, IMapContainerState> {
  public static defaultProps: Partial<IMapContainerProps> = {
    style: MapStyle.LIGHT,
  };

  public state: IMapContainerState = {
    viewport: {
      bearing: 0,
      latitude: 0,
      longitude: 0,
      pitch: 0,
      zoom: 1,
    },
  };

  private mapRef: React.RefObject<MapCore> = React.createRef();

  public render() {
    const {
      layers,
      style,
      theme,
      fitBounds,
      onClick,
      onMapClick,
      onPointHover,
      onOverlayHover,
      children,
      isDoubleClickDisabled,
      isEmbedded,
      fitBoundsPadding,
      disableTransitions,
      initialViewport,
    } = this.props;

    let {wantsZoomButtons} = this.props;

    if (wantsZoomButtons === undefined) {
      wantsZoomButtons = true;
    }

    return (
      <SizeMe monitorHeight>
        {({size}) => {
          const {width, height} = size;

          return (
            <div className={styles.MapContainer}>
              <MapCore
                style={style}
                theme={theme}
                viewport={this.props.viewport || this.state.viewport}
                buttons={wantsZoomButtons ? [[ButtonType.ZOOM_IN, ButtonType.ZOOM_OUT]] : []}
                width={width || 600}
                height={height || 300}
                onViewportChange={this.onViewportChange}
                onZoomIn={this.handleZoomInOnClick}
                onZoomOut={this.handleZoomOutOnClick}
                onClick={onClick}
                onMapClick={onMapClick}
                onPointHover={onPointHover}
                onOverlayHover={onOverlayHover}
                layers={layers}
                fitBounds={fitBounds}
                fitBoundsPadding={fitBoundsPadding}
                ref={this.mapRef}
                isDoubleClickDisabled={isDoubleClickDisabled}
                isEmbedded={isEmbedded}
                disableTransitions={disableTransitions}
                initialViewport={initialViewport}
                preserveDrawingBuffer={this.props.preserveDrawingBuffer}
              >
                {children}
              </MapCore>
            </div>
          );
        }}
      </SizeMe>
    );
  }

  public getMapCanvas() {
    const map = this.mapRef.current;
    if (map) {
      return map.getMergedCanvas();
    }
  }

  private handleZoomOutOnClick = () => {
    const viewport = this.props.viewport || this.state.viewport;

    const updatedViewport = {
      ...viewport,
      zoom: viewport.zoom - 1 > 0 ? viewport.zoom - 1 : viewport.zoom,
    };

    if (this.props.viewport && this.props.onViewportChange) {
      this.props.onViewportChange(updatedViewport, true);
    } else {
      this.setState({
        viewport: updatedViewport,
      });
    }
  };

  private handleZoomInOnClick = () => {
    const viewport = this.props.viewport || this.state.viewport;

    const updatedViewport = {
      ...viewport,
      zoom: viewport.zoom + 1 < 20 ? viewport.zoom + 1 : viewport.zoom,
    };

    if (this.props.viewport && this.props.onViewportChange) {
      this.props.onViewportChange(updatedViewport, true);
    } else {
      this.setState({
        viewport: updatedViewport,
      });
    }
  };

  private onViewportChange: PanHandler = (viewport, userAction) => {
    this.setState({viewport});
    if (this.props.onViewportChange) {
      this.props.onViewportChange(viewport, userAction);
    }
  };
}
