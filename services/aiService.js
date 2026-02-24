const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function classifyAndSummarize(transcript) {
  return {
    status: "Answered",
    summary: "User answered the call. Basic interaction occurred."
  }
}

// async function classifyAndSummarize(transcript) {
//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: "Return structured JSON only."
//       },
//       {
//         role: "user",
//         content: `
// Classify this call into one of:
// Answered
// No Answer
// Interested
// Not Interested

// Also provide a short 2-3 line summary.

// Transcript:
// ${transcript}

// Return JSON:
// {
//   "status": "",
//   "summary": ""
// }
// `
//       }
//     ],
//     response_format: { type: "json_object" }
//   })

//   return JSON.parse(completion.choices[0].message.content)
// }

module.exports = { classifyAndSummarize }