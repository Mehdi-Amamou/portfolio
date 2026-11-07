// Affiché par le script inline de lib/preload-script.ts, avant la première image :
// ni React ni le chargement du JS ne le retardent.
export function Preloader({ label }: { label: string }) {
  return (
    <div className="mh-pre" aria-hidden="true">
      <span className="mh-logo">
        <span>mehdi</span>
        <span className="mh-caret" />
      </span>
      <div className="mh-pre-bar">
        <span />
      </div>
      <p className="mh-pre-note">{label}</p>
    </div>
  );
}
