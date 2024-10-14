import streamlit as st
import streamlit.components.v1 as components

# Define the HTML and JavaScript for Monaco Editor
monaco_html = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Monaco Editor in Streamlit</title>
    <style>
        #container {
            width: 100%;
            height: 400px;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div id="container"></div>
    <!-- Load Monaco Editor from CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js"></script>
    <script>
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            window.editor = monaco.editor.create(document.getElementById('container'), {
                value: `# Write your code here
print("Hello, Streamlit!")`,
                language: 'python',
                theme: 'vs-dark',
                automaticLayout: true
            });

            // Listen for changes and send data back to Streamlit
            editor.onDidChangeModelContent(function() {
                const code = editor.getValue();
                // Use Streamlit's ability to run custom JavaScript via postMessage
                Streamlit.setComponentValue(code);
            });
        });
    </script>
</body>
</html>
"""

# Embed the Monaco Editor
code = components.html(
    monaco_html,
    height=450,
    scrolling=True,
)

# Display the code entered in the editor
st.write("You entered:")
st.code(code, language="python")