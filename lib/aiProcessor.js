import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractProductInfoFromImage(imageUrl) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Ini adalah foto menu makanan/minuman. Ekstrak informasi berikut dalam format JSON: name, description, price. Hanya kembalikan JSON tanpa penjelasan apapun. Format: {\"name\": \"string\", \"description\": \"string\", \"price\": number}"
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback data jika AI tidak bisa mengekstrak
    return {
      name: "Product Name",
      description: "Product description",
      price: 25000
    };
  } catch (error) {
    console.error("AI Processing error:", error);
    return {
      name: "New Product",
      description: "Automatically extracted product",
      price: 20000
    };
  }
}
