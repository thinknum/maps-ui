import { quantile } from 'd3-array';
import cx from 'classnames';
import DeckGL from 'deck.gl';
export { default as DeckGL, GeoJsonLayer, IconLayer, ScatterplotLayer, WebMercatorViewport } from 'deck.gl';
import isEqual from 'lodash-es/isEqual';
import React from 'react';
import ReactMapGL, { FlyToInterpolator } from 'react-map-gl';
export { InteractiveMap, default as ReactMapGL, StaticMap } from 'react-map-gl';
import { fitBounds, normalizeViewportProps } from 'viewport-mercator-project';
import * as Mercator from 'viewport-mercator-project';
export { Mercator };
import { SizeMe } from 'react-sizeme';

// Enums
// --------------------------------------------------------
var GeometryType;
(function (GeometryType) {
    GeometryType["MULTI_POLY"] = "MultiPolygon";
    GeometryType["POLY"] = "Polygon";
})(GeometryType || (GeometryType = {}));
var MapStyle;
(function (MapStyle) {
    MapStyle["DARK"] = "Dark";
    MapStyle["LIGHT"] = "Light";
})(MapStyle || (MapStyle = {}));
var ButtonType;
(function (ButtonType) {
    ButtonType["ZOOM_IN"] = "Zoom In";
    ButtonType["ZOOM_OUT"] = "Zoom Out";
})(ButtonType || (ButtonType = {}));

