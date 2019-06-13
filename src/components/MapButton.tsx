import React from "react";
import * as styles from "./styles.scss";
import {ButtonType} from "../lib/types";
import cx from "classnames";
import ZoomIn from "./icons/ZoomIn.svg";
import ZoomOut from "./icons/ZoomOut.svg";

const stylesByButton = {
  [ButtonType.ZOOM_IN]: styles.zoomIn,
  [ButtonType.ZOOM_OUT]: styles.zoomOut,
};

const icons = {
  [ButtonType.ZOOM_IN]: ZoomIn,
  [ButtonType.ZOOM_OUT]: ZoomOut,
};

interface Props {
  button: ButtonType;
  onClick: (button: string) => void;
  className?: string;
}

const Icon: React.FC<{svg: string}> = (props) => {
  return <i dangerouslySetInnerHTML={{__html: props.svg}} />;
};

export const MapButton: React.FC<Props> = (props) => {
  return (
    <button
      className={cx(styles.MapButton, props.className, stylesByButton[props.button])}
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        props.onClick(props.button);
      }}
    >
      <Icon svg={icons[props.button]} />
    </button>
  );
};
