export default function PageHeader({ title, subtitle, actions, badge }) {
  return (
    <div className="page-header-card">
      <div className="page-header-inner">
        <div>
          {badge && <span className="page-badge mb-2 d-inline-block">{badge}</span>}
          <h1 className="page-title mb-1">{title}</h1>
          {subtitle && <p className="page-subtitle mb-0">{subtitle}</p>}
        </div>
        {actions && (
          <div className="page-header-actions d-flex gap-2 flex-wrap align-items-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
