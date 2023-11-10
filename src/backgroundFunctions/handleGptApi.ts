import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export function handleGptApi(message, sender, sendResponse) {
  if (message.type === "fetchGptResponse" && message.query) {
    storage.get("gptApiKey").then((apiKey) => {
      console.log("gptApiKey", apiKey)
      if (apiKey) {
        console.log("gpt prompt", message.query)
        fetch(
          "https://api.openai.com/v1/engines/text-davinci-003/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + apiKey
            },
            body: JSON.stringify({
              prompt: message.query,
              max_tokens: 1024
            })
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("response data", data)
            sendResponse({ type: "gptResponse", data: data.choices[0].text })
          })
          .catch((error) => {
            sendResponse({ type: "gptError", error: error.message })
          })
      } else {
        sendResponse({ type: "apiKeyError" })
      }
    })
    return true // Indicates that the response is asynchronous
  }
}
