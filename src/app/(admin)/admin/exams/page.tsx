"use client";

import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  Chip,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import {
  useCreateExamMutation,
  useExamsQuery,
  useUpdateExamMutation,
  useDeleteExamMutation,
} from "@/services/apis/exam";
import { CreateExamRequest, ExamResponse } from "@/services/types/exam";
import { useQueryClient } from "@tanstack/react-query";
import { API_PATH } from "@/consts/api-path";

interface FormData extends CreateExamRequest {
  id?: number;
}

const ExamsPage = () => {
  const queryClient = useQueryClient();
  const { data: examsResponse, isLoading } = useExamsQuery(true);
  const createExamMutation = useCreateExamMutation();
  const updateExamMutation = useUpdateExamMutation();
  const deleteExamMutation = useDeleteExamMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    examType: "LISTENING",
    description: "",
    isNeedVip: false,
    questions: [
      {
        questionText: "",
        answers: [
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
        ],
      },
    ],
  });

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

  const handleOpenDialog = (exam?: ExamResponse) => {
    if (exam) {
      setSelectedExam(exam);
      setFormData({
        id: exam.id,
        title: exam.title,
        examType: exam.examType,
        description: exam.description,
        isNeedVip: exam.isNeedVip,
        questions: exam.questions.map((q) => ({
          questionText: q.questionText,
          answers: q.answers.map((a) => ({
            answerText: a.answerText,
            isCorrect: a.isCorrect,
          })),
        })),
      });
    } else {
      setSelectedExam(null);
      setFormData({
        title: "",
        examType: "LISTENING",
        description: "",
        isNeedVip: false,
        questions: [
          {
            questionText: "",
            answers: [
              { answerText: "", isCorrect: false },
              { answerText: "", isCorrect: false },
            ],
          },
        ],
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExam(null);
  };

  const handleSubmit = async () => {
    try {
      const submitData: CreateExamRequest = {
        title: formData.title,
        examType: formData.examType,
        description: formData.description,
        isNeedVip: formData.isNeedVip,
        questions: formData.questions,
      };

      if (selectedExam) {
        await updateExamMutation.mutateAsync({
          id: selectedExam.id.toString(),
          data: submitData,
        });
      } else {
        await createExamMutation.mutateAsync(submitData);
      }

      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAMS] });
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await deleteExamMutation.mutateAsync(id.toString());
        queryClient.invalidateQueries({ queryKey: [API_PATH.EXAMS] });
      } catch (error) {
        console.error("Error deleting exam:", error);
      }
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: "",
          answers: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
          ],
        },
      ],
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

  const updateQuestion = (questionIndex: number, questionText: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].questionText = questionText;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answers.push({
      answerText: "",
      isCorrect: false,
    });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answers = updatedQuestions[
      questionIndex
    ].answers.filter((_, index) => index !== answerIndex);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    field: string,
    value: string | boolean,
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answers[answerIndex] = {
      ...updatedQuestions[questionIndex].answers[answerIndex],
      [field]: value,
    };
    setFormData({ ...formData, questions: updatedQuestions });
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

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading exams...</Typography>
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
          Exam Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Exam
        </Button>
      </Stack>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search exams..."
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
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>VIP Required</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={exam.examType}
                        color={getExamTypeColor(exam.examType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {exam.description.length > 50
                        ? `${exam.description.substring(0, 50)}...`
                        : exam.description}
                    </TableCell>
                    <TableCell>{exam.questions.length} questions</TableCell>
                    <TableCell>
                      <Chip
                        label={exam.isNeedVip ? "VIP" : "FREE"}
                        color={getStatusColor(exam.isNeedVip)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(exam)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(exam.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
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
        <DialogTitle>{selectedExam ? "Edit Exam" : "Add New Exam"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <TextField
              fullWidth
              select
              label="Exam Type"
              value={formData.examType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  examType: e.target.value as CreateExamRequest["examType"],
                })
              }
            >
              <MenuItem value="LISTENING">LISTENING</MenuItem>
              <MenuItem value="READING">READING</MenuItem>
              <MenuItem value="WRITING">WRITING</MenuItem>
              <MenuItem value="SPEAKING">SPEAKING</MenuItem>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
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

            <Divider />

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Questions</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addQuestion}
                  size="small"
                >
                  Add Question
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
                        Question {questionIndex + 1}:{" "}
                        {question.questionText || "Untitled Question"}
                      </Typography>
                      {formData.questions.length > 1 && (
                        <IconButton
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
                      <TextField
                        fullWidth
                        label="Question Text"
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(questionIndex, e.target.value)
                        }
                        multiline
                        rows={2}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="subtitle2">Answers</Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => addAnswer(questionIndex)}
                        >
                          Add Answer
                        </Button>
                      </Stack>

                      {question.answers.map((answer, answerIndex) => (
                        <Stack
                          key={answerIndex}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <TextField
                            fullWidth
                            label={`Answer ${answerIndex + 1}`}
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
                            label="Correct"
                          />
                          {question.answers.length > 2 && (
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
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              createExamMutation.isPending || updateExamMutation.isPending
            }
          >
            {createExamMutation.isPending || updateExamMutation.isPending
              ? "Saving..."
              : selectedExam
                ? "Update"
                : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamsPage;
