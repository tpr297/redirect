const LINK_URL = "https://tpr297.github.io/redirect/link.txt";
const CACHE_TTL = 10 * 60; 


let cachedLinks = null;
let cachedAt = 0;

export default {
  async fetch(request, env) {
    const now = Date.now();

    
    if (cachedLinks && now - cachedAt < CACHE_TTL * 1000) {
      return new Response(cachedLinks, {
        headers: { "Content-Type": "text/plain" }
      });
    }

    try {
      const response = await fetch(LINK_URL, { cf: { cacheTtl: 0 } });
      if (!response.ok) throw new Error("Failed to fetch links");

      const text = await response.text();
      cachedLinks = text;
      cachedAt = now;

      return new Response(text, {
        headers: { "Content-Type": "text/plain" }
      });
    } catch (err) {
      console.error("Worker fetch error:", err);

      if (cachedLinks) {
        // Vrati stari keš ako fetch nije uspeo
        return new Response(cachedLinks, {
          headers: { "Content-Type": "text/plain" }
        });
      }

      return new Response("Error loading links. Try again later.", {
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
};
