import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Overlay from "./Overlay";

/**
 * Defines the properties for the component.
 *
 * Properties:
 * - `visible`: An optional boolean indicating whether the component is visible.
 */
type Props = {
  visible?: boolean;
};

const LoadingOverlay = (props: Props) => {
  const { visible } = props;

  if (!visible) {
    return null;
  }

  return (
    <Overlay above backdrop>
      <BasicBox
        sx={{
          userSelect: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </BasicBox>
    </Overlay>
  );
};

export default LoadingOverlay;
