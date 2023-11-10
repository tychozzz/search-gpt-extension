import { Storage } from "@plasmohq/storage"

import { handleGptApi } from "./backgroundFunctions/handleGptApi"
import { handleCrawlerApi } from "./backgroundFunctions/handleCrawlerApi"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "fetchGptResponse" && message.query) {
    return handleGptApi(message, sender, sendResponse)
  }
  return handleCrawlerApi(message, sender, sendResponse)
})