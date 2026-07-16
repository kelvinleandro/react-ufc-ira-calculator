import type { CourseSuggestion } from "@/types/course";

export const notifyCourseSuggestion = async (course: CourseSuggestion) => {
  try {
    const res = await fetch("/api/discord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: course.name,
        mean: course.mean,
        std: course.std,
        proof: course.proof,
      }),
    });

    if (!res.ok) {
      throw new Error(`API responded with ${res.status}`);
    }
  } catch (error) {
    console.error("Erro ao enviar notificação para a API da Vercel:", error);
  }
};
