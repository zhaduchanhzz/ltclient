import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import Typography from "@mui/material/Typography";
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

const NoDataOverlay = (props: Props) => {
  const { visible } = props;

  if (!visible) {
    return null;
  }

  return (
    <Overlay>
      <BasicBox
        sx={{
          userSelect: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HorizontalSplitIcon
          fontSize="large"
          sx={{ color: "text.secondary" }}
        />
        <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
          Không có dữ liệu
        </Typography>
      </BasicBox>
    </Overlay>
  );
};

export default NoDataOverlay;
