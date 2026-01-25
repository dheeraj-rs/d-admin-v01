import React from 'react';

function ContentArea({ children }: { children?: React.ReactNode }) {
  return <div className="owner-page-container">{children}</div>;
}

export default ContentArea;
