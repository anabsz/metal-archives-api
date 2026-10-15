import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3>{title}</h3>
          <button className="btn btn-sm btn-secondary" onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ marginTop: "1rem" }}>{children}</div>
      </div>
    </div>
  );
}

// Estilos básicos inline (podem ser movidos para o seu CSS)
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#111",
  padding: "1.5rem",
  borderRadius: "8px",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  border: "1px solid #444",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #333",
  paddingBottom: "0.5rem",
};
