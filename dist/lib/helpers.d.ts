import { Position } from "geojson";
export declare function smartFindBounds(coordinates: Position[]): [number[], number[]];
export declare function getCoordinatesCorners(coordinates: Position[]): [number[], number[]];
export declare const pointsWithoutOutliers: (points: number[][]) => number[][];
