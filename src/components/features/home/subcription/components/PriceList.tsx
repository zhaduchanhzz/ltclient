"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Button, Card, Typography } from "@mui/material";
import Link from "next/link";
import { Subscription, useSubscriptions } from "../utils/subs";

type Feature = {
  label: string;
  checked?: boolean;
  value?: string;
};

const PriceList = ({ id }: { id: string }) => {
  const { isAuthenticated } = useAuthContext();
  const { VIP_SUBSCRIPTIONS, MARK_SUBSCRIPTIONS, COMBO_SUBSCRIPTIONS } =
    useSubscriptions();
  console.log(VIP_SUBSCRIPTIONS);
  console.log(MARK_SUBSCRIPTIONS);
  console.log(COMBO_SUBSCRIPTIONS);
  return (
    <Box sx={{ py: 6, px: 2 }} id={id}>
      <Typography
        variant="h6"
        sx={{
          color: "#2c7be5",
          fontWeight: 700,
          mb: 1,
          textAlign: "center",
        }}
      >
        <span role="img" aria-label="notebook">
          📄
        </span>{" "}
        Chọn gói ôn luyện{" "}
        <span style={{ color: "#2c7be5" }}>phù hợp với bạn.</span>
      </Typography>
      <Typography
        sx={{
          color: "black",
          mb: 5,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        Hệ thống cung cấp các gói đề thi VIP, gói chấm bài tự luận & gói combo
        tiết kiệm, giúp bạn đạt <b>B1 - B2 - C1</b> dễ dàng.
      </Typography>

      <VipSubscription
        VIP_SUBSCRIPTIONS={VIP_SUBSCRIPTIONS}
        isAuthenticated={isAuthenticated}
      />

      <MarkSubscription
        MARK_SUBSCRIPTIONS={MARK_SUBSCRIPTIONS}
        isAuthenticated={isAuthenticated}
      />

      <ComboSubscription
        COMBO_SUBSCRIPTIONS={COMBO_SUBSCRIPTIONS}
        isAuthenticated={isAuthenticated}
      />
    </Box>
  );
};

const VipSubscription = ({
  VIP_SUBSCRIPTIONS,
  isAuthenticated,
}: {
  VIP_SUBSCRIPTIONS: Subscription[];
  isAuthenticated: boolean;
}) => {
  return (
    <>
      <Typography
        variant="subtitle1"
        sx={{ color: "#2c7be5", fontWeight: 700, mb: 1, mt: 4 }}
      >
        GÓI ĐỀ THI VIP
      </Typography>
      <Typography sx={{ color: "black", mb: 4 }}>
        Thí sinh được truy cập <b>toàn bộ kho đề thi</b> cập nhật mới nhất,
        chính xác nhất.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
          mx: "auto",
          py: 2,
        }}
      >
        {VIP_SUBSCRIPTIONS.map((pkg) => (
          <Card
            key={pkg.id}
            sx={{
              border: "1px solid #2c7be5",
              borderRadius: 3,
              boxShadow: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                gap: 4,
              }}
            >
              <Box>
                <Box sx={{ px: 2, pt: 2 }}>
                  <Typography
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 18, mb: 2 }}
                  >
                    <span style={{ fontSize: 22, marginRight: 6 }}>
                      {pkg.icon}
                    </span>{" "}
                    {pkg.title}
                  </Typography>
                  <Typography
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 28, mb: 2 }}
                  >
                    {pkg.price.toLocaleString()}{" "}
                    <span style={{ fontSize: 18, fontWeight: 400 }}>
                      {pkg.priceUnit}
                    </span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  {pkg.features.map((feature: Feature, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ fontSize: 16 }}>
                        {feature.label}
                      </Typography>
                      {feature.checked && (
                        <CheckCircleIcon
                          sx={{ color: "#00e676", fontSize: 20 }}
                        />
                      )}
                      {feature.value && (
                        <Typography sx={{ color: "#2c7be5", fontWeight: 700 }}>
                          {feature.value}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "#2c7be5",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 2,
                    fontSize: 16,
                    py: 1.2,
                    boxShadow: "none",
                    border: "none",
                    mt: 2,
                    "&:hover": {
                      background: "#1565c0",
                      color: "#fff",
                      boxShadow: "none",
                    },
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  <Link
                    href={isAuthenticated ? "/dang-ky" : "/dang-ky"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {pkg.button}
                  </Link>
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
};

const MarkSubscription = ({
  MARK_SUBSCRIPTIONS,
  isAuthenticated,
}: {
  MARK_SUBSCRIPTIONS: Subscription[];
  isAuthenticated: boolean;
}) => {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography
        variant="subtitle1"
        sx={{ color: "#2c7be5", fontWeight: 700, mb: 1 }}
      >
        GÓI CHẤM THI TỰ LUẬN
      </Typography>
      <Typography sx={{ color: "black", mb: 2 }}>
        Thí sinh được <b>tự chọn bài thi</b> mà mình muốn chấm. Giám khảo chấm
        bài theo <b>đúng tiêu chí chấm VSTEP</b> của Bộ Giáo dục và Đào tạo.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
          mx: "auto",
          py: 2,
        }}
      >
        {MARK_SUBSCRIPTIONS.map((pkg) => (
          <Card
            key={pkg.id}
            sx={{
              border: "1px solid #2c7be5",
              borderRadius: 3,
              boxShadow: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                gap: 2,
              }}
            >
              <Box>
                <Box sx={{ px: 2, pt: 2 }}>
                  <Typography
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 18, mb: 2 }}
                  >
                    <span style={{ fontSize: 22, marginRight: 6 }}>
                      {pkg.icon}
                    </span>{" "}
                    {pkg.title}
                  </Typography>
                  <Typography
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 28, mb: 2 }}
                  >
                    {pkg.price.toLocaleString()}{" "}
                    <span style={{ fontSize: 18, fontWeight: 400 }}>
                      {pkg.priceUnit}
                    </span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  {pkg.features.map((feature: Feature, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ color: "black", fontSize: 16 }}>
                        {feature.label}
                      </Typography>
                      {feature.checked && (
                        <CheckCircleIcon
                          sx={{ color: "#00e676", fontSize: 20 }}
                        />
                      )}
                      {feature.value && (
                        <Typography sx={{ color: "#2c7be5", fontWeight: 700 }}>
                          {feature.value}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "#2c7be5",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 2,
                    fontSize: 16,
                    py: 1.2,
                    boxShadow: "none",
                    border: "none",
                    mt: 2,
                    "&:hover": {
                      background: "#1565c0",
                      color: "#fff",
                      boxShadow: "none",
                    },
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  <Link
                    href={isAuthenticated ? "/dang-ky" : "/dang-ky"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {pkg.button}
                  </Link>
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

const ComboSubscription = ({
  COMBO_SUBSCRIPTIONS,
  isAuthenticated,
}: {
  COMBO_SUBSCRIPTIONS: Subscription[];
  isAuthenticated: boolean;
}) => {
  return (
    <Box sx={{ mt: 8 }}>
      <Typography
        variant="h6"
        sx={{ color: "#2c7be5", fontWeight: 700, mb: 1, textAlign: "center" }}
      >
        GÓI COMBO ƯU ĐÃI
      </Typography>
      <Typography
        sx={{ color: "black", mb: 4, textAlign: "center", fontSize: 16 }}
      >
        Bao gồm <b>toàn bộ quyền lợi</b> từ gói đề thi VIP và gói chấm thi tự
        luận, kèm theo nhiều <b>ưu đãi</b>, tiết kiệm hơn.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
          mx: "auto",
        }}
      >
        {COMBO_SUBSCRIPTIONS.map((pkg) => (
          <Card
            key={pkg.id}
            sx={{
              color: "black",
              borderRadius: 4,
              border: "1px solid #2c7be5",
              boxShadow: 3,
              flex: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box>
                <Box sx={{ px: 4, pt: 4 }}>
                  <Typography
                    align="center"
                    sx={{
                      fontWeight: 700,
                      fontSize: 20,
                      mb: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    <span style={{ fontSize: 22, marginRight: 6 }}>
                      {pkg.icon}
                    </span>{" "}
                    {pkg.title}
                  </Typography>
                  <Typography
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 32, mb: 2 }}
                  >
                    {pkg.price.toLocaleString()}{" "}
                    <span style={{ fontSize: 20, fontWeight: 400 }}>VNĐ</span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {pkg.features.map((feature: Feature, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        minHeight: 32,
                      }}
                    >
                      <Typography sx={{ color: "black", fontSize: 16 }}>
                        {feature.label}
                      </Typography>
                      {feature.checked && (
                        <CheckCircleIcon
                          sx={{ color: "#00e676", fontSize: 20 }}
                        />
                      )}
                      {feature.value && (
                        <Typography sx={{ color: "#2c7be5", fontWeight: 700 }}>
                          {feature.value}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ p: 4 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "#2c7be5",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 2,
                    fontSize: 16,
                    py: 1.2,
                    boxShadow: "none",
                    border: "none",
                    mt: 2,
                    "&:hover": {
                      background: "#1565c0",
                      color: "#fff",
                      boxShadow: "none",
                    },
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  <Link
                    href={isAuthenticated ? "/dang-ky" : "/dang-ky"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {pkg.button}
                  </Link>
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PriceList;
