export async function streamChat(
  prompt: string,
  onToken: (t: string) => void
) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  let res: Response;
  try {
    res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });
  } catch (err) {
    console.error("streamChat fetch failed:", err);
    throw err;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`LLM request failed: ${res.status} ${text}`);
    console.error(err);
    throw err;
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");
  const decoder = new TextDecoder();

  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const part = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 2);

      for (const line of part.split(/\r?\n/)) {
        if (!line.startsWith("data:")) continue;
        const data = line.replace(/^data:\s*/, "");
        if (data === "[DONE]") return;
        onToken(data);
      }
    }
  }
}
