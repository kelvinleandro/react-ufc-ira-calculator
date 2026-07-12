import type { CourseSuggestion } from "@/types/course";

export const notifyCourseSuggestion = async (course: CourseSuggestion) => {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const formData = new FormData();
    formData.append(
      "payload_json",
      JSON.stringify({
        content: `🚨 **Nova Sugestão de Curso!**\n**Curso:** ${course.name}\n**Média:** ${course.mean}\n**Desvio Padrão:** ${course.std}`,
      }),
    );

    // Convert Base64 data URL to a File/Blob
    if (course.proof && course.proof.startsWith("data:")) {
      const parts = course.proof.split(",");
      const mimeType = parts[0].match(/:(.*?);/)?.[1] || "image/png";
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mimeType });
      formData.append("file", blob, "comprovante.png");
    }

    await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Erro ao enviar notificação para o Discord:", error);
  }
};
