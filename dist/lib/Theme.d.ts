import { MapStyle } from "./types";
export interface MapTheme {
    [MapStyle.DARK]: string;
    [MapStyle.LIGHT]: string;
}
export declare const ThinknumMapTheme: MapTheme;
export declare const MediaMapTheme: MapTheme;
