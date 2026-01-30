import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

import "./App.css";
import {
  readPdfContent,
  extractCreditHourSummary,
  extractDisciplines,
  extractPendingCourses,
} from "./services/pdf.service";
import type { CreditHourSummary, Discipline, PendingCourse } from "./types/pdf";

function App() {
  const [pdfText, setPdfText] = useState("");
  const [creditHourSummary, setCreditHourSummary] =
    useState<CreditHourSummary | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>([]);

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

      setPdfText(text);
      setCreditHourSummary(_creditHourSummary);
      setDisciplines(_disciplines);
      setPendingCourses(_pendingCourses);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveText = () => {
    if (pdfText) {
      const blob = new Blob([pdfText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted_text.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveSummary = () => {
    if (creditHourSummary) {
      const blob = new Blob([JSON.stringify(creditHourSummary, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "credit_hour_summary.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSavePendingCourses = () => {
    if (pendingCourses.length > 0) {
      const header = ["code", "name", "creditHour"];
      const csv = [
        header.join(","),
        ...pendingCourses.map((course) =>
          [course.code, course.name, course.creditHour].join(","),
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pending_courses.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveDisciplines = () => {
    if (disciplines.length > 0) {
      const header = [
        "period",
        "code",
        "name",
        "status",
        "grade",
        "creditHour",
        "symbol",
      ];
      const csv = [
        header.join(","),
        ...disciplines.map((discipline) =>
          [
            discipline.period,
            discipline.code,
            discipline.name,
            discipline.status,
            discipline.grade,
            discipline.creditHour,
            discipline.symbol,
          ].join(","),
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "disciplines.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF Text Extractor</h1>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button onClick={handleSaveText} disabled={!pdfText}>
          Save to TXT
        </button>
        <button onClick={handleSaveSummary} disabled={!creditHourSummary}>
          Save Summary
        </button>
        <button
          onClick={handleSavePendingCourses}
          disabled={pendingCourses.length === 0}
        >
          Save Pending Courses
        </button>
        <button
          onClick={handleSaveDisciplines}
          disabled={disciplines.length === 0}
        >
          Save Disciplines
        </button>
      </header>
    </div>
  );
}

export default App;
