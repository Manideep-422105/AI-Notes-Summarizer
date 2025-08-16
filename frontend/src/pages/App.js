import React, { useState } from "react";
import "./App.css";

function App() {
  // State for inputs
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState(
    "Summarize in bullet points for executives."
  );
  const [recipients, setRecipients] = useState("");

  // State for data returned from backend
  const [summaryText, setSummaryText] = useState("");
  const [summaryId, setSummaryId] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // --- API HANDLERS ---

  const handleGenerateSummary = async () => {
    if (!transcript.trim() || !prompt.trim()) {
      setMessage({
        text: "Please provide both a transcript and a prompt.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(
        "http://localhost:4545/api/v1/summary/generate",
        {
          // Proxied request
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, prompt }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to generate summary.");

      setSummaryText(data.summary);
      setSummaryId(data.id); // Save the ID from the backend
      setMessage({ text: "Summary generated successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdits = async () => {
    if (!summaryId) return;
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`http://localhost:4545/api/v1/summary/edit/${summaryId}`, {
        // Use the saved ID
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: summaryText }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save edits.");

      setMessage({ text: "Edits saved successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareEmail = async () => {
    if (!summaryId || !recipients.trim()) {
      setMessage({
        text: "Please provide at least one recipient email.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    // Convert comma-separated string to an array of trimmed emails
    const recipientArray = recipients.split(",").map((email) => email.trim());

    try {
      const response = await fetch(`http://localhost:4545/api/v1/summary/share/${summaryId}`, {
        // Use the saved ID
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: recipientArray }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send email.");

      setMessage({ text: "Email sent successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>📝 AI Meeting Summarizer</h1>

      <div className="form-group">
        <label htmlFor="transcript">Paste Meeting Transcript</label>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your raw meeting notes or call transcript here..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="prompt">Custom Instruction / Prompt</label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <button onClick={handleGenerateSummary} disabled={isLoading}>
        {isLoading ? "Generating..." : "✨ Generate Summary"}
      </button>

      {/* --- Conditionally render the summary and sharing section --- */}
      {summaryId && (
        <div className="summary-section">
          <h2>Generated Summary (Editable)</h2>
          <textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)} // Allow editing
            className="summary-output"
            rows="15"
          />
          <button
            onClick={handleSaveEdits}
            disabled={isLoading}
            className="save-btn"
          >
            {isLoading ? "Saving..." : "💾 Save Edits"}
          </button>

          <div className="share-section form-group">
            <label htmlFor="recipients">
              Share via Email (comma-separated)
            </label>
            <input
              type="email"
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="friend1@example.com, colleague@example.com"
            />
            <button
              onClick={handleShareEmail}
              disabled={isLoading}
              className="share-btn"
            >
              {isLoading ? "Sending..." : "📧 Send Email"}
            </button>
          </div>
        </div>
      )}

      {/* --- Message/Notification Area --- */}
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}

export default App;