function smartFindBounds(coordinates) {
    var withoutOutliers = pointsWithoutOutliers(coordinates);
    return getCoordinatesCorners(withoutOutliers);
}
function getCoordinatesCorners(coordinates) {
    var left = undefined;
    var top = undefined;
    var right = undefined;
    var bottom = undefined;
    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
        var _a = coordinates_1[_i], lng = _a[0], lat = _a[1];
        if (!left || lat < left) {
            left = lat;
        }
        if (!right || lat > right) {
            right = lat;
        }
        if (!bottom || lng < bottom) {
            bottom = lng;
        }
        if (!top || lng > top) {
            top = lng;
        }
    }
    return [[top, left], [bottom, right]];
}
var pointsWithoutOutliers = function (points) {
    if (points.length === 0) {
        return points;
    }
    var sampleSize = 10000; // Look at 10,000 points when calculating the size
    var step = Math.max(1, Math.round(points.length / sampleSize));
    var pointsSample = points.filter(function (_, i) {
        return i % step === 0;
    });
    var xs = pointsSample.map(function (point) { return point[0]; });
    var xFences = findFencesForOutliers(xs);
    var ys = pointsSample.map(function (point) { return point[1]; });
    var yFences = findFencesForOutliers(ys);
    var result = points.filter(function (point) {
        return point[0] >= xFences.lower &&
            point[0] <= xFences.upper &&
            point[1] >= yFences.lower &&
            point[1] <= yFences.upper;
    });
    return result;
};
var findFencesForOutliers = function (numbers) {
    numbers.sort(function (a, b) { return a - b; });
    var q1 = quantile(numbers, 0.25);
    var q3 = quantile(numbers, 0.75);
    var range = Math.abs(q3 - q1) * 3;
    var lower = q1 - range;
    var upper = q3 + range;
    return { lower: lower, upper: upper };
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var MapContainer = "styles_MapContainer__svuYM";
var tooltip = "styles_tooltip__1MlWX";
var buttons = "styles_buttons__C-09c";
var embedded = "styles_embedded__2Udgw";
var group = "styles_group__1mM-j";
var button = "styles_button__2SGve";
var MapButton = "styles_MapButton__3Rnhe";
var zoomIn = "styles_zoomIn__3CqqR";
var zoomOut = "styles_zoomOut__1uTQ-";
var css = ".styles_MapContainer__svuYM {\n  width: 100%;\n  height: 100%;\n  min-width: 320px;\n  min-height: 180px; }\n\n.styles_tooltip__1MlWX {\n  background: rgba(0, 0, 0, 0.8);\n  padding: 5px 8px;\n  border-radius: 4px;\n  color: #fff;\n  position: absolute; }\n\n.styles_buttons__C-09c {\n  position: absolute;\n  bottom: 10px;\n  right: 44px;\n  display: flex; }\n  .styles_buttons__C-09c.styles_embedded__2Udgw {\n    right: 0px; }\n  .styles_buttons__C-09c .styles_group__1mM-j {\n    box-sizing: border-box;\n    overflow: hidden;\n    margin-right: 10px;\n    display: inline-block;\n    box-shadow: 0px 4px 10px 0px rgba(17, 37, 59, 0.08);\n    border-radius: 4px; }\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_button__2SGve:first-child {\n      border-radius: 4px 0 0 4px; }\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_button__2SGve:last-child {\n      border-radius: 0 4px 4px 0; }\n    .styles_buttons__C-09c .styles_group__1mM-j:last-child {\n      margin-bottom: 0; }\n\n.styles_MapButton__3Rnhe {\n  background: white;\n  width: 34px;\n  height: 32px;\n  padding: 0;\n  box-sizing: border-box;\n  display: inline-block;\n  position: relative;\n  border: none; }\n  .styles_MapButton__3Rnhe:active {\n    background: #f8f8f8; }\n  .styles_MapButton__3Rnhe:focus {\n    outline: 0; }\n  .styles_MapButton__3Rnhe i {\n    margin-right: 0 !important; }\n  .styles_MapButton__3Rnhe:hover i svg path {\n    fill: #000; }\n  .styles_MapButton__3Rnhe.styles_zoomIn__3CqqR {\n    border-right: 1px solid #eef7fc; }\n  .styles_MapButton__3Rnhe.styles_zoomOut__1uTQ- i svg {\n    padding-bottom: 4px; }\n\na.mapboxgl-ctrl-logo {\n  display: none !important; }\n";
styleInject(css);

var ZoomIn = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\"><path fill-rule=\"evenodd\" fill=\"#778FA9\" d=\"M9 6H6v3a1 1 0 0 1-2 0V6H1a1 1 0 0 1 0-2h3V1a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z\"/></svg>";

var ZoomOut = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"9\" height=\"2\"><path fill-rule=\"evenodd\" fill=\"#778FA9\" d=\"M1 0h7a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2z\"/></svg>";

var _a, _b;
var stylesByButton = (_a = {},
    _a[ButtonType.ZOOM_IN] = zoomIn,
    _a[ButtonType.ZOOM_OUT] = zoomOut,
    _a);
var icons = (_b = {},
    _b[ButtonType.ZOOM_IN] = ZoomIn,
    _b[ButtonType.ZOOM_OUT] = ZoomOut,
    _b);
var Icon = function (props) {
    return React.createElement("i", { dangerouslySetInnerHTML: { __html: props.svg } });
};
var MapButton$1 = function (props) {
    return (React.createElement("button", { className: cx(MapButton, props.className, stylesByButton[props.button]), onClick: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            props.onClick(props.button);
        } },
        React.createElement(Icon, { svg: icons[props.button] })));
};

var _a$1;
/* Constants
-------------------------------------------------------------------------*/
var StylesByMapStyle = (_a$1 = {},
    _a$1[MapStyle.DARK] = "mapbox://styles/ugwigr/cjbcmizfk7c4z2rmyniglt8f6",
    _a$1[MapStyle.LIGHT] = "mapbox://styles/ugwigr/cjbcmn6gy7bse2so1p7b4jccq",
    _a$1);
