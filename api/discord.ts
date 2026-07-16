export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // A Vercel lerá esta variável sem o VITE_ do seu painel
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: 'Discord webhook URL not configured' }), { status: 500 });
  }

  try {
    const body = await req.json();
    const { name, mean, std, proof } = body;

    const formData = new FormData();
    formData.append(
      "payload_json",
      JSON.stringify({
        content: `🚨 **Nova Sugestão de Curso!**\n**Curso:** ${name}\n**Média:** ${mean}\n**Desvio Padrão:** ${std}`,
      })
    );

    // O Frontend nos manda um Base64, e nós convertemos para Blob aqui no servidor
    if (proof && proof.startsWith("data:")) {
      const parts = proof.split(",");
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

    // Dispara a requisição oficial para o Discord, blindada de quem está no navegador
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });

    if (!discordRes.ok) {
      throw new Error(`Discord API error: ${discordRes.statusText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending to Discord:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
