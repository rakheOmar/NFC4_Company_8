import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { CHATBOT_PERSONA } from "../constants.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const handleChat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  const user = req.user;

  if (!message || message.trim() === "") {
    throw new ApiError(400, "Message is required");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const systemPrompt = `
      ${CHATBOT_PERSONA}

      The user you are currently talking to is named ${user.fullName}. Please address them by their name when appropriate to make the conversation more personal.
    `;

  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            {
              text: `Hello ${user.fullName}! I'm Nexus, your personal assistant for this platform. How can I help you today?`,
            },
          ],
        },
        ...(history || []),
      ],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json(new ApiResponse(200, "Reply sent successfully", { reply: text }));
  } catch (error) {
    console.error("Error communicating with Google AI:", error);
    throw new ApiError(500, "Failed to get a response from the AI service.", [], error.stack);
  }
});

const handleAISuggestion = asyncHandler(async (req, res) => {
  const { logs, incidents, carbonFootprint, airQualityChart } = req.body;
  const user = req.user;

  // Basic validation
  if (!logs || !incidents || carbonFootprint === undefined || !airQualityChart) {
    throw new ApiError(400, "Required simulation data missing");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  // --- MODIFIED SYSTEM PROMPT FOR HTML OUTPUT ---
  // This prompt now explicitly asks for an HTML response with specific Tailwind CSS classes.
  const systemPrompt = `
You are an AI assistant acting as a mine operations efficiency consultant. Your task is to analyze simulation data and provide actionable recommendations.

**IMPORTANT: Your entire response MUST be a single block of HTML formatted with Tailwind CSS.** Do not include any text, markdown, or backticks outside the main HTML container.

Use the following structure and classes:
- Main container: <div class="space-y-4 text-sm">
- Each recommendation: <div class="p-4 border rounded-lg bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
- Recommendation title: <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-1">🔍 Recommendation Title</h3>
- Recommendation description: <p class="text-slate-600 dark:text-slate-400">Detailed explanation of the recommendation.</p>

Here is a perfect example of the required output format:
<div class="space-y-4 text-sm">
  <div class="p-4 border rounded-lg bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
    <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-1">🔍 Optimize Haul Truck Routes</h3>
    <p class="text-slate-600 dark:text-slate-400">The simulation showed significant idle time for haul trucks. Consider analyzing GPS data to create more direct routes between the loading pit and the crusher to reduce fuel consumption and increase cycle times.</p>
  </div>
  <div class="p-4 border rounded-lg bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
    <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-1">🛡️ Enhance PPE Adherence Monitoring</h3>
    <p class="text-slate-600 dark:text-slate-400">Multiple PPE violations were noted. Implementing real-time alerts for helmet removal, especially for workers with high fatigue levels like those identified in the logs, could prevent potential safety incidents.</p>
  </div>
</div>

Now, analyze the user's data and generate your response in this exact HTML format.
`;

  const userMessage = `
Here is the simulation summary for my analysis. Please provide your recommendations in the specified HTML format.

- User to address: ${user.fullName}
- Carbon Footprint: ${carbonFootprint} kg CO2
- Incident Count: ${incidents.length}
- Sample Logs: ${logs ? logs.slice(0, 5).join(" | ") : "(none)"}
- Incidents: ${
    incidents
      ? incidents
          .slice(0, 3)
          .map((inc) => `[${inc.type}]`)
          .join(", ")
      : "(none)"
  }
`;

  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        {
          role: "model",
          parts: [{ text: "Understood. I will provide my analysis in the specified HTML format." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500, // Increased tokens slightly for HTML structure
        temperature: 0.6, // Adjust for creativity vs. consistency
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const suggestionsHtml = response.text();

    // Clean up potential markdown backticks from the response, just in case
    const cleanedHtml = suggestionsHtml.replace(/```html|```/g, "").trim();

    return res
      .status(200)
      .json(new ApiResponse(200, "AI suggestions generated", { suggestions: cleanedHtml }));
  } catch (error) {
    console.error("Error communicating with Google AI (suggestions):", error);
    throw new ApiError(500, "Failed to get AI suggestions from the service.", [], error.stack);
  }
});

export { handleChat, handleAISuggestion };