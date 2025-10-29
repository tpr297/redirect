addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const LINK_URL = "https://tpr297.github.io/redirect/link.txt"
const CACHE_DURATION = 10 * 60 

async function handleRequest(request) {
  const cache = caches.default

  let response = await cache.match(LINK_URL)
  if (response) {
    return response
  }

  try {
    response = await fetch(LINK_URL)
    const responseClone = new Response(response.body, response)
    responseClone.headers.append("Cache-Control", `max-age=${CACHE_DURATION}`)
    event.waitUntil(cache.put(LINK_URL, responseClone.clone()))
    return response
  } catch (err) {
    return new Response("Error fetching links.", { status: 500 })
  }
}
