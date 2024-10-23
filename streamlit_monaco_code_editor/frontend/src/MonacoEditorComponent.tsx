import React, { useCallback, useEffect, useRef, useState } from "react"
import Editor from "@monaco-editor/react"
// import * as monaco from "monaco-editor";
import {
  withStreamlitConnection,
  Streamlit,
  ComponentProps,
} from "streamlit-component-lib"
import { Fab, Box } from "@mui/material"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

const lineHeight = 20

const MonacoEditorComponent = ({
  args,
  width,
  disabled,
  theme,
}: ComponentProps) => {
  let vs_theme = "vs-dark"
  if (theme !== undefined && theme.base === "light") {
    vs_theme = "vs-light"
  }
  const editorRef = useRef<any>(null)

  const minLines = args.minLines || 10
  const maxLines = args.maxLines || 30
  const [height, setHeight] = useState(lineHeight * minLines)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [height])

  const onChange = (value: string | undefined, event: any) => {
    Streamlit.setComponentValue(value)
    const contentHeight = editorRef.current.getContentHeight()
    const h = Math.min(
      Math.max(contentHeight, lineHeight * minLines),
      lineHeight * maxLines
    )
    setHeight(h)
  }

  return (
    <>
      <Editor
        width={width}
        height={height}
        theme={vs_theme}
        language={args.language}
        onChange={onChange}
        value={args.value || ""}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          lineHeight: lineHeight,
          scrollBeyondLastLine: false,
          ...args.options,
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          Streamlit.setComponentValue(args.value)
          const contentHeight = editor.getContentHeight()
          const h = Math.min(
            Math.max(contentHeight, lineHeight * minLines),
            lineHeight * maxLines
          )
          setHeight(h)
        }}
      />
    </>
  )
}

export default withStreamlitConnection(MonacoEditorComponent)
