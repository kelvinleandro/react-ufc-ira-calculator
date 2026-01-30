import type { Discipline } from "../types/pdf";

export function calculateIndividualIra(disciplines: Discipline[]): number {
  if (disciplines.length === 0) return 0.0;

  const firstPeriod = disciplines.reduce((minPeriod, d) =>
    d.period < minPeriod ? d.period : minPeriod,
    disciplines[0].period
  );
  const [startYear, startSemester] = firstPeriod.split(".").map(Number);

  const droppedHoursSum = disciplines
    .filter((d) => d.status === "TRANCADO")
    .reduce((sum, d) => sum + d.creditHour, 0);

  const totalHoursSum = disciplines.reduce((sum, d) => sum + d.creditHour, 0);

  let numerator = 0.0;
  let denominator = 0.0;

  const filteredDisciplines = disciplines.filter((d) =>
    ["APROVADO", "APROVADO MÉDIA", "REPROVADO"].includes(d.status),
  );

  for (const discipline of filteredDisciplines) {
    const { creditHour, grade, period } = discipline;
    const [year, semester] = period.split(".").map(Number);

    const semesterNumber =
      (year - startYear) * 2 + (semester - startSemester) + 1;
    const periodWeight = Math.min(6, semesterNumber);

    numerator += periodWeight * creditHour * grade;
    denominator += periodWeight * creditHour;
  }

  if (totalHoursSum === 0) return 0.0;
  const penaltyFactor = 1.0 - (0.5 * droppedHoursSum) / totalHoursSum;

  if (denominator === 0) return 0.0;
  const weightedAverage = numerator / denominator;

  const individualIra = penaltyFactor * weightedAverage;
  return individualIra;
}

export function calculateGeneralIra(
  individualIra: number,
  courseAvg: number,
  courseStd: number,
): number {
  let generalIra;
  if (courseStd == 0) {
    generalIra = 6;
  } else {
    generalIra = 6 + 2 * ((individualIra - courseAvg) / courseStd);
  }

  const cappedIra = Math.max(0, Math.min(10, generalIra));

  return cappedIra;
}

export function calculateSemesterIra(
  disciplines: Discipline[],
): Record<string, number> {
  if (disciplines.length === 0) return {};

  const semesterIras: Record<string, number> = {};
  const completedPeriods = [
    ...new Set(disciplines.map((d) => d.period)),
  ].sort();

  for (const period of completedPeriods) {
    const disciplinesUntilPeriod = disciplines.filter(
      (d) => d.period <= period,
    );
    const iraForPeriod = calculateIndividualIra(disciplinesUntilPeriod);
    semesterIras[period] = iraForPeriod;
  }

  return semesterIras;
}

export function calculateMeanGradePerSemester(
  disciplines: Discipline[],
): Record<string, number> {
  if (disciplines.length === 0) return {};

  const gradesByPeriod = disciplines.reduce(
    (acc: Record<string, { sum: number; count: number }>, d) => {
      if (!acc[d.period]) {
        acc[d.period] = { sum: 0, count: 0 };
      }
      acc[d.period].sum += d.grade;
      acc[d.period].count += 1;
      return acc;
    },
    {},
  );

  const meanGrades: Record<string, number> = {};
  Object.keys(gradesByPeriod)
    .sort()
    .forEach((period) => {
      const { sum, count } = gradesByPeriod[period];
      meanGrades[period] = sum / count;
    });

  return meanGrades;
}

export function prepareHourlyLoadData(
  disciplines: Discipline[],
): Record<string, number> {
  if (disciplines.length === 0) return {};

  const hourlyLoadByPeriod = disciplines.reduce(
    (acc: Record<string, number>, d) => {
      acc[d.period] = (acc[d.period] || 0) + d.creditHour;
      return acc;
    },
    {},
  );

  return hourlyLoadByPeriod;
}

export function prepareGradeDistributionData(
  disciplines: Discipline[],
): Record<string, number> {
  if (disciplines.length === 0) return {};

  const validGrades = disciplines.filter((d) =>
    ["APROVADO", "APROVADO MÉDIA", "REPROVADO"].includes(d.status),
  );

  if (validGrades.length === 0) return {};

  const bins = [0, 5, 7, 8, 9, 10.1];
  const labels = [
    "Ruim (<5)",
    "Regular (5-7)",
    "Bom (7-8)",
    "Otimo (8-9)",
    "Excelente (9-10)",
  ];

  const gradeCounts: Record<string, number> = labels.reduce(
    (acc, label) => {
      acc[label] = 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  for (const discipline of validGrades) {
    const grade = discipline.grade;
    for (let i = 0; i < bins.length - 1; i++) {
      if (grade >= bins[i] && grade < bins[i + 1]) {
        gradeCounts[labels[i]]++;
        break;
      }
    }
  }

  return gradeCounts;
}
