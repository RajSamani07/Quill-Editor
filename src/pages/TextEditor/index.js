import React, { useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomToolbar from "../../components/CustomToolbar/index";
import "./TextEditor.css";

// Custom table blot for Quill
const BlockEmbed = Quill.import("blots/block/embed");

class TableBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.innerHTML = value.html;
    node.setAttribute("contenteditable", "false");
    const cells = node.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.setAttribute("contenteditable", "true");
      cell.setAttribute("tabindex", "0");
      cell.style.backgroundColor = "#ffffff";
    });
    return node;
  }

  static value(node) {
    return { html: node.innerHTML };
  }
}

TableBlot.blotName = "table";
TableBlot.tagName = "div";
TableBlot.className = "ql-custom-table";
Quill.register(TableBlot);

const TextEditor = () => {
  const quillRef = useRef(null);
  const [previewContent, setPreviewContent] = useState("");
  const [previewLocation, setPreviewLocation] = useState("bottom");

  // Generate table HTML structure
  const generateTableHTML = (rows, cols) => {
    let html = `
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
        <tbody>
    `;
    for (let i = 0; i < rows; i++) {
      html += "<tr>";
      for (let j = 0; j < cols; j++) {
        html += `
          <td style="border: 1px solid #d1d5db; padding: 0 8px; min-width: 50px; height: 24px; line-height: 24px; background-color: #ffffff; overflow: hidden; white-space: nowrap;">
            <p></p>
          </td>
        `;
      }
      html += "</tr>";
    }
    html += `
        </tbody>
      </table>
    `;
    return html;
  };

  // Insert table into editor
  const insertTableHandler = (rows, cols) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true);
    const tableHTML = generateTableHTML(rows, cols);
    quill.insertEmbed(range.index, "table", { html: tableHTML }, "user");
    quill.setSelection(range.index + 1, 0);
    updatePreview();
  };

  // Handle alignment for text and table cells
  const alignChangeHandler = (alignment) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection();
    if (range) {
      const [leaf] = quill.getLeaf(range.index);
      const cell = leaf?.domNode.closest("td");
      if (cell) {
        cell.style.textAlign = alignment || "left";
        cell.style.backgroundColor = "#ffffff";
        updatePreview();
      } else {
        quill.format("align", alignment);
        updatePreview();
      }
    }
  };

  // Update preview content
  const updatePreview = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) setPreviewContent(quill.root.innerHTML);
  };

  const togglePreviewHandler = () => {
    setPreviewLocation((prev) => (prev === "bottom" ? "right" : "bottom"));
  };

  const modules = {
    toolbar: { container: ".ql-toolbar-modern" },
    clipboard: { matchVisual: false },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "table",
    "align",
  ];

  return (
    <div className={`editor-wrapper ${previewLocation}`}>
      <CustomToolbar
        onInsertTable={insertTableHandler}
        onAlignChange={alignChangeHandler}
        onTogglePreview={togglePreviewHandler}
      />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="Start writing..."
        onChange={updatePreview}
      />
      <div className="preview-pane">
        <h3 className="preview-header">Preview</h3>
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      </div>
    </div>
  );
};

export default TextEditor;
