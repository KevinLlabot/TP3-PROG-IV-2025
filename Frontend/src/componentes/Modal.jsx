export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="cerrar" onClick={onClose}>
            ✖
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
