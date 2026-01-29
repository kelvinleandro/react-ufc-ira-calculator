export interface Discipline {
  period: string;
  code: string;
  name: string;
  status: string;
  grade: number;
  creditHour: number;
  symbol: string;
}

export interface CreditHourSummary {
  requiredHours: number;
  completedHours: number;
  optionalRequiredHours: number;
  optionalCompletedHours: number;
  optionalPendingHours: number;
}

export interface PendingCourse {
  code: string;
  name: string;
  creditHour: number;
}
