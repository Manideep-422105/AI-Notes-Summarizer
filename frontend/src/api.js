const BASE_URL = "https://ai-notes-summarizer-5qok.onrender.com";

async function handleResponse(res) {
  const text = await res.text();
  if (!res.ok) {
    try {
      const data = JSON.parse(text); 
      throw new Error(data.error || JSON.stringify(data));
    } catch {
      throw new Error(text || "Unknown error from server");
    }
  }
  try {
    return JSON.parse(text); 
  } catch {
    return text; 
  }
}

export async function generateSummary(transcript, prompt) {
  const res = await fetch(`${BASE_URL}/api/v1/summary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, prompt }),
  });
  return handleResponse(res);
}

export async function editSummary(id, summary) {
  const res = await fetch(`${BASE_URL}/api/v1/summary/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary }),
  });
  return handleResponse(res);
}

export async function shareSummary(id, recipients) {
  const res = await fetch(`${BASE_URL}/api/v1/summary/share/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipients }),
  });
  return handleResponse(res);
}

export async function fetchSummaries() {
  const res = await fetch(`${BASE_URL}/api/v1/summary/summaries`);
  return handleResponse(res);
}

export async function deleteSummary(id) {
  const res = await fetch(`${BASE_URL}/api/v1/summary/deleteSummaries/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
