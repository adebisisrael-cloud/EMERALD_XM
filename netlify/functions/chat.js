// 🔑 REPLACE THIS WITH YOUR KEY FROM build.nvidia.com (STEP 2 ABOVE)
// REPLACE THE HARDCODDED LINE WITH THIS:
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;  // ← SAFE! Netlify injects this at runtime

exports.handler = async (event) => {
  try {
    const { prompt } = JSON.parse(event.body);
    
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "nvidia/llama-3-8b-instruct", // Free Llama 3 8B on NVIDIA NIM
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 512
        })
      }
    );

    if (!response.ok) throw new Error(`NVIDIA API error: ${response.status}`);
    
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        response: data.choices[0]?.message?.content || "Sorry, I couldn't generate a response." 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ response: `Server error: ${error.message}` })
    };
  }
};
