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
    if (import.meta.env.NODE_ENV === "development") console.error("Error sending notification to API da Vercel:", error);
  }
};
