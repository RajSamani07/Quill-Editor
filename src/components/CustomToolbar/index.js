import React, { useRef, useState, useEffect } from "react";

const CustomToolbar = ({ onInsertTable, onAlignChange, onTogglePreview }) => {
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [dimensions, setDimensions] = useState({ rows: 0, cols: 0 });
  const tableMenuRef = useRef(null);
  const MAX_SIZE = 10;

  // Update table dimensions on hover
  const handleMouseOver = (row, col) => {
    setDimensions({ rows: row + 1, cols: col + 1 });
  };

  // Insert table and reset menu
  const handleInsertTable = () => {
    if (dimensions.rows && dimensions.cols) {
      onInsertTable(dimensions.rows, dimensions.cols);
      setShowTableMenu(false);
      setDimensions({ rows: 0, cols: 0 });
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableMenuRef.current &&
        !tableMenuRef.current.contains(event.target)
      ) {
        setShowTableMenu(false);
        setDimensions({ rows: 0, cols: 0 });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="ql-toolbar ql-toolbar-modern">
      <select className="ql-header" defaultValue="" title="Text Style">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="">Normal</option>
      </select>
      <button className="ql-bold" title="Bold" aria-label="Bold" />
      <button className="ql-italic" title="Italic" aria-label="Italic" />
      <button
        className="ql-underline"
        title="Underline"
        aria-label="Underline"
      />
      <button
        className="ql-list"
        value="ordered"
        title="Ordered List"
        aria-label="Ordered List"
      />
      <button
        className="ql-list"
        value="bullet"
        title="Bullet List"
        aria-label="Bullet List"
      />

      {/* Table insertion controls */}
      <div className="ql-table-container">
        <button
          className="ql-insertTable"
          title="Insert Table"
          onClick={() => setShowTableMenu(!showTableMenu)}
        >
          <svg
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="2" width="14" height="14" rx="1" />
            <line x1="9" y1="2" x2="9" y2="16" />
            <line x1="2" y1="9" x2="16" y2="9" />
          </svg>
        </button>
        {showTableMenu && (
          <div className="ql-table-menu" ref={tableMenuRef}>
            <div className="ql-table-grid">
              {Array(MAX_SIZE)
                .fill(0)
                .map((_, row) => (
                  <div key={row} className="ql-table-row">
                    {Array(MAX_SIZE)
                      .fill(0)
                      .map((_, col) => (
                        <div
                          key={col}
                          className={`ql-table-cell ${
                            row < dimensions.rows && col < dimensions.cols
                              ? "active"
                              : ""
                          }`}
                          onMouseOver={() => handleMouseOver(row, col)}
                          onClick={handleInsertTable}
                        />
                      ))}
                  </div>
                ))}
            </div>
            <div className="ql-table-size">
              {dimensions.rows} × {dimensions.cols}
            </div>
          </div>
        )}
      </div>

      <select
        className="ql-align"
        defaultValue=""
        onChange={(e) => onAlignChange(e.target.value)}
      >
        <option value="">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>

      <button className="ql-toggle-preview" onClick={onTogglePreview}>
        <svg
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="2" y="2" width="14" height="14" rx="1" />
          <line x1="9" y1="2" x2="9" y2="16" />
        </svg>
      </button>
    </div>
  );
};

export default CustomToolbar;