var MapCore = /** @class */ (function (_super) {
    __extends(MapCore, _super);
    function MapCore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            tooltip: undefined,
        };
        _this.mapCanvas = null;
        _this.overlayCanvas = null;
        _this.handleButtonOnClick = function (button) {
            if (button === ButtonType.ZOOM_IN) {
                _this.props.onZoomIn();
            }
            else if (button === ButtonType.ZOOM_OUT) {
                _this.props.onZoomOut();
            }
        };
        _this.handleUpdateMapRef = function (ref) {
            _this.mapCanvas = ref ? ref.getMap()._canvas : undefined;
        };
        _this.handleUpdateDeckRef = function (ref) {
            if (ref) {
                _this.deck = ref.deck;
                _this.overlayCanvas = ref.deckCanvas;
                _this.overlayCanvas.getContext("webgl", {
                    preserveDrawingBuffer: true,
                });
            }
            else {
                _this.overlayCanvas = undefined;
            }
        };
        _this.onLayerHover = function (info) {
            var _a = _this.props, onPointHover = _a.onPointHover, onOverlayHover = _a.onOverlayHover;
            if (info && info.object && info.object.id) {
                var pointInfo = _this.createPointInfo(info);
                onPointHover(pointInfo);
            }
            else if (info && info.object && info.object.type === "Feature" && info.object.properties) {
                onPointHover(undefined);
                onOverlayHover(info);
            }
            else {
                onPointHover(undefined);
                onOverlayHover(undefined);
            }
        };
        _this.onLayerClick = function (info) {
            var pointInfo = _this.createPointInfo(info);
            _this.props.onClick(pointInfo);
        };
        _this.createPointInfo = function (info) {
            if (!info || !info.layer) {
                return undefined;
            }
            var viewports = _this.deck.viewManager.getViewports();
            var defaultViewport = viewports[0];
            if (!defaultViewport) {
                console.warn("cannot get viewport from deck.gl");
                return undefined;
            }
            var object = info.object, layer = info.layer;
            var rgbColor = layer.props.getColor && layer.props.getColor(object);
            var color = rgbColor && convertRgbToHex(rgbColor);
            var position = getItemPosition(info);
            if (!position) {
                return undefined;
            }
            var pixels = position && defaultViewport.project(position);
            return {
                x: pixels && pixels[0],
                y: pixels && pixels[1],
                color: color,
                object: object,
                layer: layer,
            };
        };
        return _this;
    }
    MapCore.prototype.componentDidMount = function () {
        this.applyFitBounds();
    };
    MapCore.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, fitBounds = _a.fitBounds, width = _a.width, height = _a.height;
        if (fitBounds &&
            (!isEqual(fitBounds, prevProps.fitBounds) ||
                width !== prevProps.width ||
                height !== prevProps.height)) {
            this.applyFitBounds();
        }
    };
    MapCore.prototype.render = function () {
        var _this = this;
        var _a;
        var _b = this.props, viewport = _b.viewport, width = _b.width, height = _b.height, onViewportChange = _b.onViewportChange, layers = _b.layers, style = _b.style, buttons$1 = _b.buttons, onPointHover = _b.onPointHover, onOverlayHover = _b.onOverlayHover, onClick = _b.onClick, onMapClick = _b.onMapClick, children = _b.children, isDoubleClickDisabled = _b.isDoubleClickDisabled, isEmbedded = _b.isEmbedded;
        var tooltip$1 = this.state.tooltip;
        var mapStyle = StylesByMapStyle[style];
        return (React.createElement(React.Fragment, null,
            React.createElement(ReactMapGL, __assign({ mapboxApiAccessToken: "pk.eyJ1IjoidWd3aWdyIiwiYSI6Ik8tRERDbEkifQ.HXbQmU5i9bYU7c5HHVVxyA", mapStyle: mapStyle, preserveDrawingBuffer: true }, viewport, { ref: this.handleUpdateMapRef, width: width, height: height, doubleClickZoom: isDoubleClickDisabled ? false : true, onViewportChange: function (info) {
                    onPointHover(undefined);
                    onOverlayHover(undefined);
                    onClick(undefined);
                    onViewportChange(info);
                }, onClick: function (ev) {
                    if (onMapClick) {
                        onMapClick(ev.lngLat, [ev.offsetCenter.x, ev.offsetCenter.y]);
                    }
                }, attributionControl: false }),
                React.createElement(DeckGL, { viewState: viewport, ref: this.handleUpdateDeckRef, width: width, height: height, layers: layers, onHover: this.onLayerHover, onClick: this.onLayerClick, pickingRadius: 5 }),
                children,
                tooltip$1 ? (React.createElement("div", { className: tooltip, style: { top: tooltip$1.y, left: tooltip$1.x } }, tooltip$1.content)) : null),
            buttons$1.length > 0 && (React.createElement("div", { className: cx(buttons, (_a = {},
                    _a[embedded] = isEmbedded,
                    _a)) }, buttons$1.map(function (group$1, i) { return (React.createElement("div", { className: group, key: i }, group$1.map(function (button$1, j) { return (React.createElement(MapButton$1, { key: j, button: button$1, onClick: _this.handleButtonOnClick, className: button })); }))); })))));
    };
    MapCore.prototype.getPadding = function () {
        var padding = getDefaultPadding();
        var fitBoundsPadding = this.props.fitBoundsPadding;
        if (fitBoundsPadding) {
            var top_1 = fitBoundsPadding.top, right = fitBoundsPadding.right, bottom = fitBoundsPadding.bottom, left = fitBoundsPadding.left;
            padding.top = top_1 !== undefined ? top_1 : padding.top;
            padding.right = right !== undefined ? right : padding.right;
            padding.bottom = bottom !== undefined ? bottom : padding.bottom;
            padding.left = left !== undefined ? left : padding.left;
        }
        return padding;
    };
    MapCore.prototype.applyFitBounds = function () {
        var _a = this.props, fitBounds$1 = _a.fitBounds, width = _a.width, height = _a.height, viewport = _a.viewport, disableTransitions = _a.disableTransitions;
        var padding = this.getPadding();
        if (fitBounds$1 === undefined) {
            return;
        }
        var fittedBounds = fitBounds({
            bounds: fitBounds$1,
            height: height,
            padding: padding,
            width: width,
        });
        if (fittedBounds.zoom < 0) {
            fittedBounds.zoom = 0;
        }
        if (fittedBounds.zoom > 12) {
            fittedBounds.zoom = 12;
        }
        var _b = normalizeViewportProps(__assign({}, fittedBounds, { width: width,
            height: height })), latitude = _b.latitude, longitude = _b.longitude, zoom = _b.zoom;
        var transitionProps = disableTransitions ? {} : {
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 500,
        };
        this.props.onViewportChange(__assign({}, viewport, { latitude: latitude,
            longitude: longitude,
            zoom: zoom }, transitionProps));
    };
    MapCore.prototype.getMergedCanvas = function () {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = this.mapCanvas.width;
        canvas.height = this.mapCanvas.height;
        context.drawImage(this.mapCanvas, 0, 0);
        context.drawImage(this.overlayCanvas, 0, 0);
        return canvas;
    };
    return MapCore;
}(React.Component));
function getDefaultPadding() {
    var defaultPadding = 30;
    return {
        top: defaultPadding,
        right: defaultPadding,
        bottom: defaultPadding,
        left: defaultPadding,
    };
}
function getItemPosition(info) {
    var objectPosition = info.object.position;
    if (objectPosition) {
        return objectPosition;
    }
    return getMultipolygonClickPosition(info);
}
function getMultipolygonClickPosition(info) {
    var geometry = info.object.geometry;
    if (!geometry) {
        return undefined;
    }
    var type = geometry.type;
    if (type !== GeometryType.MULTI_POLY) {
        return undefined;
    }
    var coordinates = info.object.geometry.coordinates;
    var coordinatesExtent = getCoordinatesExtents(coordinates);
    var middleLat = (coordinatesExtent.maxLat + coordinatesExtent.minLat) / 2;
    return [coordinatesExtent.maxLng, middleLat];
}
function getCoordinatesExtents(array) {
    return array.reduce(function (result, coords) {
        var itemTest = coords[0];
        if (Array.isArray(itemTest)) {
            // Recursive call again
            var subExtent = getCoordinatesExtents(coords);
            var newResult = {
                maxLng: Math.max(subExtent.maxLng, result.maxLng),
                maxLat: Math.max(subExtent.maxLat, result.maxLat),
                minLat: Math.min(subExtent.minLat, result.minLat),
            };
            return newResult;
        }
        else {
            // Leaf coordintes - no more recursion
            var lng = coords[0];
            var lat = coords[1];
            var newResult = {
                maxLng: Math.max(lng, result.maxLng),
                maxLat: Math.max(lat, result.maxLat),
                minLat: Math.min(lat, result.minLat),
            };
            return newResult;
        }
    }, {
        maxLng: Number.NEGATIVE_INFINITY,
        maxLat: Number.NEGATIVE_INFINITY,
        minLat: Number.POSITIVE_INFINITY,
    });
}
function convertNumberToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
function convertRgbToHex(color) {
    return ("#" + convertNumberToHex(color[0]) + convertNumberToHex(color[1]) + convertNumberToHex(color[2]));
}

