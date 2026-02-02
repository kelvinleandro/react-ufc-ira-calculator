import { useState, useMemo } from "react";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

import {
  readPdfContent,
  extractCreditHourSummary,
  extractDisciplines,
  extractPendingCourses,
  getStudentName,
} from "../services/pdf.service";
import {
  calculateIndividualIra,
  calculateGeneralIra,
  calculateMeanGradePerSemester,
  calculateSemesterIra,
  prepareGradeDistributionData,
  prepareHourlyLoadData,
  calculatePassRate,
} from "@/services/ira.service";
import type { CreditHourSummary, Discipline, PendingCourse } from "@/types/pdf";
import MainLayout from "@/components/layout/MainLayout";
import ControlSidebar from "@/components/home/ControlSidebar";
import type { Course } from "@/types/course";
import type { IraData } from "@/types/ira";
import Dashboard from "@/components/home/Dashboard";

const Index = () => {
  const [studentName, setStudentName] = useState("");
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [creditHourSummary, setCreditHourSummary] =
    useState<CreditHourSummary | null>(null);
  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const iraData = useMemo<IraData | null>(() => {
    if (disciplines.length === 0 || !creditHourSummary || !selectedCourse)
      return null;

    const individualIra = calculateIndividualIra(disciplines);
    const generalIra = calculateGeneralIra(
      individualIra,
      selectedCourse.mean,
      selectedCourse.std,
    );

    const gradeDistribution = prepareGradeDistributionData(disciplines);
    const hourlyLoad = prepareHourlyLoadData(disciplines);
    const meanGradePerSemester = calculateMeanGradePerSemester(disciplines);
    const semesterIra = calculateSemesterIra(disciplines);
    const passRate = calculatePassRate(disciplines);

    const courseProgress =
      (creditHourSummary.completedHours / creditHourSummary.requiredHours) *
      100;

    return {
      individualIra,
      generalIra,
      gradeDistribution,
      hourlyLoad,
      meanGradePerSemester,
      semesterIra,
      courseProgress,
      passRate,
    };
  }, [disciplines, creditHourSummary, selectedCourse]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
      const loadingTask = pdfjsLib.getDocument(typedArray);
      const pdf = await loadingTask.promise;
      const text = await readPdfContent(pdf);
      const _creditHourSummary = extractCreditHourSummary(text);
      const _disciplines = extractDisciplines(text);
      const _pendingCourses = extractPendingCourses(text);
      const _studentName = getStudentName(text);

      setStudentName(_studentName);
      setDisciplines(_disciplines);
      setCreditHourSummary(_creditHourSummary);
      setPendingCourses(_pendingCourses);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row">
        <ControlSidebar
          disciplines={disciplines}
          onFileChange={handleFileChange}
          onCourseChange={setSelectedCourse}
        />
        {disciplines && creditHourSummary && selectedCourse ? (
          <Dashboard
            studentName={studentName.split(" ").slice(0, 2).join(" ")}
            iraData={iraData!}
            pendingCourses={pendingCourses}
            disciplines={disciplines}
          />
        ) : null}
      </div>
    </MainLayout>
  );
};

export default Index;
