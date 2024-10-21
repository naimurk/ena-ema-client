const Modal = ({ children, onClose }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {/* Close button */}
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;
  