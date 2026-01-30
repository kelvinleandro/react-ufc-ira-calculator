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
  const disciplines: Discipline[] = [];
  let currentPeriod = "";

  const lines = text.split("\n").filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const periodMatch = line.match(/^\s*(\d{4}\.\d)\s*$/);
    if (periodMatch) {
      currentPeriod = periodMatch[1].trim();
      continue;
    }

    const statusRegex =
      /(APROVADO MÉDIA|APROVADO|REPROVADO|TRANCADO|SUPRIMIDO|APROVT INTERNO|MATRICULADO)/;
    const statusMatch = line.match(statusRegex);

    if (statusMatch) {
      const status = statusMatch[1];
      if (status === "APROVT INTERNO" || status === "SUPRIMIDO") {
        continue;
      }

      const statusIndex = statusMatch.index!;
      const beforePart = line.substring(0, statusIndex);
      const afterPart = line.substring(statusIndex + status.length);

      const dataRegex =
        /^\s*(?<code>[A-Z]{2,3}\d{4,})\s+(?<freq>[\d.-]+)\s+(?<grade>[\d.-]+)\s*(?<symbol>[*e&#@§]?)\s*(?<creditHour>\d+\.00)/;
      const dataMatch = afterPart.match(dataRegex);

      if (dataMatch) {
        const { code, grade, symbol, creditHour } = dataMatch.groups!;

        let name = "";
        const namePart = beforePart.replace(currentPeriod, "").trim();

        const turmaRegex = /\s(\S+)$/;
        const nameWithoutTurma = namePart.replace(turmaRegex, "").trim();

        if (nameWithoutTurma.length > 3) {
          name = nameWithoutTurma;
        } else if (i > 0) {
          const prevLine = lines[i - 1]?.trim();
          if (
            prevLine &&
            prevLine.length > 3 &&
            !/\d{4}\.\d/.test(prevLine) &&
            /^[A-ZÁÀÂÃÉÊÍÎÓÔÕÚÇ\s-]+$/.test(prevLine)
          ) {
            name = prevLine;
          }
        }

        if (!name) continue;

        disciplines.push({
          period: currentPeriod,
          code: code!.trim(),
          name: name.trim(),
          status: status.trim(),
          grade: parseFloat(grade! || "0") || 0,
          creditHour: parseFloat(creditHour! || "0") || 0,
          symbol: symbol?.trim() || "",
        });
      }
    }
  }

  return disciplines;
}

export function extractCreditHourSummary(text: string): CreditHourSummary {
  const summary: CreditHourSummary = {
    requiredHours: 0,
    completedHours: 0,
    optionalRequiredHours: 0,
    optionalCompletedHours: 0,
    optionalPendingHours: 0,
  };

  const totalPattern = /Carga Horária Total\s+(\d+)\s+(\d+)/;
  const totalMatch = text.match(totalPattern);
  if (totalMatch) {
    summary.requiredHours = parseInt(totalMatch[1], 10);
    summary.completedHours = parseInt(totalMatch[2], 10);
  }

  const optionalPattern =
    /Carga Horária Optativa\s+(\d+)\s+(\d+)\s+\d+\s+(\d+)/;
  const optionalMatch = text.match(optionalPattern);
  if (optionalMatch) {
    summary.optionalRequiredHours = parseInt(optionalMatch[1], 10);
    summary.optionalCompletedHours = parseInt(optionalMatch[2], 10);
    summary.optionalPendingHours = parseInt(optionalMatch[3], 10);
  }

  return summary;
}

export function extractPendingCourses(text: string): PendingCourse[] {
  const pendingCourses: PendingCourse[] = [];
  const startMarker = "Componentes Curriculares Obrigatórios Pendentes";
  const startIndex = text.indexOf(startMarker);

  if (startIndex === -1) {
    return [];
  }

  let relevantText = text.substring(startIndex + startMarker.length);
  const endMarker = "Equivalências:";
  const endIndex = relevantText.indexOf(endMarker);
  if (endIndex !== -1) {
    relevantText = relevantText.substring(0, endIndex);
  }

  const coursePattern = /([A-Z]{2,3}\d{4,})\s+(.*?)\s+(\d+)\s*h/g;
  let match;
  while ((match = coursePattern.exec(relevantText)) !== null) {
    pendingCourses.push({
      code: match[1].trim(),
      name: match[2].trim(),
      creditHour: parseInt(match[3], 10),
    });
  }

  return pendingCourses.sort((a, b) => a.name.localeCompare(b.name));
}

function toTitleCase(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getStudentName(text: string): string {
  const regex = /\b\d+\s+([A-ZÀ-Ü\s]+?)\s+Nome:/;
  const match = text.match(regex);

  return match ? toTitleCase(match[1].trim()) : "";
}
