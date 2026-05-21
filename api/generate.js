export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { text, mode } = req.body || {};

  const prompt = `
あなたは漫才変換専門AIです
入力文をもとにJSONだけ返してください

{
  "items": [
    {"role":"ボケ","text":"..."},
    {"role":"ツッコミ","text":"..."},
    {"role":"本人談","text":"..."},
    {"role":"改善コメント","text":"..."}
  ]
}

条件
日本語
短くテンポよく
皮肉は愛ある範囲
mode ${mode}

入力
${text}
`;

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const data = await r.json();
    const raw = data.output_text || "{}";
    const parsed = JSON.parse(raw);

    res.status(200).json(parsed);

  } catch (e) {
    res.status(500).json({
      error: "AI生成失敗",
      detail: String(e)
    });
  }
}
