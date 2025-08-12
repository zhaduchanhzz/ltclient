import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  UserResponse,
  UserResponsesPage,
  UserResponsesParams,
  GradeRequest,
  GradeResponse,
  DashboardStats,
} from "../types/lecturer";

// Mock data for testing
const generateMockResponses = (page: number, size: number): UserResponsesPage => {
  const mockResponses: UserResponse[] = [
    {
      id: 1,
      questionId: 101,
      questionText: "Write an essay about the importance of education in modern society.",
      content: "Education plays a crucial role in modern society. It is the foundation upon which we build our future. Through education, individuals gain knowledge, develop critical thinking skills, and learn to contribute meaningfully to their communities. In today's rapidly changing world, education has become more important than ever before...",
      score: null,
      submittedAt: "2024-03-15T10:30:00Z",
      userId: 1001,
      userName: "Nguyễn Văn A",
      termId: 1,
      examId: 2001,
      examType: "WRITING",
    },
    {
      id: 2,
      questionId: 102,
      questionText: "Describe your hometown and what makes it special.",
      content: "My hometown is a small coastal city in central Vietnam. What makes it special is the perfect blend of natural beauty and rich cultural heritage. The pristine beaches stretch for miles, offering breathtaking sunrises that paint the sky in vibrant colors. The local cuisine is renowned for its fresh seafood and unique flavors...",
      score: 8.5,
      submittedAt: "2024-03-15T11:00:00Z",
      userId: 1002,
      userName: "Trần Thị B",
      termId: 1,
      examId: 2002,
      examType: "WRITING",
    },
    {
      id: 3,
      questionId: 103,
      questionText: "Talk about a memorable experience in your life.",
      content: "[Audio Recording] - The student discussed their first day at university, describing the excitement and nervousness they felt, the new friends they made, and how this experience shaped their academic journey.",
      score: null,
      submittedAt: "2024-03-15T14:15:00Z",
      userId: 1003,
      userName: "Lê Văn C",
      termId: 1,
      examId: 2003,
      examType: "SPEAKING",
    },
    {
      id: 4,
      questionId: 104,
      questionText: "Discuss the advantages and disadvantages of social media.",
      content: "Social media has revolutionized the way we communicate and share information. On the positive side, it allows instant global connectivity, enabling people to maintain relationships across distances and share experiences in real-time. However, it also presents challenges such as privacy concerns, addiction, and the spread of misinformation...",
      score: 7.0,
      submittedAt: "2024-03-16T09:45:00Z",
      userId: 1004,
      userName: "Phạm Thị D",
      termId: 1,
      examId: 2004,
      examType: "WRITING",
    },
    {
      id: 5,
      questionId: 105,
      questionText: "Explain how technology has changed education.",
      content: "[Audio Recording] - The student eloquently discussed online learning platforms, digital resources, and how COVID-19 accelerated the adoption of educational technology, while also addressing the digital divide issue.",
      score: null,
      submittedAt: "2024-03-16T10:30:00Z",
      userId: 1005,
      userName: "Hoàng Văn E",
      termId: 1,
      examId: 2005,
      examType: "SPEAKING",
    },
    {
      id: 6,
      questionId: 106,
      questionText: "Write a letter to your local government about environmental issues.",
      content: "Dear Local Government Officials,\n\nI am writing to express my concern about the increasing environmental issues in our community. The rapid urbanization has led to significant air pollution, and our once-clean rivers are now contaminated with industrial waste. I urge you to implement stricter environmental regulations and invest in green initiatives...",
      score: null,
      submittedAt: "2024-03-16T15:20:00Z",
      userId: 1006,
      userName: "Đỗ Thị F",
      termId: 2,
      examId: 2006,
      examType: "WRITING",
    },
    {
      id: 7,
      questionId: 107,
      questionText: "Describe your ideal job and explain why it appeals to you.",
      content: "[Audio Recording] - The student described their dream of becoming a marine biologist, explaining their passion for ocean conservation and the desire to contribute to environmental protection through scientific research.",
      score: 9.0,
      submittedAt: "2024-03-17T08:00:00Z",
      userId: 1007,
      userName: "Võ Văn G",
      termId: 2,
      examId: 2007,
      examType: "SPEAKING",
    },
    {
      id: 8,
      questionId: 108,
      questionText: "Analyze the impact of globalization on local cultures.",
      content: "Globalization has created a complex relationship with local cultures worldwide. While it has facilitated cultural exchange and understanding between different societies, it has also raised concerns about cultural homogenization. Many traditional practices and languages are at risk of disappearing as Western culture becomes increasingly dominant...",
      score: null,
      submittedAt: "2024-03-17T11:30:00Z",
      userId: 1008,
      userName: "Bùi Thị H",
      termId: 2,
      examId: 2008,
      examType: "WRITING",
    },
  ];

  // Filter based on query parameters
  let filteredResponses = [...mockResponses];
  
  // Pagination
  const start = page * size;
  const end = start + size;
  const paginatedResponses = filteredResponses.slice(start, end);

  return {
    content: paginatedResponses,
    totalElements: filteredResponses.length,
    totalPages: Math.ceil(filteredResponses.length / size),
    size,
    number: page,
    first: page === 0,
    last: page === Math.ceil(filteredResponses.length / size) - 1,
    numberOfElements: paginatedResponses.length,
    empty: paginatedResponses.length === 0,
  };
};

