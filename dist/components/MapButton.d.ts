import React from "react";
import { ButtonType } from "../lib/types";
interface Props {
    button: ButtonType;
    onClick: (button: string) => void;
    className?: string;
}
export declare const MapButton: React.FC<Props>;
export {};
