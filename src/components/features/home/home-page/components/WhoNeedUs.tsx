import { LEVELS } from "@/consts";
import DoneIcon from "@mui/icons-material/Done";
import { Box, List, ListItem, ListItemIcon, Typography } from "@mui/material";

const WhoNeedUs = () => {
  return (
    <Box sx={{ width: "100%", bgcolor: "#12263f", py: 8 }}>
      <Typography
        variant="h5"
        sx={{
          color: "#cda274",
          fontWeight: 700,
          textAlign: { xs: "left", md: "center" },
          mb: 4,
        }}
      >
        Ai cần thi chứng chỉ ngoại ngữ tiếng Anh VSTEP?
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
          maxWidth: 900,
          mx: "auto",
          width: "100%",
          mt: 4,
          pl: 4,
        }}
      >
        {LEVELS.map((col) => (
          <Box
            key={col.level}
            sx={{
              bgcolor: "transparent",
              p: 0,
              width: "100%",
            }}
          >
            <Typography
              sx={{ color: "white", fontWeight: 600, mb: 1, fontSize: 18 }}
            >
              {col.level}
            </Typography>
            <List sx={{ p: 0 }}>
              {col.items.map((item, idx) => (
                <ListItem key={idx} sx={{ color: "#6ee7b7", py: 0.2, pl: 0 }}>
                  <ListItemIcon sx={{ color: "#6ee7b7", minWidth: 32, p: 0 }}>
                    <DoneIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography sx={{ color: "#bfc9da", fontSize: 16 }}>
                    {item}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
      <Typography
        sx={{
          color: "#6e84a3",
          fontSize: 14,
          textAlign: "center",
          mt: 2,
          fontStyle: "italic",
        }}
      >
        *Và nhiều đối tượng khác theo yêu cầu của các đơn vị, tổ chức.
      </Typography>
    </Box>
  );
};

export default WhoNeedUs;
