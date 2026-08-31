export default function BackRow({ onBack, title, children }) {
  return (
    <div className="back-row">
      <button className="back-btn" onClick={onBack} aria-label="Retour">
        <svg viewBox="0 0 24 24">
          <path
            d="M15 18l-6-6 6-6"
            stroke="var(--text)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </button>
      <div className="page-title">{title}</div>
      {children}
    </div>
  );
}