// Get user responses for grading
export const useGetUserResponsesQuery = (
  params?: UserResponsesParams,
  enabled = true
) => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params?.size !== undefined)
    queryParams.append("size", params.size.toString());
  if (params?.userId !== undefined)
    queryParams.append("userId", params.userId.toString());
  if (params?.questionId !== undefined)
    queryParams.append("questionId", params.questionId.toString());
  if (params?.termId !== undefined)
    queryParams.append("termId", params.termId.toString());

  return useQuery<UserResponsesPage>({
    queryKey: [API_PATH.LECTURER_USER_RESPONSES, params],
    queryFn: async () => {
      try {
        const response = await HttpClient.get<
          UserResponsesPage,
          CommonResponse<UserResponsesPage>
        >(`${API_PATH.LECTURER_USER_RESPONSES}?${queryParams.toString()}`);
        
        // Handle response structure
        if (!response) {
          // Return mock data if no response
          return generateMockResponses(params?.page || 0, params?.size || 10);
        }
        
        // Handle wrapped response
        if ('data' in response && response.data) {
          return response.data;
        }
        
        // Handle direct response
        if ('content' in response) {
          return response as UserResponsesPage;
        }
        
        // Return mock data as fallback
        return generateMockResponses(params?.page || 0, params?.size || 10);
      } catch (error) {
        // If API fails, return mock data for testing
        console.log("Using mock data for testing");
        return generateMockResponses(params?.page || 0, params?.size || 10);
      }
    },
    enabled,
  });
};

// Submit grade for a response
export const useGradeResponseMutation = () => {
  return useMutation({
    mutationFn: async (data: GradeRequest) => {
      const response = await HttpClient.post<
        GradeRequest,
        CommonResponse<GradeResponse>
      >(API_PATH.LECTURER_GRADE, data);
      return response;
    },
  });
};

// Get dashboard statistics (mock for now, can be replaced with real API)
export const useGetDashboardStatsQuery = (enabled = true) => {
  return useQuery<DashboardStats>({
    queryKey: ["lecturer-dashboard-stats"],
    queryFn: async () => {
      // This could be a real API endpoint later
      // For now, we'll calculate from user responses
      const responses = await HttpClient.get<
        UserResponsesPage,
        CommonResponse<UserResponsesPage>
      >(`${API_PATH.LECTURER_USER_RESPONSES}?page=0&size=1000`);
      
      const data = responses?.data || responses;
      const content = data?.content || [];
      
      const graded = content.filter(r => r.score !== null).length;
      const ungraded = content.filter(r => r.score === null).length;
      
      return {
        graded,
        inGrading: 0, // This would need a separate status field
        ungraded,
        totalResponses: content.length,
      };
    },
    enabled,
  });
};