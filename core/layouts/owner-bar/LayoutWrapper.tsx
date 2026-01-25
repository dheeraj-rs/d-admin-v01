import React from 'react';

function LayoutWrapper({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`owner-dashboard-wrapper ${className || ''}`}>
      <div className="dashboard-main-panel">{children}</div>
    </div>
  );
}

export default LayoutWrapper;
