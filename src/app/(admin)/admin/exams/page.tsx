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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useState } from "react";

interface Exam {
  id: string;
  title: string;
  type: "Speaking" | "Writing";
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number; // in minutes
  status: "draft" | "published" | "archived";
  createdAt: string;
}

const mockExams: Exam[] = [
  {
    id: "1",
    title: "TOEIC Practice Test 1",
    type: "Speaking",
    difficulty: "Medium",
    duration: 120,
    status: "published",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "IELTS Academic Writing",
    type: "Writing",
    difficulty: "Hard",
    duration: 60,
    status: "published",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    title: "VSTEP Reading Test",
    type: "Speaking",
    difficulty: "Easy",
    duration: 45,
    status: "draft",
    createdAt: "2024-01-03",
  },
];

interface FormData {
  title: string;
  type: Exam["type"];
  difficulty: Exam["difficulty"];
  duration: number;
  status: Exam["status"];
}

const ExamsPage = () => {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "Speaking",
    difficulty: "Medium",
    duration: 60,
    status: "draft",
  });

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

  const handleOpenDialog = (exam?: Exam) => {
    if (exam) {
      setSelectedExam(exam);
      setFormData({
        title: exam.title,
        type: exam.type,
        difficulty: exam.difficulty,
        duration: exam.duration,
        status: exam.status,
      });
    } else {
      setSelectedExam(null);
      setFormData({
        title: "",
        type: "Speaking",
        difficulty: "Medium",
        duration: 60,
        status: "draft",
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExam(null);
  };

  const handleSubmit = () => {
    if (selectedExam) {
      setExams(
        exams.map((exam) =>
          exam.id === selectedExam.id ? { ...exam, ...formData } : exam,
        ),
      );
    } else {
      const newExam: Exam = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setExams([...exams, newExam]);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExams(exams.filter((exam) => exam.id !== id));
    }
  };

  const getDifficultyColor = (difficulty: Exam["difficulty"]) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: Exam["status"]) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

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
                <TableCell>Difficulty</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
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
                      <Chip label={exam.type} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exam.difficulty}
                        color={getDifficultyColor(exam.difficulty)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{exam.duration} minutes</TableCell>
                    <TableCell>
                      <Chip
                        label={exam.status.toUpperCase()}
                        color={getStatusColor(exam.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{exam.createdAt}</TableCell>
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedExam ? "Edit Exam" : "Add New Exam"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
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
              label="Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as Exam["type"],
                })
              }
            >
              <MenuItem value="TOEIC">TOEIC</MenuItem>
              <MenuItem value="IELTS">IELTS</MenuItem>
              <MenuItem value="VSTEP">VSTEP</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Difficulty"
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  difficulty: e.target.value as Exam["difficulty"],
                })
              }
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </TextField>
            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: parseInt(e.target.value, 10) || 0,
                })
              }
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Exam["status"],
                })
              }
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedExam ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamsPage;
