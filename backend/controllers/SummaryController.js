require("dotenv").config();
const Groq = require("groq-sdk");
const Summary = require("../models/Summary");
const transporter = require("../config/email");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateSummary = async (req, res) => {
  const { transcript, prompt } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that summarizes meeting notes based on the following instruction: ${prompt}`,
        },
        { role: "user", content: transcript },
      ],
      model: "llama3-8b-8192",
    });

    const generatedSummary = completion.choices[0].message.content;

    const newSummary = new Summary({
      transcript,
      prompt,
      summary: generatedSummary,
    });
    await newSummary.save();

    res.json({ id: newSummary._id, summary: generatedSummary });
  } catch (err) {
    res.status(500).json({ error: "Error generating summary" });
  }
};

exports.editSummary = async (req, res) => {
  const { id } = req.params;
  const { summary } = req.body;

  try {
    const updated = await Summary.findByIdAndUpdate(
      id,
      { summary },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Summary not found" });
    res.json({ summary: updated.summary });
  } catch (err) {
    res.status(500).json({ error: "Error editing summary" });
  }
};

exports.shareSummary = async (req, res) => {
  const { id } = req.params;
  const { recipients } = req.body;

  try {
    const doc = await Summary.findById(id);
    if (!doc) return res.status(404).json({ error: "Summary not found" });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: recipients.join(","),
      subject: "Meeting Summary",
      text: doc.summary,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error sending email" });
  }
};

exports.getSummaries=async(req,res)=>{
  try{
    const summaries=await Summary.find().sort({createdAt:-1});
    res.json(summaries);
  }catch(err){
    res.status(500).json({
      status:"false",
      error:err.message
    })
  }
}

exports.deleteSummaries=async(req,res)=>{
  const {id}=req.params;
  try{
    const deleted=await Summary.findByIdAndDelete(id);
    if(!deleted){
      return res.status(404).json({
        error:"Summary not found"
      });
    }
    res.json({
      message:"Summary deleted"
    })
  }catch(err){
    res.status(500).json({
      error:"Error deleting summary"
    });
  }
}