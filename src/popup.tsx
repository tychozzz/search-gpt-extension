import { KeyOutlined } from "@ant-design/icons"
import { Button, Divider, Input } from "antd"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const IndexPopup = () => {
  const [apiKey, setApiKey] = useState("")
  const [status, setStatus] = useState("Enter your API Key to enjoy the extension!")

  useEffect(() => {
    const fetchApiKey = async () => {
      const savedApiKey = await storage.get("apiKey")
      if (savedApiKey) {
        setApiKey(savedApiKey)
        setStatus("API Key saved successfully.")
      }
    }
    fetchApiKey()
  }, [])

  const verifyApiKey = async (key: string) => {
    try {
      const response = await fetch("https://api.openai.com/v1/engines", {
        headers: {
          Authorization: `Bearer ${key}`
        }
      })

      if (response.ok) {
        return true
      }
      setStatus("Invalid API Key.")
      return false
    } catch (error) {
      setStatus("Error verifying API Key.")
      return false
    }
  }

  const saveApiKey = async () => {
    if (await verifyApiKey(apiKey)) {
      try {
        await storage.set("apiKey", apiKey)
        setStatus("API Key saved successfully.")
      } catch (error) {
        setStatus("Failed to save API Key.")
      }
    }
  }

  return (
    <div
      style={{
        width: "300px",
        padding: "10px"
      }}>
      <div style={{
        fontSize: "18px",
        fontWeight: "400"
      }}>{status}</div>
      <Divider />
      <div
        style={{
          display: "flex"
        }}>
        <Input
          type="text"
          value={apiKey}
          prefix={<KeyOutlined />}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API Key"
        />
        <Button
          type="primary"
          style={{
            marginLeft: "10px"
          }}
          onClick={saveApiKey}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default IndexPopup
