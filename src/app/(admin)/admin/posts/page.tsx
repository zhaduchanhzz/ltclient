"use client";

import ConfirmDialog from "@/components/common/Dialog/ConfirmDialog";
import RichTextEditor from "@/components/common/RichTextEditor";
import { useAppContextHandle } from "@/contexts/AppContext";
import {
  useCreateBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetBlogPostsQuery,
  useTogglePinBlogPostMutation,
  useUpdateBlogPostMutation,
} from "@/services/apis/blog-posts";
import { BlogPost } from "@/services/types/blog-posts";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PushPin as PushPinIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface BlogPostFormData {
  id?: number;
  title: string;
  summary: string;
  content: string;
  pinned?: boolean;
}

const PostsPage = () => {
  const { updateAppState } = useAppContextHandle();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    summary: "",
    content: "",
    pinned: false,
  });

  // API hooks
  const {
    data: postsResponse,
    isLoading,
    refetch,
  } = useGetBlogPostsQuery({
    page: page,
    size: rowsPerPage,
    sort: ["createdAt,desc"],
  });

  const { mutateAsync: createPost } = useCreateBlogPostMutation();
  const { mutateAsync: updatePost } = useUpdateBlogPostMutation();
  const { mutateAsync: deletePost } = useDeleteBlogPostMutation();
  const { mutateAsync: togglePin } = useTogglePinBlogPostMutation();

  const posts = postsResponse?.content || [];
  const totalCount = postsResponse?.totalElements || 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setIsEditMode(true);
      setFormData({
        id: post.id,
        title: post.title,
        summary: post.summary || "",
        content: post.content || "",
        pinned: post.pinned,
      });
    } else {
      setIsEditMode(false);
      setFormData({
        title: "",
        summary: "",
        content: "",
        pinned: false,
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: "",
      summary: "",
      content: "",
      pinned: false,
    });
  };

  const handleSubmit = async () => {
    try {
      const postData: any = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        pinned: formData.pinned,
      };

      if (isEditMode && formData.id) {
        await updatePost({ ...postData, id: formData.id });
        updateAppState({
          appAlertInfo: {
            message: "Cập nhật bài viết thành công",
            severity: "success",
          },
        });
      } else {
        await createPost(postData);
        updateAppState({
          appAlertInfo: {
            message: "Tạo bài viết thành công",
            severity: "success",
          },
        });
      }

      handleCloseDialog();
      refetch();
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message: error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
          severity: "error",
        },
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      await deletePost(selectedPost.id);
      updateAppState({
        appAlertInfo: {
          message: "Xóa bài viết thành công",
          severity: "success",
        },
      });
      setOpenDeleteDialog(false);
      setSelectedPost(null);
      refetch();
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message: error?.data?.message || "Có lỗi xảy ra khi xóa bài viết",
          severity: "error",
        },
      });
    }
  };

  const handleTogglePin = async (post: BlogPost) => {
    try {
      await togglePin(post.id);
      updateAppState({
        appAlertInfo: {
          message: post.pinned ? "Đã bỏ ghim bài viết" : "Đã ghim bài viết",
          severity: "success",
        },
      });
      refetch();
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message: error?.data?.message || "Có lỗi xảy ra",
          severity: "error",
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quản lý bài viết
      </Typography>

      <Stack spacing={3}>
        {/* Search and Actions */}
        <Card sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Tìm kiếm bài viết..."
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Thêm bài viết
            </Button>
          </Stack>
        </Card>

        {/* Posts Table */}
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={500}>
                          {post.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {post.summary}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {post.pinned && (
                        <Chip
                          label="Đã ghim"
                          size="small"
                          color="success"
                          icon={<PushPinIcon />}
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Xem trước">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedPost(post);
                              setOpenPreviewDialog(true);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={post.pinned ? "Bỏ ghim" : "Ghim bài viết"}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleTogglePin(post)}
                            color={post.pinned ? "success" : "default"}
                          >
                            <PushPinIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(post)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedPost(post);
                              setOpenDeleteDialog(true);
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {posts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy bài viết nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
          />
        </Card>
      </Stack>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              {isEditMode ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Tiêu đề"
              fullWidth
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <TextField
              label="Tóm tắt"
              fullWidth
              multiline
              rows={2}
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Nội dung *
              </Typography>
              <RichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
                placeholder="Nhập nội dung bài viết..."
                minHeight={300}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.content}
          >
            {isEditMode ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedPost(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa bài viết "${selectedPost?.title}"? Hành động này không thể hoàn tác.`}
      />

      {/* Preview Dialog */}
      <Dialog
        open={openPreviewDialog}
        onClose={() => {
          setOpenPreviewDialog(false);
          setSelectedPost(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Xem trước bài viết</DialogTitle>
        <DialogContent dividers>
          {selectedPost && (
            <Stack spacing={3}>
              {/* Title */}
              <Typography variant="h4" fontWeight={700}>
                {selectedPost.title}
              </Typography>

              {/* Meta info */}
              <Typography variant="caption" color="text.secondary">
                {formatDate(selectedPost.createdAt)}
              </Typography>

              {/* Summary */}
              {selectedPost.summary && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  {selectedPost.summary}
                </Typography>
              )}

              {/* Content */}
              <Box
                sx={{
                  "& p": { mb: 2 },
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    mt: 3,
                    mb: 2,
                    fontWeight: 600,
                  },
                  "& ul, & ol": {
                    pl: 3,
                    mb: 2,
                  },
                  "& li": {
                    mb: 1,
                  },
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 1,
                    my: 2,
                  },
                  "& blockquote": {
                    borderLeft: "4px solid",
                    borderLeftColor: "primary.main",
                    pl: 2,
                    ml: 0,
                    my: 2,
                    fontStyle: "italic",
                    color: "text.secondary",
                  },
                  "& pre": {
                    backgroundColor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                    overflowX: "auto",
                  },
                  "& code": {
                    backgroundColor: "grey.100",
                    px: 0.5,
                    borderRadius: 0.5,
                    fontSize: "0.875em",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenPreviewDialog(false);
              setSelectedPost(null);
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsPage;
