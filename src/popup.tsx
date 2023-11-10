import { KeyOutlined } from "@ant-design/icons"
import { Button, Divider, Input } from "antd"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const IndexPopup = () => {
  const [gptApiKey, setGptApiKey] = useState("")
  const [gptStatus, setGptStatus] = useState("Enter your GPT API Key")

  useEffect(() => {
    const fetchApiKey = async () => {
      const savedGptApiKey = await storage.get("gptApiKey")
      if (savedGptApiKey) {
        setGptApiKey(savedGptApiKey)
        setGptStatus("GPT API Key saved successfully.")
      }
    }
    fetchApiKey()
  }, [])

  const verifyGptApiKey = async (key: string) => {
    try {
      const response = await fetch("https://api.openai.com/v1/engines", {
        headers: {
          Authorization: `Bearer ${key}`
        }
      })

      if (response.ok) {
        return true
      }
      setGptStatus("Invalid GPT API Key.")
      return false
    } catch (error) {
      setGptStatus("Error verifying GPT API Key.")
      return false
    }
  }

  const saveGptApiKey = async () => {
    if (await verifyGptApiKey(gptApiKey)) {
      try {
        await storage.set("gptApiKey", gptApiKey)
        setGptStatus("GPT API Key saved successfully.")
      } catch (error) {
        setGptStatus("Failed to save GPT API Key.")
      }
    }
  }

  const clearGptApiKey = async () => {
    await storage.remove("gptApiKey")
    setGptApiKey("")
    setGptStatus("Enter your GPT API Key")
  }

  return (
    <div
      style={{
        width: "300px",
        padding: "10px",
        display: "flex",
        flexDirection: "column"
      }}>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "400"
        }}>
        {gptStatus}
      </div>
      <div
        style={{
          marginTop: "10px",
          display: "flex"
        }}>
        <Input
          type="text"
          value={gptApiKey}
          prefix={<KeyOutlined />}
          onChange={(e) => setGptApiKey(e.target.value)}
          placeholder="Enter your OpenAI API Key"
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button
          type="primary"
          style={{
            marginLeft: "10px"
          }}
          onClick={saveGptApiKey}>
          Save
        </Button>
        <Button
          type="dashed"
          danger
          style={{
            marginLeft: "10px"
          }}
          onClick={clearGptApiKey}>
          Clear
        </Button>
      </div>
    </div>
  )
}

export default IndexPopup
