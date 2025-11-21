import OpenAI from "openai";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const textToSpeechController = catchAsync(async (req, res) => {
  const { text, voice = "coral", instructions } = req.body;

  if (!text) {
    throw new ApiError(400, "Text is required");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new ApiError(500, "OpenAI API key is not configured");
  }

  // Valid voice options
  const validVoices = [
    "alloy",
    "ash",
    "ballad",
    "coral",
    "echo",
    "fable",
    "onyx",
    "nova",
    "shimmer",
    "sage",
  ];

  if (!validVoices.includes(voice)) {
    throw new ApiError(400, `Invalid voice. Must be one of: ${validVoices.join(", ")}`);
  }

  try {
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice,
      input: text,
      instructions: instructions || "Speak naturally and clearly.",
      response_format: "mp3", // Using MP3 for better browser compatibility
    });

    // Get the audio buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Set headers for audio response
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Content-Disposition", 'inline; filename="speech.mp3"');
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "no-cache");

    // Send the audio buffer
    res.send(buffer);
  } catch (error) {
    console.error("OpenAI TTS Error:", error);
    throw new ApiError(500, `Failed to generate speech: ${error.message}`);
  }
});

