import cx from "classnames";
import DeckGL from "deck.gl";
import {Position} from "geojson";
import isEqual from "lodash-es/isEqual";
import React from "react";
import ReactMapGL, {FlyToInterpolator} from "react-map-gl";
import * as Mercator from "viewport-mercator-project";
import * as styles from "./styles.scss";
import {
  GeometryType,
  MapStyle,
  IViewport,
  ButtonType,
  PanHandler,
  IPointInfo,
  Padding,
} from "../lib/types";

// TODO: Use real implementation of the MapButton
const MapButton: React.FC<any> = () => {
  return null;
  // return <span>button</span>;
};

/* Types
-------------------------------------------------------------------------*/

export interface ICoordinatesExtents {
  maxLng: number;
  maxLat: number;
  minLat: number;
}

/* Constants
-------------------------------------------------------------------------*/

export const StylesByMapStyle = {
  [MapStyle.DARK]: "mapbox://styles/ugwigr/cjbcmizfk7c4z2rmyniglt8f6",
  [MapStyle.LIGHT]: "mapbox://styles/ugwigr/cjbcmn6gy7bse2so1p7b4jccq",
};

/* Template
-------------------------------------------------------------------------*/

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
  tooltip:
    | {
        x: number;
        y: number;
        content: string;
      }
    | undefined;
}

export class MapCore extends React.Component<IMapProps, IMapState> {
  public state: IMapState = {
    tooltip: undefined,
  };

  private deck: any;
  public mapCanvas: any = null;
  private overlayCanvas: any = null;

  public componentDidUpdate(prevProps: IMapProps) {
    const {fitBounds, fitBoundsPadding, width, height, viewport} = this.props;

    const defaultPadding = 30;
    const padding: Padding = {
      top: defaultPadding,
      right: defaultPadding,
      bottom: defaultPadding,
      left: defaultPadding,
    };

    if (fitBoundsPadding) {
      const {top, right, bottom, left} = fitBoundsPadding;
      padding.top = top !== undefined ? top : padding.top;
      padding.right = right !== undefined ? right : padding.right;
      padding.bottom = bottom !== undefined ? bottom : padding.bottom;
      padding.left = left !== undefined ? left : padding.left;
    }

    if (
      fitBounds &&
      (!isEqual(fitBounds, prevProps.fitBounds) ||
        width !== prevProps.width ||
        height !== prevProps.height)
    ) {
      const fittedBounds = Mercator.fitBounds({
        bounds: fitBounds,
        height,
        padding,
        width,
      });

      if (fittedBounds.zoom < 0) {
        fittedBounds.zoom = 0;
      }

      if (fittedBounds.zoom > 12) {
        fittedBounds.zoom = 12;
      }

      const {latitude, longitude, zoom} = Mercator.normalizeViewportProps({
        ...fittedBounds,
        width,
        height,
      });
      this.props.onViewportChange({
        ...viewport,
        latitude,
        longitude,
        zoom,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 500,
      });
    }
  }

