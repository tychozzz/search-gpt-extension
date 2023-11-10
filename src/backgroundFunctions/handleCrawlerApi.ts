export function handleCrawlerApi(message, sender, sendResponse) {
  console.log("crawler", message)
  fetch("http://localhost:5000/?link=" + encodeURIComponent(message.link))
    .then((resp) => {
      if (resp.status === 200) {
        return resp
          .text()
          .then((text) => sendResponse({ type: "crawlerSuccess", data: text }))
      } else {
        sendResponse({
          type: "crawlerError",
          error: "Cannot crawl the web page."
        })
      }
    })
    .catch((error) => {
      sendResponse({ type: "crawlerError", error: "Crawl failed" })
    })
  return true
}
