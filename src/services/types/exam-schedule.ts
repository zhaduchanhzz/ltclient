export interface ExamSchedule {
  id: number;
  orderNumber: number;
  examDates: string;
  weekdays: string;
  organizer: string;
  registrationDeadline: string;
}

export interface ExamScheduleRecentDto {
  month: number;
  schedules: ExamSchedule[];
}

export interface PageExamScheduleRecentDto {
  content: ExamScheduleRecentDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PageExamSchedule {
  content: ExamSchedule[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ExamScheduleFilterParams {
  organization?: string;
  registrationDeadline?: string;
  page?: number;
  size?: number;
}

export interface ExamScheduleRecentParams {
  page?: number;
  size?: number;
}
