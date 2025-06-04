import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { REWARDS } from "@/consts";
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";

const Rewards = () => {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <BasicBox sx={{ width: "100%", bgcolor: "#12263f", py: 6 }}>
      <Box sx={{ mx: "auto", mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#cda274",
            fontWeight: 700,
            mb: 2,
            textAlign: { xs: "left", md: "center" },
          }}
        >
          Thành tựu của chúng tôi
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            flexWrap: "wrap",
            gap: 2,
            maxWidth: 1100,
            mx: "auto",
            mb: 3,
          }}
        >
          {REWARDS.map((item) => (
            <Box
              key={item.label}
              sx={{
                flex: { xs: "1 1 100%", lg: "1 1 23%" },
                minWidth: 0,
              }}
            >
              <Paper
                sx={{
                  bgcolor: "#152e4d",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  minHeight: 80,
                  boxShadow: "none",
                }}
              >
                {isMobile ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#6e84a3",
                          fontSize: 12,
                          fontWeight: 500,
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                          width: "100%",
                        }}
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        sx={{ color: "#fff", fontWeight: 700, fontSize: 18 }}
                      >
                        {item.value}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6e84a3",
                      }}
                    >
                      <item.icon />
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: 700,
                        mb: 0.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        width: "100%",
                      }}
                    >
                      {item.label}
                      <Box
                        component="span"
                        sx={{
                          ml: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          color: "#cda274",
                        }}
                      >
                        <item.icon />
                      </Box>
                    </Typography>
                    <Typography
                      sx={{ color: "#cda274", fontWeight: 700, fontSize: 18 }}
                    >
                      {item.value}
                    </Typography>
                  </>
                )}
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
    </BasicBox>
  );
};

export default Rewards;