var MapContainer$1 = /** @class */ (function (_super) {
    __extends(MapContainer$1, _super);
    function MapContainer$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            viewport: {
                bearing: 0,
                latitude: 0,
                longitude: 0,
                pitch: 0,
                zoom: 1,
            },
        };
        _this.mapRef = React.createRef();
        _this.handleZoomOutOnClick = function () {
            var viewport = _this.props.viewport || _this.state.viewport;
            var updatedViewport = __assign({}, viewport, { zoom: viewport.zoom - 1 > 0 ? viewport.zoom - 1 : viewport.zoom });
            if (_this.props.viewport && _this.props.onViewportChange) {
                _this.props.onViewportChange(updatedViewport);
            }
            else {
                _this.setState({
                    viewport: updatedViewport,
                });
            }
        };
        _this.handleZoomInOnClick = function () {
            var viewport = _this.props.viewport || _this.state.viewport;
            var updatedViewport = __assign({}, viewport, { zoom: viewport.zoom + 1 < 20 ? viewport.zoom + 1 : viewport.zoom });
            if (_this.props.viewport && _this.props.onViewportChange) {
                _this.props.onViewportChange(updatedViewport);
            }
            else {
                _this.setState({
                    viewport: updatedViewport,
                });
            }
        };
        _this.onViewportChange = function (viewport) {
            _this.setState({ viewport: viewport });
            if (_this.props.onViewportChange) {
                _this.props.onViewportChange(viewport);
            }
        };
        return _this;
    }
    MapContainer$1.prototype.render = function () {
        var _this = this;
        var _a = this.props, layers = _a.layers, style = _a.style, fitBounds = _a.fitBounds, onClick = _a.onClick, onMapClick = _a.onMapClick, onPointHover = _a.onPointHover, onOverlayHover = _a.onOverlayHover, children = _a.children, isDoubleClickDisabled = _a.isDoubleClickDisabled, isEmbedded = _a.isEmbedded, fitBoundsPadding = _a.fitBoundsPadding, disableTransitions = _a.disableTransitions;
        var wantsZoomButtons = this.props.wantsZoomButtons;
        if (wantsZoomButtons === undefined) {
            wantsZoomButtons = true;
        }
        return (React.createElement(SizeMe, { monitorHeight: true }, function (_a) {
            var size = _a.size;
            var width = size.width, height = size.height;
            return (React.createElement("div", { className: MapContainer },
                React.createElement(MapCore, { style: style, viewport: _this.props.viewport || _this.state.viewport, buttons: wantsZoomButtons ? [[ButtonType.ZOOM_IN, ButtonType.ZOOM_OUT]] : [], width: width || 600, height: height || 300, onViewportChange: _this.onViewportChange, onZoomIn: _this.handleZoomInOnClick, onZoomOut: _this.handleZoomOutOnClick, onClick: onClick, onMapClick: onMapClick, onPointHover: onPointHover, onOverlayHover: onOverlayHover, layers: layers, fitBounds: fitBounds, fitBoundsPadding: fitBoundsPadding, ref: _this.mapRef, isDoubleClickDisabled: isDoubleClickDisabled, isEmbedded: isEmbedded, disableTransitions: disableTransitions }, children)));
        }));
    };
    MapContainer$1.prototype.getMapCanvas = function () {
        var map = this.mapRef.current;
        if (map) {
            return map.getMergedCanvas();
        }
    };
    MapContainer$1.defaultProps = {
        style: MapStyle.LIGHT,
    };
    return MapContainer$1;
}(React.Component));

export { ButtonType, GeometryType, MapContainer$1 as MapContainer, MapCore, MapStyle, StylesByMapStyle, getCoordinatesCorners, pointsWithoutOutliers, smartFindBounds };
