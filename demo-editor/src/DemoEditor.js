import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  Modifier,
  SelectionState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "./DemoEditor.css";

const DemoEditor = () => {
  const [editorState, setEditorState] = useState(
    loadContentFromLocalStorage() || EditorState.createEmpty()
  );
  const styleMap = {
    COLOR_RED: {
      color: "red",
    },
    H1_STYLE: {
      fontSize: "2em",
      fontWeight: "bold",
      color: "black",
    },
  };
  let editorRef;

  useEffect(() => {
    saveContentToLocalStorage(editorState);
  }, [editorState]);

  const handleSave = () => {
    alert("Content saved!");
    saveContentToLocalStorage(editorState);
  };
  const saveContentToLocalStorage = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const contentStateJSON = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(contentStateJSON));
  };

  function loadContentFromLocalStorage() {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }
    return null;
  }

  const onChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const selection = newEditorState.getSelection();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();

    if (blockText.startsWith("# ") && selection.isCollapsed()) {
      // If the line starts with '* ' and the cursor is at the end of the line, remove '* ' and apply inline style to 'BOLD'
      const blockKey = currentBlock.getKey();
      const startOffset = 0;
      const endOffset = blockText.length;

      // Reset the entire content block's style
      const clearedContentState = Modifier.setBlockType(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: blockText.length,
        }),
        "" // Resetting the style to 'unstyled'
      );
      // Remove any previous inline styles within the specified range
      const contentStateWithoutPreviousInlineStyles = Modifier.replaceText(
        clearedContentState,
        selection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset,
        }),
        blockText.substring(startOffset, endOffset)
      );
      const updatedContentState = Modifier.applyInlineStyle(
        contentStateWithoutPreviousInlineStyles,
        selection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset,
        }),
        "H1_STYLE"
      );

      const newEditorStateWithBold = EditorState.push(
        newEditorState,
        updatedContentState,
        "change-inline-style"
      );
      setEditorState(newEditorStateWithBold);
    } else if (blockText.startsWith("* ") && selection.isCollapsed()) {
      // If the line starts with '* ' and the cursor is at the end of the line, remove '* ' and apply inline style to 'BOLD'
      const blockKey = currentBlock.getKey();
      const startOffset = 0;
      const endOffset = blockText.length;

      // Reset the entire content block's style
      const clearedContentState = Modifier.setBlockType(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: blockText.length,
        }),
        ""
      );
      // Remove any previous inline styles within the specified range
      const contentStateWithoutPreviousInlineStyles = Modifier.replaceText(
        clearedContentState,
        selection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset,
        }),
        blockText.substring(startOffset, endOffset)
      );
      const updatedContentState = Modifier.applyInlineStyle(
        contentStateWithoutPreviousInlineStyles,
        selection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset,
        }),
        "BOLD"
      );

      const newEditorStateWithBold = EditorState.push(
        newEditorState,
        updatedContentState,
        "change-inline-style"
      );
      setEditorState(newEditorStateWithBold);
    } else if (blockText.startsWith("** ") && selection.isCollapsed()) {
      // If the line starts with '** ' and the cursor is at the end of the line, apply inline style to change text color to red
      const blockKey = currentBlock.getKey();
      const startOffset = 0;
      const endOffset = blockText.length;

      const clearedContentState = Modifier.setBlockType(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: blockText.length,
        }),
        ""
      );
      // Remove any previous inline styles within the specified range
      const contentStateWithoutPreviousInlineStyles = Modifier.replaceText(
        clearedContentState,
        selection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset,
        }),
        blockText.substring(startOffset, endOffset)
      );

      const updatedContentState = Modifier.applyInlineStyle(
        contentStateWithoutPreviousInlineStyles,
        selection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset,
        }),
        "COLOR_RED"
      );

      const newEditorStateWithRedText = EditorState.push(
        newEditorState,
        updatedContentState,
        "change-inline-style"
      );
      setEditorState(newEditorStateWithRedText);
    } else if (blockText.startsWith("*** ") && selection.isCollapsed()) {
      // If the line starts with '*** ' and the cursor is at the end of the line, apply inline style to 'UNDERLINE'
      const blockKey = currentBlock.getKey();
      const startOffset = 0;
      const endOffset = blockText.length;
      const clearedContentState = Modifier.setBlockType(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: blockText.length,
        }),
        "" // Resetting the style to 'unstyled'
      );
      // Remove any previous inline styles within the specified range
      const contentStateWithoutPreviousInlineStyles = Modifier.replaceText(
        clearedContentState,
        selection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset,
        }),
        blockText.substring(startOffset, endOffset)
      );

      const updatedContentState = Modifier.applyInlineStyle(
        contentStateWithoutPreviousInlineStyles,
        selection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset,
        }),
        "UNDERLINE"
      );

      const newEditorStateWithUnderline = EditorState.push(
        newEditorState,
        updatedContentState,
        "change-inline-style"
      );
      setEditorState(newEditorStateWithUnderline);
    } else {
      setEditorState(newEditorState);
    }
  };

  return (
    <div className="editor-container">
      <div className="header">
        <h4>Demo editor by Uday Mahale</h4>
        <button onClick={handleSave}>Save</button>
      </div>
      <div className="text-box" onClick={() => editorRef.focus()}>
        <Editor
          ref={(ref) => (editorRef = ref)}
          editorState={editorState}
          onChange={onChange}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default DemoEditor;
