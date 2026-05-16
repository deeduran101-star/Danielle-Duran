import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeRhetoric(text: string) {
  const prompt = `
    Analyze the following text using a professional academic/legal framework. 
    Break down the rhetorical appeals into three structured sections:
    
    1. ETHOS: How does the author establish credibility or authority?
    2. PATHOS: What emotional triggers or connections are being made?
    3. LOGOS: What is the logical structure, and what evidence is being used?
    
    Keep the analysis sharp, academic, and insightful. Format the response in Markdown.
    
    Text to analyze:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Could not analyze text. Please check your API key.");
  }
}

export async function generateArtifactImage(title: string, summary: string) {
  const prompt = `
    Generate a professional academic visual representation for a sociology research project.
    Title: "${title}"
    Summary: "${summary}"
    Aesthetic: Professional research symposium poster style, clean, minimalist, high-end scholarly design. 
    Color Palette: Deep stone, muted gold, or professional academy colors. 
    Avoid cluttered text, focus on a conceptual visual metaphor or a clean infographic-style layout.
    High quality, 16:9 aspect ratio.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image part found in model response.");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
}

export async function getAssistantResponse(history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const systemInstruction = `
    You are the AI Research Assistant for Danielle Duran's Academic E-Portfolio.
    
    Context about Danielle:
    - She is a Sociology Major about to earn her Bachelor's degree at Sacramento State and an aspiring Youth Advocate.
    - She has lived experience in the foster care and juvenile justice systems, which drives her passion for reform.
    - Her research themes include: Institutional Inequality, Judicial Transparency, Labeling Theory, and Youth Emotional Resources.
    - Key papers: "From Adversity to Advocacy", "Why Judicial Chambers Exist" (Current Project Pipeline), "Unwritten Thoughts", and "Fairness on Trial".
    - Future Research Roads: Currently in the 'Brainstorming phase' (GPT-Assisted Ideation). The primary project is "Project Pipeline: Judicial Chambers Transparency".
    - Goal of Future Research: To investigate the spatial sociology of courtrooms, specifically focusing on the non-public nature of judicial chambers (the "Black Box" of deliberation) and its impact on civic trust and procedural fairness.
    - Key proposed reforms in Future Research: Civic Juror Preparation Reform (CJPR) and Chambers Transparency Minimum (CTM).
    
    Your tone: Professional, scholarly, empathetic, and encouraging.
    Your goal: Help visitors understand Danielle's work, goals, and academic journey.
    
    If they ask about a specific paper or the "Future Research" tab, summarize the content based on her themes of systemic reform, spatial sociology, and emotional intelligence in advocacy. Mention the status of projects (e.g., in progress vs. completed).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts
      })),
      config: {
        systemInstruction: systemInstruction
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Assistant unavailable.");
  }
}
