export interface Course {
  id: string;
  name: string;
  mean: number;
  std: number;
}

export type CourseSuggestion = Omit<Course, "id">;
