export interface IraData {
  individualIra: number;
  generalIra: number;
  gradeDistribution: Record<string, number>;
  hourlyLoad: Record<string, number>;
  meanGradePerSemester: Record<string, number>;
  semesterIra: Record<string, number>;
  courseProgress: number;
  passRate: number;
}
