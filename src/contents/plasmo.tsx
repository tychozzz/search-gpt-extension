import type { PlasmoCSConfig } from "plasmo"
import { createRoot } from "react-dom/client"

import BaiduSearchBox from "./BaiduSearchBox"
import GoogleSearchBox from "./GoogleSearchBox"
import PageCollapse from "./PageCollapse"

export const config: PlasmoCSConfig = {
  matches: ["https://*.google.com/*", "https://*.baidu.com/*"]
}

// handle window load event
const handleWindowLoadEvent = () => {
  console.log("content script loaded")
  console.log("hostname", window.location.hostname)

  displayGptResponse(
    "Loading and please ensure a stable network connection and correct API Key...",
    window.location.hostname
  )

  // obtain top 10 result pages
  obtainTop10ResultPages(window.location.hostname)

  // send message to handle gpt
  sendMessageToHandleGPT()
}

// display GPT response box
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

const sendMessageToHandleGPT = () => {
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
            displayGptResponse("Request GPT error...", window.location.hostname)
          } else if (response.type === "apiKeyError") {
            console.error("API Key Error: API Key not set or invalid.")
            displayGptResponse("API Key not set or invalid.", window.location.hostname)
          }
        }
      }
    )
  }
}

const obtainTop10ResultPages = (hostname: string) => {
  if (hostname == "www.google.com") {
    let parentPageElement = document.getElementById("rso")
    let i = 0
    for (let child of parentPageElement.children) {
      let targetElement = child.querySelector('[jsname="UWckNb"]')
      if (targetElement != null && targetElement.tagName === "A") {
        console.log("第" + i + "个page", targetElement.href)
        // add collapse
        let link = targetElement.href
        let container = document.createElement("div")
        container.id = "page-collapse-" + i
        const root = createRoot(container)
        child.insertAdjacentElement("afterend", container)
        root.render(<PageCollapse link={link} />)
      }
      i += 1
    }
  } else if (hostname == "www.baidu.com") {
    console.log("baiduhhhhh")
    let parentPageElement = document.getElementById("content_left")
    let i = 0
    for (let child of parentPageElement.children) {
      let element = child.querySelector('.c-title.t.t.tts-title')
      let firstAnchor = element ? element.querySelector('a') : null;
      let href = firstAnchor ? firstAnchor.href : null;

      if (href != null) {
        console.log("第" + i + "个page", href)
        // add collapse
        let link = href
        let container = document.createElement("div")
        container.id = "page-collapse-" + i
        const root = createRoot(container)
        child.insertAdjacentElement("afterend", container)
        root.render(<PageCollapse link={link} />)
      }
      i += 1
    }
  }
}

// Event Listener
window.addEventListener("load", handleWindowLoadEvent)

if (window.location.hostname == "www.baidu.com") {
  let submitButton = document.getElementById("su")
  submitButton.addEventListener("click", function (e) {
    setTimeout(handleWindowLoadEvent, 1500)
  })
}
