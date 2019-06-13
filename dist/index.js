'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cx = _interopDefault(require('classnames'));
var DeckGL = require('deck.gl');
var DeckGL__default = _interopDefault(DeckGL);
var isEqual = _interopDefault(require('lodash-es/isEqual'));
var React = _interopDefault(require('react'));
var ReactMapGL = require('react-map-gl');
var ReactMapGL__default = _interopDefault(ReactMapGL);
var Mercator = require('viewport-mercator-project');
var reactSizeme = require('react-sizeme');

// Enums
(function (GeometryType) {
    GeometryType["MULTI_POLY"] = "MultiPolygon";
    GeometryType["POLY"] = "Polygon";
})(exports.GeometryType || (exports.GeometryType = {}));
(function (MapStyle) {
    MapStyle["DARK"] = "Dark";
    MapStyle["LIGHT"] = "Light";
})(exports.MapStyle || (exports.MapStyle = {}));
(function (ButtonType) {
    ButtonType["ZOOM_IN"] = "Zoom In";
    ButtonType["ZOOM_OUT"] = "Zoom Out";
    ButtonType["DOWNLOAD"] = "Download";
})(exports.ButtonType || (exports.ButtonType = {}));

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
var css = ".styles_MapContainer__svuYM {\n  width: 100%;\n  height: 100%;\n  min-width: 320px;\n  min-height: 180px; }\n\n.styles_tooltip__1MlWX {\n  background: rgba(0, 0, 0, 0.8);\n  padding: 5px 8px;\n  border-radius: 4px;\n  color: #fff;\n  position: absolute; }\n\n.styles_buttons__C-09c {\n  position: absolute;\n  bottom: 10px;\n  right: 44px;\n  display: flex; }\n  .styles_buttons__C-09c.styles_embedded__2Udgw {\n    right: 0px; }\n  .styles_buttons__C-09c .styles_group__1mM-j {\n    box-sizing: border-box;\n    overflow: hidden;\n    margin-right: 10px;\n    display: inline-block;\n    box-shadow: 0px 4px 10px 0px rgba(17, 37, 59, 0.08);\n    border-radius: 4px; }\n    .styles_buttons__C-09c .styles_group__1mM-j > *:first-child {\n      border-radius: 4px 0 0 4px; }\n    .styles_buttons__C-09c .styles_group__1mM-j > *:last-child {\n      border-radius: 0 4px 4px 0; }\n    .styles_buttons__C-09c .styles_group__1mM-j:last-child {\n      margin-bottom: 0; }\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_zoomIn__3CqqR {\n      border-right: 1px solid #eef7fc; }\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_zoomOut__1uTQ- i svg {\n      padding-bottom: 4px; }\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_zoomIn__3CqqR i,\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_zoomOut__1uTQ- i {\n      margin-right: 0 !important; }\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_zoomIn__3CqqR:hover i svg path,\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_zoomOut__1uTQ-:hover i svg path {\n      fill: #000; }\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_zoomIn__3CqqR,\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_zoomOut__1uTQ-,\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_download__1lBsI {\n      background: white;\n      width: 34px;\n      height: 32px;\n      padding: 0;\n      box-sizing: border-box;\n      display: inline-block;\n      position: relative; }\n    .styles_buttons__C-09c .styles_group__1mM-j > .styles_download__1lBsI:after {\n      top: 7px;\n      left: 13px; }\n\na.mapboxgl-ctrl-logo {\n  display: none !important; }\n";
styleInject(css);

