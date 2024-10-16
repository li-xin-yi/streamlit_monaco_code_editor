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

  const countLines = (value: string) => {
    return value.split('\n').length;
  }

  const onChange = (value: string|undefined, event: any) => {
    const editor = editorRef.current;
    Streamlit.setComponentValue(value);
    const lineCount = countLines(value || '');
    setHeight(lineHeight * Math.max(minLines, lineCount));
    editor.layout();
  }

  return (
    <Editor
      width={width}
      height={height}
      theme={vs_theme}
      language={args.language}
      onChange={onChange}
      options={{
        automaticLayout: true,
        minimap: {enabled: false},
        lineHeight: lineHeight,
      }}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        editor.layout();
      }}
    />
  );

};

export default withStreamlitConnection(MonacoEditorComponent)