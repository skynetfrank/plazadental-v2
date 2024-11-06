function ToolTip({ children, text }) {
  return (
    <div className="toolti-container">
      <div className="tooltip-children">
        {" "}
        {children}
        <div className="tooltip">
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}

export default ToolTip;
