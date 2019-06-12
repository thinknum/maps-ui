import cx from 'classnames';
import DeckGL from 'deck.gl';
import isEqual from 'lodash-es/isEqual';
import React from 'react';
import ReactMapGL, { FlyToInterpolator } from 'react-map-gl';
import { fitBounds, normalizeViewportProps } from 'viewport-mercator-project';

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

var css = "";
var styles = {};
styleInject(css);

var styles$1 = /*#__PURE__*/Object.freeze({
    'default': styles
});

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
    ButtonType["DOWNLOAD"] = "Download";
})(ButtonType || (ButtonType = {}));

var _a;
// TODO: Use real implementation of the MapButton
var MapButton = function () {
    return React.createElement("span", null, "button");
};
/* Constants
-------------------------------------------------------------------------*/
var StylesByMapStyle = (_a = {},
    _a[MapStyle.DARK] = "mapbox://styles/ugwigr/cjbcmizfk7c4z2rmyniglt8f6",
    _a[MapStyle.LIGHT] = "mapbox://styles/ugwigr/cjbcmn6gy7bse2so1p7b4jccq",
    _a);
var Map = /** @class */ (function (_super) {
    __extends(Map, _super);
    function Map() {
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
            if (!info) {
                return undefined;
            }
            var viewport = _this.deck.layerManager.viewports[0];
            var object = info.object, layer = info.layer;
            var rgbColor = layer.props.getColor && layer.props.getColor(object);
            var color = rgbColor && convertRgbToHex(rgbColor);
            var position = getItemPosition(info);
            if (!position) {
                return undefined;
            }
            var pixels = position && viewport.project(position);
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
    Map.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, fitBounds$1 = _a.fitBounds, fitBoundsPadding = _a.fitBoundsPadding, width = _a.width, height = _a.height, viewport = _a.viewport;
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
        if (fitBounds$1 &&
            (!isEqual(fitBounds$1, prevProps.fitBounds) ||
                width !== prevProps.width ||
                height !== prevProps.height)) {
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
            this.props.onViewportChange(__assign({}, viewport, { latitude: latitude,
                longitude: longitude,
                zoom: zoom, transitionInterpolator: new FlyToInterpolator(), transitionDuration: 500 }));
        }
    };
    Map.prototype.render = function () {
        var _this = this;
        var _a;
        var _b = this.props, viewport = _b.viewport, width = _b.width, height = _b.height, onViewportChange = _b.onViewportChange, layers = _b.layers, style = _b.style, buttons = _b.buttons, onPointHover = _b.onPointHover, onOverlayHover = _b.onOverlayHover, onClick = _b.onClick, onMapClick = _b.onMapClick, children = _b.children, isDoubleClickDisabled = _b.isDoubleClickDisabled, isEmbedded = _b.isEmbedded;
        var tooltip = this.state.tooltip;
        var mapStyle = StylesByMapStyle[style];
        return (React.createElement(React.Fragment, null,
            React.createElement(ReactMapGL, __assign({ mapStyle: mapStyle, preserveDrawingBuffer: true }, viewport, { ref: this.handleUpdateMapRef, width: width, height: height, doubleClickZoom: isDoubleClickDisabled ? false : true, onViewportChange: function (info) {
                    onPointHover(undefined);
                    onOverlayHover(undefined);
                    onClick(undefined);
                    onViewportChange(info);
                }, onClick: function (ev) {
                    if (onMapClick) {
                        onMapClick(ev.lngLat, [ev.offsetCenter.x, ev.offsetCenter.y]);
                    }
                }, attributionControl: false }),
                React.createElement(DeckGL, __assign({}, viewport, { ref: this.handleUpdateDeckRef, width: width, height: height, layers: layers, onLayerHover: this.onLayerHover, onLayerClick: this.onLayerClick, pickingRadius: 5 })),
                children,
                tooltip ? (React.createElement("div", { className: undefined, style: { top: tooltip.y, left: tooltip.x } }, tooltip.content)) : null),
            buttons.length > 0 && (React.createElement("div", { className: cx(undefined, (_a = {},
                    _a[undefined] = isEmbedded,
                    _a)) }, buttons.map(function (group, i) { return (React.createElement("div", { className: undefined, key: i }, group.map(function (button, j) { return (React.createElement(MapButton, { key: j, button: button, onClick: _this.handleButtonOnClick })); }))); })))));
    };
    Map.prototype.getMergedCanvas = function () {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = this.mapCanvas.width;
        canvas.height = this.mapCanvas.height;
        context.drawImage(this.mapCanvas, 0, 0);
        context.drawImage(this.overlayCanvas, 0, 0);
        return canvas;
    };
    return Map;
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

export { ButtonType, GeometryType, Map, MapStyle };
