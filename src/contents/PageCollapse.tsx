import { Collapse } from "antd"
import type { PlasmoMountShadowHost } from "plasmo"
import React, { useEffect, useState } from "react"

const { Panel } = Collapse

export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  anchor,
  mountState
}) => {}

const PageCollapse = ({ link }: { link: string }) => {
  const [linkSummary, setLinkSummary] = useState("Crawling...")
  const [linkContent, setLinkContent] = useState("")
  const [responsed, setResponsed] = useState(false)

  const sendMessageToHandleCrawler = () => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "fetchCrawler", link: link },
        (response) => {
          if (response) {
            if (response.type === "crawlerSuccess") {
              console.log("request crawler success", response.data)
              setLinkContent(response.data)
              resolve(response.data) // 解析 Promise
            } else if (response.type === "crawlerError") {
              console.error("request crawler error", response.error)
              reject(response.error) // 拒绝 Promise
            }
          }
        }
      )
    })
  }

  const sendMessageToHandleGPT = (content) => {
    chrome.runtime.sendMessage(
      {
        type: "fetchGptResponse",
        query: "Below is a part of the content crawled from a website. Could you please provide a simple and easy-to-understand summary of what this website is about? -> " + content
      },
      (response) => {
        if (response) {
          if (response.type === "gptResponse") {
            console.log("GPT success:", response.data)
            setLinkSummary(response.data)
            setResponsed(true)
          } else if (response.type === "gptError") {
            console.error("GPT Error:", response.error)
            setLinkSummary("Request GPT error...")
          } else if (response.type === "apiKeyError") {
            console.error("API Key Error: API Key not set or invalid.")
            setLinkSummary("API Key not set or invalid.")
          }
        }
      }
    )
  }

  const handleCollapseChange = async (key) => {
    if (!responsed && key) {
      try {
        let content = await sendMessageToHandleCrawler()
        setLinkSummary(
          "Requesting GPT and please ensure a stable network connection..."
        )
        console.log("linkContent", content)
        sendMessageToHandleGPT(content)
      } catch (error) {
        console.error("Crawler request failed:", error)
        setLinkSummary(error)
      }
    }
  }

  return (
    <div
      style={{
        marginBottom: "40px"
      }}>
      <Collapse onChange={handleCollapseChange}>
        <Panel header={`Introduction of the link: ${link}`} key="1">
          <p>{linkSummary}</p>
        </Panel>
      </Collapse>
    </div>
  )
}

export default PageCollapse
