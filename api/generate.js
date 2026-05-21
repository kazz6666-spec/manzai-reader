export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { text, mode } = req.body || {};

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: "あなたは漫才変換専門AIです。必ずJSONだけを返してください。"
          },
          {
            role: "user",
            content: `入力文を漫才風に変換してください。mode=${mode} 入力=${text}`
          }
        ],
        text: {
          format: {
            type: "json_object"
          }
        }
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        error: "OpenAI API error",
        detail: data
      });
    }

    const parsed = JSON.parse(data.output_text);

    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({
      error: "AI生成失敗",
      detail: String(e)
    });
  }
}
