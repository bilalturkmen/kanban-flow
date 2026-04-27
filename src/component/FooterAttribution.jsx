const FooterAttribution = () => {
  return (
    <span
      className="text-slate-400 text-sm"
      style={{
        width: "100%",
        display: "block",
        textAlign: "center",
        paddingBottom: "1.5rem",
        fontWeight: "200",
      }}
    >
      A modern, responsive Kanban board focusing on fluid UX and robust state
      management. - Coded by{" "}
      <a
        href="https://bilalturkmen.com"
        target="_blank"
        aria-label="visit the coder's webpage"
        className="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-400"
      >
        Bilal Türkmen
      </a>
      .
    </span>
  );
};

export default FooterAttribution;
