import React, { useCallback, useEffect, useRef, useState } from "react"
import Editor from "@monaco-editor/react"
// import * as monaco from "monaco-editor";
import {
  withStreamlitConnection,
  Streamlit,
  ComponentProps,
} from "streamlit-component-lib"
import { Fab } from "@mui/material"
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

const lineHeight = 20
const default_min_lines = 10
const default_max_lines = 10

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

  const minLines = args.minLines || default_min_lines
  const maxLines = args.maxLines || default_max_lines
  const [height, setHeight] = useState(lineHeight * minLines)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    Streamlit.setFrameHeight(height)
    if (editorRef.current) {
      const parent = editorRef.current.getDomNode().parentElement
      if (parent) {
        console.log("parent", parent)
        // parent.style.height = `${height}px`
      }
    }
  }, [height])



  const updateHeight = useCallback((isCollapsed: boolean) => {
    if (!editorRef.current) {
      return
    }
    const contentHeight = editorRef.current.getContentHeight()
    console.log("isCollapsed", isCollapsed)
    const h = isCollapsed
      ? Math.min(lineHeight * minLines, contentHeight)
      : Math.max(contentHeight, lineHeight * maxLines)
    setHeight(h)
  }, [setHeight])

  useEffect(() => {
    updateHeight(isCollapsed)
  }, [isCollapsed])


  const onChange = useCallback(
    (value: string | undefined, event: any) => {
      console.log("onChange, isCollapsed", isCollapsed)
      Streamlit.setComponentValue(value)
      
      updateHeight(isCollapsed)
    },
    [updateHeight, isCollapsed]
  )

  const onClick = useCallback(() => {
    setIsCollapsed(prevState => !prevState)
  }, [setIsCollapsed])

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Editor
        width={width}
        height={height}
        theme={vs_theme}
        language={args.language}
        onChange={(value, event) => {console.log("isCollapsed", isCollapsed) ;onChange(value, event);}}
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
          updateHeight(isCollapsed)
        }}
      />
      <Fab
        size="small"
        color="primary"
        onClick={onClick}
        sx={{
          position: "absolute",
          right: "1rem",
          bottom: "0.5rem",
          zIndex: 10,
          opacity: isHovering ? 0.5 : 0,
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
        aria-label={isCollapsed ? "Expand editor" : "Collapse editor"}
      >
        {isCollapsed ? <OpenInFullIcon /> : <CloseFullscreenIcon />  }
      </Fab>
    </div>
  )
}

export default withStreamlitConnection(MonacoEditorComponent)
