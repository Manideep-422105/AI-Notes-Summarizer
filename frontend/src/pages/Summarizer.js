import React, { useState, useEffect } from "react";
import {
  generateSummary,
  editSummary,
  shareSummary,
  fetchSummaries,
  deleteSummary,
} from "../api"; // Make sure this path is correct
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Summarizer() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("Summarize in bullet points");
  const [summary, setSummary] = useState("");
  const [summaryId, setSummaryId] = useState(null);
  const [recipients, setRecipients] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    loadSummaries();
  }, []);

  async function loadSummaries() {
    try {
      const data = await fetchSummaries();
      setSummaries(data);
    } catch (err) {
      console.warn("Could not fetch summaries on load:", err.message);
    }
  }

  async function handleGenerate() {
    if (!transcript.trim()) {
      return toast.warn("Please enter a transcript first.");
    }
    setLoading(true);
    try {
      const res = await generateSummary(transcript, prompt);
      setSummary(res.summary);
      setSummaryId(res.id);
      toast.success("Summary generated ✅");
      await loadSummaries();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit() {
    if (!summaryId) return toast.warn("Generate or load a summary first.");
    try {
      await editSummary(summaryId, summary);
      toast.success("Summary updated ✅");
      await loadSummaries();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleShare() {
    if (!summaryId) return toast.warn("Generate or load a summary first.");
    const emails = recipients
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    if (!emails.length) return toast.warn("Please enter at least one recipient email.");

    const sendingToastId = toast.loading("Sending email...");

    try {
      await shareSummary(summaryId, emails);
      toast.update(sendingToastId, {
        render: "Email sent successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setRecipients("");
    } catch (err) {
      toast.update(sendingToastId, {
        render: err.message,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  }

  async function handleDelete(idToDelete) {
    if (!window.confirm("Are you sure you want to delete this summary?")) return;
    try {
      await deleteSummary(idToDelete);
      if (summaryId === idToDelete) {
        setSummary("");
        setSummaryId(null);
      }
      toast.success("Summary deleted ✅");
      await loadSummaries();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function loadFromHistory(item) {
    setSummary(item.summary);
    setSummaryId(item._id);
    toast.info(
      `Loaded summary from ${new Date(item.createdAt).toLocaleString()}`
    );
  }

  return (
    <div className="container">
      <h1>AI Meeting Notes Summarizer</h1>

      <div className="main-content">
        <div className="left-panel">
          <label htmlFor="transcript-area">Transcript:</label>
          <textarea
            id="transcript-area"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
          />

          <label htmlFor="prompt-input">Custom Prompt:</label>
          <input
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Summarize in bullet points"
          />

          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Summary"}
          </button>

          <label htmlFor="summary-area">Summary:</label>
          <textarea
            id="summary-area"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Generated summary will appear here..."
          />

          <div className="actions">
            <button onClick={handleEdit}>Save Edits</button>
            <input
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="recipient1@mail.com, recipient2@mail.com"
            />
            <button onClick={handleShare}>Share via Email</button>
          </div>
        </div>

        <div className="right-panel">
          <h3>Summary History</h3>
          <ul>
            {summaries.length > 0 ? (
              summaries.map((item) => (
                <li
                  key={item._id}
                  className={summaryId === item._id ? "selected" : ""}
                >
                  <div className="history-item-content" onClick={() => loadFromHistory(item)}>
                    <p>
                      <strong>{item.summary.slice(0, 50)}...</strong>
                    </p>
                    <small>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <button onClick={() => handleDelete(item._id)} className="delete-btn">
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>No summaries yet.</p>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        /* --- Base Styles --- */
        .container { max-width: 1200px; margin: auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        h1 { text-align: center; margin-bottom: 30px; color: #333; }
        .main-content { display: flex; flex-wrap: wrap; gap: 30px; }
        .left-panel { flex: 2; min-width: 400px; display: flex; flex-direction: column; gap: 15px; }
        .right-panel { flex: 1; min-width: 300px; border-left: 1px solid #e0e0e0; padding-left: 20px; }
        label { font-weight: bold; color: #555; }
        textarea, input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
        textarea { min-height: 120px; resize: vertical; }
        button { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; background-color: #007bff; color: white; font-size: 1rem; transition: background-color 0.2s; }
        button:disabled { background-color: #a0cfff; cursor: not-allowed; }
        button:hover:not(:disabled) { background-color: #0056b3; }
        .actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .actions input { flex: 1; }
        h3 { margin-top: 0; }
        ul { list-style: none; padding: 0; max-height: 600px; overflow-y: auto; }
        li { border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin-bottom: 10px; position: relative; background: #fff; display: flex; justify-content: space-between; align-items: center; }
        li.selected { background: #e7f3ff; border-color: #007bff; }
        .history-item-content { cursor: pointer; flex-grow: 1; }
        .delete-btn { position: static; padding: 4px 8px; font-size: 0.8em; background: #dc3545; }
        .delete-btn:hover { background: #c82333; }

        @media (max-width: 768px) {
          .container {
            padding: 15px; 
          }
          h1 {
            font-size: 1.6rem; 
          }
          .main-content {
            flex-direction: column;
          }
          .left-panel, .right-panel {
            min-width: 100%; 
          }
          .right-panel {
            border-left: none; 
            padding-left: 0;
            border-top: 1px solid #e0e0e0; 
            padding-top: 20px;
            margin-top: 20px;
          }
          .actions {
            flex-direction: column;
            align-items: stretch; 
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default Summarizer;