var _a;
// TODO: Use real implementation of the MapButton
var MapButton = function () {
    return null;
    // return <span>button</span>;
};
/* Constants
-------------------------------------------------------------------------*/
var StylesByMapStyle = (_a = {},
    _a[exports.MapStyle.DARK] = "mapbox://styles/ugwigr/cjbcmizfk7c4z2rmyniglt8f6",
    _a[exports.MapStyle.LIGHT] = "mapbox://styles/ugwigr/cjbcmn6gy7bse2so1p7b4jccq",
    _a);
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
            if (button === exports.ButtonType.ZOOM_IN) {
                _this.props.onZoomIn();
            }
            else if (button === exports.ButtonType.ZOOM_OUT) {
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
            if (!info) {
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
    MapCore.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, fitBounds = _a.fitBounds, fitBoundsPadding = _a.fitBoundsPadding, width = _a.width, height = _a.height, viewport = _a.viewport;
        var defaultPadding = 30;
        var padding = {
            top: defaultPadding,
            right: defaultPadding,
            bottom: defaultPadding,
            left: defaultPadding,
        };
        if (fitBoundsPadding) {
            var top_1 = fitBoundsPadding.top, right = fitBoundsPadding.right, bottom = fitBoundsPadding.bottom, left = fitBoundsPadding.left;
            padding.top = top_1 !== undefined ? top_1 : padding.top;
            padding.right = right !== undefined ? right : padding.right;
            padding.bottom = bottom !== undefined ? bottom : padding.bottom;
            padding.left = left !== undefined ? left : padding.left;
        }
        if (fitBounds &&
            (!isEqual(fitBounds, prevProps.fitBounds) ||
                width !== prevProps.width ||
                height !== prevProps.height)) {
            var fittedBounds = Mercator.fitBounds({
                bounds: fitBounds,
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
            var _b = Mercator.normalizeViewportProps(__assign({}, fittedBounds, { width: width,
                height: height })), latitude = _b.latitude, longitude = _b.longitude, zoom = _b.zoom;
            this.props.onViewportChange(__assign({}, viewport, { latitude: latitude,
                longitude: longitude,
                zoom: zoom, transitionInterpolator: new ReactMapGL.FlyToInterpolator(), transitionDuration: 500 }));
        }
    };
    MapCore.prototype.render = function () {
        var _this = this;
        var _a;
        var _b = this.props, viewport = _b.viewport, width = _b.width, height = _b.height, onViewportChange = _b.onViewportChange, layers = _b.layers, style = _b.style, buttons$1 = _b.buttons, onPointHover = _b.onPointHover, onOverlayHover = _b.onOverlayHover, onClick = _b.onClick, onMapClick = _b.onMapClick, children = _b.children, isDoubleClickDisabled = _b.isDoubleClickDisabled, isEmbedded = _b.isEmbedded;
        var tooltip$1 = this.state.tooltip;
        var mapStyle = StylesByMapStyle[style];
        return (React.createElement(React.Fragment, null,
            React.createElement(ReactMapGL__default, __assign({ mapboxApiAccessToken: "pk.eyJ1IjoidWd3aWdyIiwiYSI6Ik8tRERDbEkifQ.HXbQmU5i9bYU7c5HHVVxyA", mapStyle: mapStyle, preserveDrawingBuffer: true }, viewport, { ref: this.handleUpdateMapRef, width: width, height: height, doubleClickZoom: isDoubleClickDisabled ? false : true, onViewportChange: function (info) {
                    onPointHover(undefined);
                    onOverlayHover(undefined);
                    onClick(undefined);
                    onViewportChange(info);
                }, onClick: function (ev) {
                    if (onMapClick) {
                        onMapClick(ev.lngLat, [ev.offsetCenter.x, ev.offsetCenter.y]);
                    }
                }, attributionControl: false }),
                React.createElement(DeckGL__default, { viewState: viewport, ref: this.handleUpdateDeckRef, width: width, height: height, layers: layers, onHover: this.onLayerHover, onClick: this.onLayerClick, pickingRadius: 5 }),
                children,
                tooltip$1 ? (React.createElement("div", { className: tooltip, style: { top: tooltip$1.y, left: tooltip$1.x } }, tooltip$1.content)) : null),
            buttons$1.length > 0 && (React.createElement("div", { className: cx(buttons, (_a = {},
                    _a[embedded] = isEmbedded,
                    _a)) }, buttons$1.map(function (group$1, i) { return (React.createElement("div", { className: group, key: i }, group$1.map(function (button, j) { return (React.createElement(MapButton, { key: j, button: button, onClick: _this.handleButtonOnClick })); }))); })))));
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
    if (type !== exports.GeometryType.MULTI_POLY) {
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
            if (_this.props.viewport) {
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
            if (_this.props.viewport) {
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
            _this.props.onViewportChange(viewport);
        };
        return _this;
    }
    MapContainer$1.prototype.render = function () {
        var _this = this;
        var _a = this.props, layers = _a.layers, style = _a.style, fitBounds = _a.fitBounds, onClick = _a.onClick, onMapClick = _a.onMapClick, onPointHover = _a.onPointHover, onOverlayHover = _a.onOverlayHover, children = _a.children, isDoubleClickDisabled = _a.isDoubleClickDisabled, isEmbedded = _a.isEmbedded, fitBoundsPadding = _a.fitBoundsPadding;
        var wantsZoomButtons = this.props.wantsZoomButtons;
        if (wantsZoomButtons === undefined) {
            wantsZoomButtons = true;
        }
        return (React.createElement(reactSizeme.SizeMe, { monitorHeight: true }, function (_a) {
            var size = _a.size;
            var width = size.width, height = size.height;
            return (React.createElement("div", { className: MapContainer },
                React.createElement(MapCore, { style: style, viewport: _this.props.viewport || _this.state.viewport, buttons: wantsZoomButtons ? [[exports.ButtonType.ZOOM_IN, exports.ButtonType.ZOOM_OUT]] : [], width: width || 600, height: height || 300, onViewportChange: _this.onViewportChange, onZoomIn: _this.handleZoomInOnClick, onZoomOut: _this.handleZoomOutOnClick, onClick: onClick, onMapClick: onMapClick, onPointHover: onPointHover, onOverlayHover: onOverlayHover, layers: layers, fitBounds: fitBounds, fitBoundsPadding: fitBoundsPadding, ref: _this.mapRef, isDoubleClickDisabled: isDoubleClickDisabled, isEmbedded: isEmbedded }, children)));
        }));
    };
    MapContainer$1.prototype.getMapCanvas = function () {
        var map = this.mapRef.current;
        if (map) {
            return map.getMergedCanvas();
        }
    };
    MapContainer$1.defaultProps = {
        style: exports.MapStyle.LIGHT,
    };
    return MapContainer$1;
}(React.Component));

exports.DeckGL = DeckGL__default;
Object.defineProperty(exports, 'GeoJsonLayer', {
  enumerable: true,
  get: function () {
    return DeckGL.GeoJsonLayer;
  }
});
Object.defineProperty(exports, 'IconLayer', {
  enumerable: true,
  get: function () {
    return DeckGL.IconLayer;
  }
});
Object.defineProperty(exports, 'ScatterplotLayer', {
  enumerable: true,
  get: function () {
    return DeckGL.ScatterplotLayer;
  }
});
Object.defineProperty(exports, 'WebMercatorViewport', {
  enumerable: true,
  get: function () {
    return DeckGL.WebMercatorViewport;
  }
});
Object.defineProperty(exports, 'InteractiveMap', {
  enumerable: true,
  get: function () {
    return ReactMapGL.InteractiveMap;
  }
});
exports.ReactMapGL = ReactMapGL__default;
Object.defineProperty(exports, 'StaticMap', {
  enumerable: true,
  get: function () {
    return ReactMapGL.StaticMap;
  }
});
exports.Mercator = Mercator;
exports.MapContainer = MapContainer$1;
exports.MapCore = MapCore;
exports.StylesByMapStyle = StylesByMapStyle;
