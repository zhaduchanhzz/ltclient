import Slider, { SliderProps } from "@mui/material/Slider";

type BasicSliderProps = SliderProps & {};

const BasicSlider = (props: BasicSliderProps) => {
  const { id, ...otherProps } = props;
  return <Slider id={id} data-cy={id} {...otherProps} />;
};

export default BasicSlider;
