import React from "react"
import ReactDOM from "react-dom/client"
import MonacoEditorComponent from './MonacoEditorComponent';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <MonacoEditorComponent />
  </React.StrictMode>
);