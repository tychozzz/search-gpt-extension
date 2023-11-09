import hljs from "highlight.js"
import { marked, type MarkedOptions } from "marked"
import type { PlasmoMountShadowHost } from "plasmo"
import React, { useEffect } from "react"

import 'highlight.js/styles/github.css';

export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  anchor,
  mountState
}) => {}

const SearchBox = ({ responseText }: { responseText: string }) => {
  marked.setOptions({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(lang, code).value;
      }
      return hljs.highlightAuto(code).value;
    },
  } as MarkedOptions)

  const getMarkdownText = () => {
    const rawMarkup = marked(responseText)
    return { __html: rawMarkup }
  }

  useEffect(() => {
    hljs.highlightAll();
  }, [responseText]);

  return (
    <div
      id="gpt-response-container"
      style={{
        marginLeft: "180px",
        maxHeight: "200px",
        overflowY: "auto",
        width: "600px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        boxSizing: "border-box"
      }}>
      <h2 style={{ marginTop: "0" }}>Search GPT</h2>
      <div dangerouslySetInnerHTML={getMarkdownText()}></div>
    </div>
  )
}

export default SearchBox
