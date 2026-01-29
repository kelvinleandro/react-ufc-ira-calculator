import type { PDFDocumentProxy } from "pdfjs-dist";
import type {
  Discipline,
  CreditHourSummary,
  PendingCourse,
} from "../types/pdf";

export async function readPdfContent(pdf: PDFDocumentProxy) {
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    text += textContent.items
      .map((item) =>
        "str" in item ? item.str + `${item.hasEOL ? "\n" : " "}` : "",
      )
      .join("");
  }

  return text;
}

export function extractDisciplines(text: string): Discipline[] {
  return [];
}

export function extractCreditHourSummary(text: string): CreditHourSummary {
  return {
    requiredHours: 0,
    completedHours: 0,
    optionalRequiredHours: 0,
    optionalCompletedHours: 0,
    optionalPendingHours: 0,
  };
}

export function extractPendingCourses(text: string): PendingCourse[] {
  return [];
}
