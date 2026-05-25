import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ========================
  // API ENDPOINTS
  // ========================

  // Poetic description generator endpoint
  app.post("/api/gemini/poetic-description", async (req, res) => {
    try {
      const { name, category, notes } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Product name is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback description if key is not configured yet
        return res.json({
          description: `Handcrafted premium artisan ${category || 'aroma product'} infused with exquisite organic notes of ${notes || name}. Elegantly created to soothe your senses and elevate your space.`
        });
      }

      const prompt = `You are an expert artisan perfumer and boutique luxury copywriter for aroma products (wax sachets, wax melts, squeeze creams). Write an exquisite, highly enticing, poetic, and professional product description in US English for a product named '${name}' of category '${category || "aroma sachet"}' with scent notes/vibes/benefits: '${notes || "lavender, soothing, relaxing"}'. Keep it around 3-4 sentences. Focus on luxury, sensory imagery, natural ingredients, and hand-crafted botanical beauty. Speak directly to premium buyers. IMPORTANT: Do NOT make any references to candles or candle-making, as this brand is exclusively focused on botanical wax sachets, melts, and squeeze creams.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const description = response.text?.trim() || "";
      res.json({ description });
    } catch (error: any) {
      console.error("Error in poetic description:", error);
      res.status(500).json({ error: error?.message || "Failed to generate description" });
    }
  });

  // Aroma Sommelier personalized advisor and blend generator
  app.post("/api/gemini/aroma-sommelier", async (req, res) => {
    try {
      const { userPrompt, intensity, catalog } = req.body;
      if (!userPrompt) {
        return res.status(400).json({ error: "User vibe prompt is required" });
      }

      const scentIntensity = intensity || "Medium";
      const availableCatalog = catalog || [];

      if (!process.env.GEMINI_API_KEY) {
        // Fallback response if key is missing
        return res.json({
          explanation: `L'Aroma Sommelier recommends creating a comforting, cozy ambiance suitable for your vision. We suggest blending warm lavender and light herbs for an artisanal aromatic wellness feeling.`,
          recommendations: availableCatalog.slice(0, 2).map((p: any) => ({
            id: p.id,
            name: p.name,
            fitReason: "An elegant bestseller in our boutique that complements cozy feelings perfectly."
          })),
          synergyTip: "Place wax melts in a lukewarm burner near your reading nook, and hang wax sachets in nearby linen drawers for a continuous luxury layer.",
          customBlend: {
            name: "Artisan Coziness Custom Blend",
            notes: "Amber Resin, Organic Vanilla Pod, Sun-Dried Lavender",
            explanation: "A custom bespoke blend crafted dynamically to coordinate premium wax notes with your requested mood."
          }
        });
      }

      const systemPrompt = `You are a master French Aroma Sommelier ('L'Aroma Sommelier'). 
A customer is looking for a personalized aromatic atmosphere, describing their desired vibe as: '${userPrompt}' with an intensity setting: '${scentIntensity}'.
Analyze our hand-crafted artisan catalog: ${JSON.stringify(availableCatalog)}.

Return a completely translated English recommendation guide containing:
1. A poetic, sensory, beautifully written explanation that describes the atmosphere and why these scents create a magical aesthetic matching their requested intensity.
2. Exact matching products from our catalog (recommend 1 to 2 items if matches exist, or state why another is appropriate).
3. A 'Scent Synergy Tip' instructing on how to combine these melts, sachets, or creams to overdeliver on ambiance.
4. A 'Signature Custom Blend' suggestion: a custom-curated bespoke melt/sachet blend styled beautifully with a custom title (e.g. 'Golden Hearth & Woodsmoke Sachet') containing custom high-end ingredients, which our shop can blend specifically for them.

You MUST respond strictly in JSON matching the responseSchema format provided. Keep all sensory descriptions sophisticated, welcoming, and high-value.
CRITICAL: You are strictly forbidden from recommending or referencing candles, wicks, flames, or candle burning. All instructions and recommendations must refer exclusively to wax sachets, wax melts, or squeeze wax melts/creams (e.g., using electric or warm tealight wax melters, hanging sachets in drawers/closets, etc.).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { 
                type: Type.STRING,
                description: "Poetic sensory explanation tailored to their prompt and scent intensity."
              },
              recommendations: {
                type: Type.ARRAY,
                description: "List of recommended products from the active catalog.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    fitReason: { type: Type.STRING }
                  },
                  required: ["id", "name", "fitReason"]
                }
              },
              synergyTip: { 
                type: Type.STRING, 
                description: "Artistic suggestions on how to place, burn, or layer fragrance products."
              },
              customBlend: {
                type: Type.OBJECT,
                description: "A custom scent blend recommendation tailored exclusively for this dream vibe.",
                properties: {
                  name: { type: Type.STRING, description: "A gorgeous luxury name for the custom blend." },
                  notes: { type: Type.STRING, description: "Scent notes (e.g. Warm Tobacco Leaf, Coastal Eucalyptus)." },
                  explanation: { type: Type.STRING, description: "Poetic justification of how this custom blend answers their vibe." }
                },
                required: ["name", "notes", "explanation"]
              }
            },
            required: ["explanation", "recommendations", "synergyTip", "customBlend"]
          }
        }
      });

      const responseText = response.text?.trim() || "{}";
      const sommelierData = JSON.parse(responseText);
      res.json(sommelierData);
    } catch (error: any) {
      console.error("Error in aroma sommelier endpoint:", error);
      res.status(500).json({ error: error?.message || "Failed to fetch sommelier consultation" });
    }
  });

  // ========================
  // MIDDLEWARES & DEV TOOLS
  // ========================

  // Vite middleware for development or fallback static serve for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AromaPRO Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
