import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

export async function summarizeText(cleanedText) {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `imagine you are students buddy, you help them summerise this data and provide it in pretty format : ${cleanedText}`,
  });
  //console.log(response.text);
  return response.text;
}

export default summarizeText;
