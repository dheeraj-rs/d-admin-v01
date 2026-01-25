import React from 'react';
import { cn } from '../utils/class-mixin';
import '@/core/styles/index.scss';

function AuthLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('admin-login-page', className)}>{children}</div>;
}

export default AuthLayout;
