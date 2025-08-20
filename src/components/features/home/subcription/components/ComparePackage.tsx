import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const rows = [
  {
    feature: "Truy cập đề thi",
    free: {
      icon: <CancelIcon sx={{ color: "#ff5252" }} />,
      text: "Chỉ một số đề mẫu",
    },
    vip: {
      icon: <CheckCircleIcon sx={{ color: "#4caf50" }} />,
      text: "Đầy đủ toàn bộ đề thi chuẩn VSTEP",
    },
  },
  {
    feature: "Truy cập mã đề luyện tập",
    free: {
      icon: <CancelIcon sx={{ color: "#ff5252" }} />,
      text: "Chỉ một số đề mẫu",
    },
    vip: {
      icon: <CheckCircleIcon sx={{ color: "#4caf50" }} />,
      text: "Đầy đủ toàn bộ đề thi chuẩn VSTEP",
    },
  },
  {
    feature: "Hiển thị lời giải chi tiết",
    free: {
      icon: <CancelIcon sx={{ color: "#ff5252" }} />,
      text: "Chỉ một số đề mẫu",
    },
    vip: {
      icon: <CheckCircleIcon sx={{ color: "#4caf50" }} />,
      text: "Đầy đủ toàn bộ đề thi chuẩn VSTEP",
    },
  },
];

type ComparePackageProps = {
  id: string;
};

const ComparePackage = ({ id }: ComparePackageProps) => {
  const theme = useTheme();
  
  return (
    <Box id={id} sx={{ py: 5, px: 2 }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ color: "#3ea6ff", fontWeight: 700, mb: 1 }}
      >
        <span role="img" aria-label="balance">
          ⚖️
        </span>{" "}
        So sánh gói tài khoản miễn phí & tài khoản VIP
      </Typography>
      <Typography
        align="center"
        sx={{ color: theme.palette.text.primary, mb: 4, maxWidth: 800, mx: "auto", fontSize: 18 }}
      >
        Bạn đang phân vân giữa <b>tài khoản miễn phí</b> và <b>tài khoản VIP</b>?
        Hãy xem bảng so sánh dưới đây để chọn gói phù hợp nhất!
      </Typography>
    <TableContainer
      component={Paper}
      sx={{ background: theme.palette.background.paper, maxWidth: 900, mx: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: 16,
                borderBottom: `2px solid ${theme.palette.divider}`,
              }}
            >
              TÍNH NĂNG
            </TableCell>
            <TableCell
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: 16,
                borderBottom: `2px solid ${theme.palette.divider}`,
              }}
              align="center"
            >
              TÀI KHOẢN MIỄN PHÍ
            </TableCell>
            <TableCell
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: 16,
                borderBottom: `2px solid ${theme.palette.divider}`,
              }}
              align="center"
            >
              TÀI KHOẢN VIP
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx} sx={{ "&:last-child td": { borderBottom: 0 } }}>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  fontSize: 17,

                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {row.feature}
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 16,

                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
                align="center"
              >
                {row.free.icon}{" "}
                <span style={{ marginLeft: 8 }}>{row.free.text}</span>
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 16,

                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
                align="center"
              >
                {row.vip.icon}{" "}
                <span style={{ marginLeft: 8 }}>{row.vip.text}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
};

export default ComparePackage;
