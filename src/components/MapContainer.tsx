import {ButtonType, IPointInfo, IViewport, MapStyle, PanHandler, Padding} from "../lib/types";
import {Position} from "geojson";
import React from "react";
import * as styles from "./styles.scss";
import {MapCore} from "./MapCore";
import {SizeMe} from "react-sizeme";

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
  onViewportChange: (viewport: IViewport) => void;
  isDoubleClickDisabled?: boolean;
  wantsZoomButtons?: boolean;
  isEmbedded?: boolean;
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
      fitBounds,
      onClick,
      onMapClick,
      onPointHover,
      onOverlayHover,
      children,
      isDoubleClickDisabled,
      isEmbedded,
      fitBoundsPadding,
    } = this.props;

    let {wantsZoomButtons} = this.props;

    if (wantsZoomButtons === undefined) {
      wantsZoomButtons = true;
    }

    return (
      <SizeMe monitorHeight>
        {({size}) => {
          const width = size.width || 200;
          const height = size.height || 150;

          return (
            <div className={styles.MapContainer}>
              <MapCore
                style={style}
                viewport={this.props.viewport || this.state.viewport}
                buttons={wantsZoomButtons ? [[ButtonType.ZOOM_IN, ButtonType.ZOOM_OUT]] : []}
                width={width}
                height={height}
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

    if (this.props.viewport) {
      this.props.onViewportChange(updatedViewport);
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

    if (this.props.viewport) {
      this.props.onViewportChange(updatedViewport);
    } else {
      this.setState({
        viewport: updatedViewport,
      });
    }
  };

  private onViewportChange: PanHandler = (viewport) => {
    this.setState({viewport});
    this.props.onViewportChange(viewport);
  };
}