import type { PlasmoCSConfig } from "plasmo"
import { createRoot } from "react-dom/client"

import GoogleSearchBox from "./GoogleSearchBox"
import BaiduSearchBox from "./BaiduSearchBox"

export const config: PlasmoCSConfig = {
  matches: ["https://*.google.com/*", "https://*.baidu.com/*"]
}

const handleEvent = () => {
  console.log("content script loaded")
  console.log("hostname", window.location.hostname)
  displayGptResponse("Loading...", window.location.hostname)
  let urlSearchParams = new URLSearchParams(window.location.search)
  const queryParam =
    window.location.hostname == "www.google.com"
      ? urlSearchParams.get("q")
      : urlSearchParams.get("wd")
  console.log(queryParam)
  if (queryParam) {
    chrome.runtime.sendMessage(
      { type: "fetchGptResponse", query: queryParam },
      (response) => {
        if (response) {
          if (response.type === "gptResponse") {
            displayGptResponse(response.data, window.location.hostname)
          } else if (response.type === "gptError") {
            console.error("GPT Error:", response.error)
          } else if (response.type === "apiKeyError") {
            console.error("API Key Error: API Key not set or invalid.")
          }
        }
      }
    )
  }
}

window.addEventListener("load", handleEvent)

if (window.location.hostname == "www.baidu.com") {
  let submitButton = document.getElementById("su");
  submitButton.addEventListener("click", function(e) {
    setTimeout(handleEvent, 1500);
  })
}

const displayGptResponse = (responseText: string, hostname: string) => {
  let container = document.getElementById("gpt-response-container")
  if (container) {
    container.remove()
  }
  container = document.createElement("div")
  container.id = "gpt-response-container"
  if (hostname == "www.google.com") {
    let appbar = document.getElementById("appbar")
    appbar.parentNode.insertBefore(container, appbar)
    const root = createRoot(container)
    root.render(<GoogleSearchBox responseText={responseText} />)
  } else {
    const parentElement = document.getElementById("content_right")
    parentElement.insertBefore(container, parentElement.firstChild)
    const root = createRoot(container)
    root.render(<BaiduSearchBox responseText={responseText} />)
  }
}
