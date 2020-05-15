import { MapStyle } from "./types";

export interface MapTheme {
  [MapStyle.DARK]: string,
  [MapStyle.LIGHT]: string,
}

export const ThinknumMapTheme: MapTheme = {
  [MapStyle.DARK]: "mapbox://styles/ugwigr/cjbcmizfk7c4z2rmyniglt8f6",
  [MapStyle.LIGHT]: "mapbox://styles/ugwigr/cjbcmn6gy7bse2so1p7b4jccq",
}

export const MediaMapTheme: MapTheme = {
  [MapStyle.DARK]: "mapbox://styles/ugwigr/cka7zrmh40j7j1inr3bxl4lrn",
  [MapStyle.LIGHT]: "mapbox://styles/ugwigr/cka7zt0cz0j8o1inr6eukbyfi",
};
