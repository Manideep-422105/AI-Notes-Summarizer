const BASE_URL = "https://ai-notes-summarizer-5qok.onrender.com";

export async function generateSummary(transcript, prompt) {
  const res = await fetch(`${BASE_URL}/summary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, prompt }),
  });
  if (!res.ok) throw new Error("Error generating summary");
  return res.json();
}

export async function editSummary(id, summary) {
  const res = await fetch(`${BASE_URL}/summary/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary }),
  });
  if (!res.ok) throw new Error("Error editing summary");
  return res.json();
}

export async function shareSummary(id, recipients) {
  const res = await fetch(`${BASE_URL}/summary/share/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipients }),
  });
  if (!res.ok) throw new Error("Error sharing summary");
  return res.json();
}
export async function fetchSummaries() {
  const res = await fetch(`${BASE_URL}/summary/summaries`);
  // if (!res.ok) throw new Error("Error fetching summaries");
  return res.json();
}

export async function deleteSummary(id) {
  const res = await fetch(`${BASE_URL}/summary/deleteSummaries/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error deleting summary");
  return res.json();
}
