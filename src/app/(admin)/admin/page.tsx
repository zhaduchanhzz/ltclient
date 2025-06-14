"use client";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import ArticleIcon from "@mui/icons-material/Article";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Tổng số người dùng",
      value: "1,234",
      icon: <PeopleIcon />,
      color: "#1976d2",
      trend: "+12%",
      progress: 68,
    },
    {
      title: "Bài thi đang hoạt động",
      value: "56",
      icon: <SchoolIcon />,
      color: "#2e7d32",
      trend: "+8%",
      progress: 72,
    },
    {
      title: "Bài viết blog",
      value: "89",
      icon: <ArticleIcon />,
      color: "#ed6c02",
      trend: "+24%",
      progress: 85,
    },
  ];

  const recentActivities = [
    {
      user: "Nguyễn Văn A",
      action: "đã hoàn thành bài thi",
      exam: "TOEIC Practice Test 01",
      time: "2 phút trước",
      avatar: "/avatars/avatar1.jpg",
    },
    {
      user: "Trần Thị B",
      action: "đã đăng ký khóa học",
      exam: "VSTEP Intensive Course",
      time: "15 phút trước",
      avatar: "/avatars/avatar2.jpg",
    },
    {
      user: "Lê Văn C",
      action: "đã đăng bài viết mới",
      exam: "Tips for IELTS Writing",
      time: "1 giờ trước",
      avatar: "/avatars/avatar3.jpg",
    },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Tổng quan hệ thống
        </Typography>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Stack>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} md={4} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "background.paper",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 24px 0 rgba(0,0,0,0.1)",
                },
              }}
              elevation={0}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
                component="div"
              >
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    width: 52,
                    height: 52,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography
                    component="div"
                    variant="h4"
                    sx={{ fontWeight: "bold", mb: 0.5, textAlign: "right" }}
                  >
                    {stat.value}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    justifyContent="flex-end"
                    component="div"
                  >
                    <TrendingUpIcon
                      fontSize="small"
                      sx={{ color: "success.main" }}
                    />
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "success.main" }}
                    >
                      {stat.trend}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Typography
                component="div"
                variant="subtitle2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                {stat.title}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stat.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: `${stat.color}15`,
                  "& .MuiLinearProgress-bar": {
                    bgcolor: stat.color,
                    borderRadius: 3,
                  },
                }}
              />
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <BasicStack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
                component="div"
              >
                <Typography
                  component="h2"
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                >
                  Hoạt động gần đây
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </BasicStack>

              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar src={activity.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            component="span"
                            variant="subtitle2"
                            sx={{ fontWeight: "medium", display: "block" }}
                          >
                            {activity.user} {activity.action}
                          </Typography>
                        }
                        secondary={
                          <Box
                            component="span"
                            sx={{
                              mt: 0.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                color: "primary.main",
                                fontWeight: "medium",
                              }}
                            >
                              {activity.exam}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              • {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
