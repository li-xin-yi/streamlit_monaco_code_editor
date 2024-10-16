import React, {useEffect, useRef} from 'react';
import Editor from '@monaco-editor/react';
// import * as monaco from "monaco-editor";
import { withStreamlitConnection, Streamlit, ComponentProps } from 'streamlit-component-lib';

const lineHeight = 20;

const MonacoEditorComponent = ({ args, width, disabled, theme }: ComponentProps) => {
  let vs_theme = 'vs-dark';
  if ( theme!==undefined && (theme.base === 'light') ) {
    vs_theme = 'vs-light';
  }
  const editorRef = useRef<any>(null);
  const minLines = args.minLines || 10;
  const [height, setHeight] = React.useState(lineHeight * minLines);

  useEffect(() => {
    Streamlit.setFrameHeight();
  }, [height]);

  const onChange = (value: string|undefined, event: any) => {
    Streamlit.setComponentValue(value);
    const contentHeight = editorRef.current.getContentHeight();
    setHeight(Math.max(contentHeight, lineHeight * minLines));
  }

  return (
    <Editor
      width={width}
      height={height}
      theme={vs_theme}
      language={args.language}
      onChange={onChange}
      value={args.value || ""}
      options={{
        automaticLayout: true,
        minimap: {enabled: false},
        lineHeight: lineHeight,
        scrollBeyondLastLine: false,
      }}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        Streamlit.setComponentValue(args.value);
      }}
    />
  );

};

export default withStreamlitConnection(MonacoEditorComponent)