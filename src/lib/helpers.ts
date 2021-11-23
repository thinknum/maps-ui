import {Position} from "geojson";
import {quantile} from "d3-array";
import {Bounds} from "./types";

export function validateCoordinates(coordinates: number[]) {
  const [lng, lat] = coordinates;
  if (Number.isFinite(lng) && Number.isFinite(lat) && lat >= -90 && lat <= 90) {
    return coordinates;
  }
  throw new Error(`Invalid coordinates: [lng: ${lng}, lat: ${lat}]`);
}

export function smartFindBounds(coordinates: Position[]) {
  const withoutOutliers = pointsWithoutOutliers(coordinates);
  const corners = getCoordinatesCorners(withoutOutliers);

  validateCoordinates(corners[0]);
  validateCoordinates(corners[1]);

  return corners;
}

export function getCoordinatesCorners(coordinates: Position[]) {
  let left: number | undefined = undefined;
  let top: number | undefined = undefined;
  let right: number | undefined = undefined;
  let bottom: number | undefined = undefined;

  for (const [lng, lat] of coordinates) {
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

  return [[top, left], [bottom, right]] as Bounds;
}

export const pointsWithoutOutliers = (points: number[][]) => {
  if (points.length === 0) {
    return points;
  }

  const sampleSize = 10000; // Look at 10,000 points when calculating the size
  const step = Math.max(1, Math.round(points.length / sampleSize));

  const pointsSample = points.filter((_, i) => {
    return i % step === 0;
  });

  const xs = pointsSample.map((point) => point[0]);
  const xFences = findFencesForOutliers(xs);

  const ys = pointsSample.map((point) => point[1]);
  const yFences = findFencesForOutliers(ys);

  const result = points.filter(
    (point) =>
      point[0] >= xFences.lower &&
      point[0] <= xFences.upper &&
      point[1] >= yFences.lower &&
      point[1] <= yFences.upper,
  );

  return result;
};

const findFencesForOutliers = (numbers: number[]) => {
  numbers.sort((a, b) => a - b);

  const q1 = quantile(numbers, 0.25)!;
  const q3 = quantile(numbers, 0.75)!;

  const range = Math.abs(q3 - q1) * 3;

  const lower = q1 - range;
  const upper = q3 + range;

  return {lower, upper};
};
