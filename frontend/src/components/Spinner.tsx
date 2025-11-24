import "./Spinner.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

export default function Spinner({ size = "medium", message }: SpinnerProps) {
  return (
    <div className="spinner-container">
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}
