"use client";

import ConfirmDialog from "@/components/common/Dialog/ConfirmDialog";
import { useAppContextHandle } from "@/contexts/AppContext";
import {
  useCreateExamMutation,
  useDeleteExamMutation,
  useGetAllExamsQuery,
} from "@/services/apis/exam";
import { CreateExamRequest } from "@/services/types/exam";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
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
  Typography,
} from "@mui/material";
import { useState } from "react";
import Ckeditor from "@/components/thirdparty/Ckeditor";
import { usePostFileMutation } from "@/services/apis/upload";

interface ExamFormData {
  id?: number;
  title: string;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  description: string;
  isNeedVip: boolean;
  examAudioFile?: string; // Single audio file for LISTENING exams
  questions: Array<{
    questionText: string;
    answers?: Array<{
      answerText: string;
      isCorrect: boolean;
    }>;
  }>;
}

const ExamsPage = () => {
  const { updateAppState } = useAppContextHandle();
  const {
    data: examsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllExamsQuery(true);
  const createExamMutation = useCreateExamMutation();
  const deleteExamMutation = useDeleteExamMutation();
  const { mutate: uploadFile, isPending } = usePostFileMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<ExamFormData>({
    title: "",
    examType: "LISTENING",
    description: "",
    isNeedVip: false,
    examAudioFile: "",
    questions: [getInitialQuestionForType("LISTENING")],
  });

  function getInitialQuestionForType(examType: ExamFormData["examType"]) {
    switch (examType) {
      case "LISTENING":
        return {
          questionText: "",
          answers: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
          ],
        };
      case "SPEAKING":
      case "WRITING":
        return {
          questionText: "",
          // No answers for speaking and writing (users provide text/audio responses)
        };
      case "READING":
      default:
        return {
          questionText: "",
          answers: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
          ],
        };
    }
  }

  const exams = examsResponse?.data || [];

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenDialog = (exam?: any) => {
    if (exam) {
      setIsEditMode(true);
      setFormData({
        id: exam.id,
        title: exam.title,
        examType: exam.examType,
        description: exam.description,
        isNeedVip: exam.isNeedVip,
        examAudioFile:
          exam.examType === "LISTENING"
            ? (exam.audioFile || exam.questions?.[0]?.audioFile || "")
            : "",
        questions: (exam.questions || [getInitialQuestionForType(exam.examType)]).map((q: any) => ({
          questionText: q.questionText,
          answers: q.answers,
        })),
      });
    } else {
      setIsEditMode(false);
      const initialQuestion = getInitialQuestionForType("LISTENING");
      setFormData({
        title: "",
        examType: "LISTENING",
        description: "",
        isNeedVip: false,
        examAudioFile: "",
        questions: [initialQuestion],
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // TODO: The update API expects Exam type but we have SimulationExam data
        // This might need backend API adjustment or different endpoint
        updateAppState({
          appAlertInfo: {
            message: "Chức năng cập nhật đang được phát triển",
            severity: "info",
          },
        });
        handleCloseDialog();
        return;
      } else {
        const questions = formData.questions.map((q) => ({
          ...q,
        }));

        const submitData: CreateExamRequest = {
          title: formData.title,
          examType: formData.examType,
          description: formData.description,
          isNeedVip: formData.isNeedVip,
          questions: questions as any,
          ...(formData.examType === "LISTENING" && formData.examAudioFile
            ? { audioFile: formData.examAudioFile }
            : {}),
        };

        await createExamMutation.mutateAsync(submitData);
        updateAppState({
          appAlertInfo: {
            message: "Tạo đề thi thành công",
            severity: "success",
          },
        });
      }

      handleCloseDialog();
      refetch();
    } catch (error: any) {
      console.error("Error submitting exam:", error);
      updateAppState({
        appAlertInfo: {
          message:
            error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
          severity: "error",
        },
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedExam?.id) {
      console.error("No exam selected or exam ID is missing");
      updateAppState({
        appAlertInfo: {
          message: "Không thể xác định đề thi cần xóa",
          severity: "error",
        },
      });
      return;
    }

    try {
      console.log("Deleting exam with ID:", selectedExam.id);
      await deleteExamMutation.mutateAsync(selectedExam.id.toString());

      updateAppState({
        appAlertInfo: {
          message: "Xóa đề thi thành công",
          severity: "success",
        },
      });
      setOpenDeleteDialog(false);
      setSelectedExam(null);
      refetch();
    } catch (error: any) {
      console.error("Delete error:", error);
      updateAppState({
        appAlertInfo: {
          message:
            error?.response?.data?.message || "Có lỗi xảy ra khi xóa đề thi",
          severity: "error",
        },
      });
    }
  };

  const addQuestion = () => {
    const newQuestion = getInitialQuestionForType(formData.examType);
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const removeQuestion = (questionIndex: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(
        (_, index) => index !== questionIndex,
      ),
    });
  };

  const updateQuestion = (
    questionIndex: number,
    field: string,
    value: string,
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleaudioFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setFormData((prev) => ({ ...prev, audioFilePreview: base64 }));
      };

      reader.readAsDataURL(file);

      uploadFile(file, {
        onSuccess: (res: any) => {
          setFormData((prev) => ({
            ...prev,
            examAudioFile: res,
          }));
        },
      });
    }
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];

    if (updatedQuestions[questionIndex].answers) {
      updatedQuestions[questionIndex].answers!.push({
        answerText: "",
        isCorrect: false,
      });
      setFormData({ ...formData, questions: updatedQuestions });
    }
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...formData.questions];

    if (updatedQuestions[questionIndex].answers) {
      updatedQuestions[questionIndex].answers = updatedQuestions[
        questionIndex
      ].answers!.filter((_, index) => index !== answerIndex);
      setFormData({ ...formData, questions: updatedQuestions });
    }
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    field: string,
    value: string | boolean,
  ) => {
    const updatedQuestions = [...formData.questions];

    if (updatedQuestions[questionIndex].answers) {
      updatedQuestions[questionIndex].answers![answerIndex] = {
        ...updatedQuestions[questionIndex].answers![answerIndex],
        [field]: value,
      };
      setFormData({ ...formData, questions: updatedQuestions });
    }
  };

  const getStatusColor = (isNeedVip: boolean) => {
    return isNeedVip ? "warning" : "success";
  };

  const getExamTypeColor = (examType: string) => {
    switch (examType) {
      case "LISTENING":
        return "info";
      case "READING":
        return "success";
      case "WRITING":
        return "warning";
      case "SPEAKING":
        return "error";
      default:
        return "default";
    }
  };

  const stripHtml = (html: string) => (html ? html.replace(/<[^>]*>/g, "").trim() : "");

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải đề thi...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Lỗi tải đề thi. Vui lòng thử lại.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Quản lý đề thi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm đề thi
        </Button>
      </Stack>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm đề thi..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ maxWidth: 500 }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Loại đề thi</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Câu hỏi</TableCell>
                <TableCell>Yêu cầu VIP</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>
                      {exam.title.length > 100 ? exam.title.substring(0, 50) + "..." : exam.title}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exam.examType}
                        color={getExamTypeColor(exam.examType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {stripHtml(exam.description).length > 50
                        ? `${stripHtml(exam.description).substring(0, 50)}...`
                        : stripHtml(exam.description)}
                    </TableCell>
                    <TableCell>{exam.questions.length} câu hỏi</TableCell>
                    <TableCell>
                      <Chip
                        label={exam.isNeedVip ? "VIP" : "FREE"}
                        color={getStatusColor(exam.isNeedVip)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(exam)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedExam(exam);
                            setOpenDeleteDialog(true);
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredExams.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Chỉnh sửa đề thi" : "Thêm đề thi mới"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Tiêu đề"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <TextField
              fullWidth
              select
              label="Loại đề thi"
              value={formData.examType}
              onChange={(e) => {
                const newExamType = e.target.value as ExamFormData["examType"];
                const initialQuestion = getInitialQuestionForType(newExamType);
                setFormData({
                  ...formData,
                  examType: newExamType,
                  examAudioFile: "",
                  questions: [initialQuestion],
                });
              }}
            >
              <MenuItem value="LISTENING">LISTENING</MenuItem>
              <MenuItem value="READING">READING</MenuItem>
              <MenuItem value="WRITING">WRITING</MenuItem>
              <MenuItem value="SPEAKING">SPEAKING</MenuItem>
            </TextField>

            <Ckeditor
              value={formData.description}
              onChange={(v) => setFormData({ ...formData, description: v })}
              placeholder="Mô tả"
              minHeight={54}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isNeedVip}
                  onChange={(e) =>
                    setFormData({ ...formData, isNeedVip: e.target.checked })
                  }
                />
              }
              label="VIP Required"
            />

            {formData.examType === "LISTENING" && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  File âm thanh (cho toàn bộ bài nghe)
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    disabled={isPending} // chặn bấm khi đang upload
                  >
                    {isPending ? "Đang tải..." : "Chọn file âm thanh"}
                    <input
                      type="file"
                      hidden
                      accept="audio/*"
                      onChange={handleaudioFileUpload}
                    />
                  </Button>

                  {isPending && (
                    <Typography variant="body2" color="text.secondary">
                      Đang tải file âm thanh...
                    </Typography>
                  )}

                  {formData.examAudioFile && !isPending && (
                    <Typography variant="body2" color="text.secondary">
                      Đã tải lên file âm thanh {formData.examAudioFile}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}

            <Divider />

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Câu hỏi</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addQuestion}
                  size="small"
                >
                  Thêm câu hỏi
                </Button>
              </Stack>

              {formData.questions.map((question, questionIndex) => (
                <Accordion key={questionIndex} sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Typography>
                        Câu hỏi {questionIndex + 1}:{" "}
                        {stripHtml(question.questionText) || "Chưa có câu hỏi"}
                      </Typography>
                      {formData.questions.length > 1 && (
                        <IconButton
                          component="span"
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestion(questionIndex);
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Ckeditor
                        value={question.questionText}
                        onChange={(v) =>
                          updateQuestion(questionIndex, "questionText", v)
                        }
                        placeholder="Nhập nội dung câu hỏi"
                        minHeight={54}
                      />


                      {/* Show answers section only for LISTENING and READING */}
                      {(formData.examType === "LISTENING" ||
                        formData.examType === "READING") && (
                        <>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="subtitle2">
                              Câu trả lời
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => addAnswer(questionIndex)}
                            >
                              Thêm câu trả lời
                            </Button>
                          </Stack>

                          {question.answers?.map((answer, answerIndex) => (
                            <Stack
                              key={answerIndex}
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <TextField
                                fullWidth
                                label={`Câu trả lời ${answerIndex + 1}`}
                                value={answer.answerText}
                                onChange={(e) =>
                                  updateAnswer(
                                    questionIndex,
                                    answerIndex,
                                    "answerText",
                                    e.target.value,
                                  )
                                }
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={answer.isCorrect}
                                    onChange={(e) =>
                                      updateAnswer(
                                        questionIndex,
                                        answerIndex,
                                        "isCorrect",
                                        e.target.checked,
                                      )
                                    }
                                  />
                                }
                                label="Đúng"
                              />
                              {question.answers?.length &&
                                question.answers?.length > 2 && (
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      removeAnswer(questionIndex, answerIndex)
                                    }
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                            </Stack>
                          ))}
                        </>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditMode ? "Cập nhật" : "Tạo đề thi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedExam(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa đề thi "${selectedExam?.title}"? Hành động này không thể hoàn tác.`}
      />
    </Box>
  );
};

export default ExamsPage;
