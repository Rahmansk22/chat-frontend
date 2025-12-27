export async function sendMessage(prompt: string) {
  const url = `${API_BASE_URL}/chat`;

  // Ensure `fetch` is available in the current runtime. If not, surface a
  // clear error so it's obvious this must run in a browser or Node 18+.
  if (typeof fetch !== "function") {
    throw new Error(
      "Global `fetch` is not available in this runtime. Call sendMessage from the browser or run Node 18+ (or polyfill fetch)."
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prompt }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `API request failed: ${res.status} ${res.statusText} - ${text}`
    );
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`Failed to parse JSON response: ${text}`);
  }
}

// Create a new chat for the logged-in user (JWT required)
export async function createChat(token: string) {
  const url = `${API_BASE_URL}/chats`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
}

// Get all chats for the logged-in user (JWT required)
export async function getChats(token: string) {
  const url = `${API_BASE_URL}/chats`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json();
}

// Get all messages for a chat
export async function getMessages(chatId: string, token: string) {
  const url = `${API_BASE_URL}/chats/${chatId}/messages`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

// Send a message to a chat
export async function sendMessageToChat(
  chatId: string,
  token: string,
  content: string
) {
  const url = `${API_BASE_URL}/chats/${chatId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: content }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to send message: ${res.status} ${text}`);
  }
  return res.json();
}

// Get current user profile

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function getProfile(token: string) {
  const url = `${API_BASE_URL}/api/auth/profile`;
  console.log("[getProfile] Endpoint:", url);
  console.log("[getProfile] Token:", token);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[getProfile] Failed: ${res.status} ${text}`);
    throw new Error("Failed to fetch profile");
  }
  return res.json();
}

// Delete all chats for the user (requires auth token)
export async function deleteAllChats(token: string) {
  const url = `${API_BASE_URL}/chats`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete chats");
  return res.json();
}
