import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    ["image"],
    [
      {
        table: {
          insertTable: true,
          insertRowAbove: true,
          insertRowBelow: true,
          insertColumnLeft: true,
          insertColumnRight: true,
          deleteRow: true,
          deleteColumn: true,
          deleteTable: true,
        },
      },
    ],
  ],
};

const TextEditor = () => {
  const [content, setContent] = useState("");
  const [previewPosition, setPreviewPosition] = useState("bottom");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: previewPosition === "bottom" ? "column" : "row",
        gap: "10px",
        border: "1px solid #ccc",
        padding: "10px",
      }}
    >
      <div style={{ flex: 1 }}>
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          style={{ height: "300px" }}
        />
      </div>
      <div
        style={{
          flex: 1,
          border: "1px solid #ddd",
          padding: "10px",
          minHeight: "300px",
          overflow: "auto",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <button
        onClick={() =>
          setPreviewPosition(previewPosition === "bottom" ? "right" : "bottom")
        }
        style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
      >
        Toggle Preview Position
      </button>
    </div>
  );
};

export default TextEditor;
