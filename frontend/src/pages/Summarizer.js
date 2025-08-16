import React, { useState, useEffect } from "react";
import {
  generateSummary,
  editSummary,
  shareSummary,
  fetchSummaries,
  deleteSummary,
} from "../api";
import { ToastContainer, toast } from "react-toastify";
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
    setLoading(true);
    try {
      const res = await generateSummary(transcript, prompt);
      setSummary(res.summary);
      setSummaryId(res.id);
      toast.success("Summary generated");
      await loadSummaries();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit() {
    if (!summaryId) return toast.warn("Generate a summary first.");
    try {
      await editSummary(summaryId, summary);
      toast.success("Summary updated ✅");
      await loadSummaries();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleShare() {
    if (!summaryId) return toast.warn("Generate a summary first.");
    const emails = recipients
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    if (!emails.length) return toast.warn("Enter at least one email.");

    const sendingToastId = toast.info("Sending email...", {
      autoClose: false,
      closeOnClick: false,
    });

    try {
      await shareSummary(summaryId, emails);
      toast.dismiss(sendingToastId);
      toast.success("Email sent ✅");
    } catch (err) {
      toast.dismiss(sendingToastId);
      toast.error(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this summary?"))
      return;
    try {
      await deleteSummary(id);
      if (summaryId === id) {
        setSummary("");
        setSummaryId(null);
      }
      toast.success("Summary deleted");
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
          <label>Transcript:</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript..."
          />

          <label>Custom Prompt:</label>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Summarize in bullet points"
          />

          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Summary"}
          </button>

          <label>Summary:</label>
          <textarea
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
            {summaries.map((item) => (
              <li
                key={item._id}
                className={summaryId === item._id ? "selected" : ""}
              >
                <div onClick={() => loadFromHistory(item)}>
                  <p>
                    <strong>{item.summary.slice(0, 50)}...</strong>
                  </p>
                </div>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
      />

      <style>{`
        .container {
          max-width: 1000px;
          margin: auto;
          padding: 20px;
          font-family: sans-serif;
        }
        h1 { text-align: center; margin-bottom: 20px; }
        .main-content {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .left-panel {
          flex: 2;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        textarea {
          width: 100%;
          min-height: 80px;
          padding: 8px;
          resize: vertical;
        }
        input {
          width: 100%;
          padding: 8px;
        }
        button {
          padding: 8px 12px;
          margin-top: 5px;
          cursor: pointer;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .right-panel {
          flex: 1;
          min-width: 200px;
          border-left: 1px solid #ccc;
          padding-left: 10px;
        }
        ul { list-style: none; padding: 0; max-height: 500px; overflow-y: auto; }
        li {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 10px;
          position: relative;
          background: #fff;
        }
        li.selected { background: #f0f8ff; }
        li button {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 4px 6px;
          font-size: 0.8em;
          background: #ff4d4f;
          color: #fff;
          border: none;
          border-radius: 4px;
        }
        @media (max-width: 768px) {
          .main-content { flex-direction: column; }
          .right-panel { border-left: none; padding-left: 0; }
        }
      `}</style>
    </div>
  );
}

export default Summarizer;