  public render() {
    const {
      viewport,
      width,
      height,
      onViewportChange,
      layers,
      style,
      buttons,
      onPointHover,
      onOverlayHover,
      onClick,
      onMapClick,
      children,
      isDoubleClickDisabled,
      isEmbedded,
    } = this.props;
    const {tooltip} = this.state;
    const mapStyle = StylesByMapStyle[style];

    return (
      <>
        <ReactMapGL
          mapboxApiAccessToken={"pk.eyJ1IjoidWd3aWdyIiwiYSI6Ik8tRERDbEkifQ.HXbQmU5i9bYU7c5HHVVxyA"}
          mapStyle={mapStyle}
          preserveDrawingBuffer={true}
          {...viewport}
          ref={this.handleUpdateMapRef}
          width={width}
          height={height}
          doubleClickZoom={isDoubleClickDisabled ? false : true}
          onViewportChange={(info: any) => {
            onPointHover(undefined);
            onOverlayHover(undefined);
            onClick(undefined);
            onViewportChange(info);
          }}
          onClick={(ev: any) => {
            if (onMapClick) {
              onMapClick(ev.lngLat, [ev.offsetCenter.x, ev.offsetCenter.y]);
            }
          }}
          attributionControl={false}
        >
          <DeckGL
            viewState={viewport}
            ref={this.handleUpdateDeckRef}
            width={width}
            height={height}
            layers={layers}
            onHover={this.onLayerHover}
            onClick={this.onLayerClick}
            pickingRadius={5}
          />

          {children}

          {tooltip ? (
            <div className={styles.tooltip} style={{top: tooltip.y, left: tooltip.x}}>
              {tooltip.content}
            </div>
          ) : null}
        </ReactMapGL>

        {buttons.length > 0 && (
          <div
            className={cx(styles.buttons, {
              [styles.embedded]: isEmbedded,
            })}
          >
            {buttons.map((group, i) => (
              <div className={styles.group} key={i}>
                {group.map((button, j) => (
                  <MapButton key={j} button={button} onClick={this.handleButtonOnClick} />
                ))}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  private handleButtonOnClick = (button: ButtonType) => {
    if (button === ButtonType.ZOOM_IN) {
      this.props.onZoomIn();
    } else if (button === ButtonType.ZOOM_OUT) {
      this.props.onZoomOut();
    }
  };

  public getMergedCanvas() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = this.mapCanvas.width;
    canvas.height = this.mapCanvas.height;
    context.drawImage(this.mapCanvas, 0, 0);
    context.drawImage(this.overlayCanvas, 0, 0);

    return canvas;
  }

  private handleUpdateMapRef = (ref: any) => {
    this.mapCanvas = ref ? ref.getMap()._canvas : undefined;
  };

  private handleUpdateDeckRef = (ref: any) => {
    if (ref) {
      this.deck = ref.deck;
      this.overlayCanvas = ref.deckCanvas;
      this.overlayCanvas.getContext("webgl", {
        preserveDrawingBuffer: true,
      });
    } else {
      this.overlayCanvas = undefined;
    }
  };

  private onLayerHover = (info: any) => {
    const {onPointHover, onOverlayHover} = this.props;

    if (info && info.object && info.object.id) {
      const pointInfo = this.createPointInfo(info);
      onPointHover(pointInfo);
    } else if (info && info.object && info.object.type === "Feature" && info.object.properties) {
      onPointHover(undefined);
      onOverlayHover(info);
    } else {
      onPointHover(undefined);
      onOverlayHover(undefined);
    }
  };

  private onLayerClick = (info: any) => {
    const pointInfo = this.createPointInfo(info);
    this.props.onClick(pointInfo);
  };

  private createPointInfo = (info: any): IPointInfo | undefined => {
    if (!info) {
      return undefined;
    }

    const viewport = this.deck.layerManager.viewports[0];
    const {object, layer} = info;
    const rgbColor = layer.props.getColor && layer.props.getColor(object);
    const color = rgbColor && convertRgbToHex(rgbColor);

    const position = getItemPosition(info);
    if (!position) {
      return undefined;
    }

    const pixels = position && viewport.project(position);

    return {
      x: pixels && pixels[0],
      y: pixels && pixels[1],
      color,
      object,
      layer,
    };
  };
}

function getItemPosition(info: any) {
  const objectPosition = info.object.position;
  if (objectPosition) {
    return objectPosition;
  }

  return getMultipolygonClickPosition(info);
}

function getMultipolygonClickPosition(info: any) {
  const geometry = info.object.geometry;
  if (!geometry) {
    return undefined;
  }

  const type = geometry.type;
  if (type !== GeometryType.MULTI_POLY) {
    return undefined;
  }

  const coordinates: any[] = info.object.geometry.coordinates;
  const coordinatesExtent = getCoordinatesExtents(coordinates);

  const middleLat = (coordinatesExtent.maxLat + coordinatesExtent.minLat) / 2;
  return [coordinatesExtent.maxLng, middleLat];
}

function getCoordinatesExtents(array: any[]): ICoordinatesExtents {
  return array.reduce(
    (result, coords) => {
      const itemTest = coords[0];
      if (Array.isArray(itemTest)) {
        // Recursive call again
        const subExtent = getCoordinatesExtents(coords);

        const newResult: ICoordinatesExtents = {
          maxLng: Math.max(subExtent.maxLng, result.maxLng),
          maxLat: Math.max(subExtent.maxLat, result.maxLat),
          minLat: Math.min(subExtent.minLat, result.minLat),
        };
        return newResult;
      } else {
        // Leaf coordintes - no more recursion
        const lng: number = coords[0];
        const lat: number = coords[1];

        const newResult: ICoordinatesExtents = {
          maxLng: Math.max(lng, result.maxLng),
          maxLat: Math.max(lat, result.maxLat),
          minLat: Math.min(lat, result.minLat),
        };
        return newResult;
      }
    },
    {
      maxLng: Number.NEGATIVE_INFINITY,
      maxLat: Number.NEGATIVE_INFINITY,
      minLat: Number.POSITIVE_INFINITY,
    },
  );
}

function convertNumberToHex(c: number) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function convertRgbToHex(color: [number, number, number]) {
  return (
    "#" + convertNumberToHex(color[0]) + convertNumberToHex(color[1]) + convertNumberToHex(color[2])
  );
}
