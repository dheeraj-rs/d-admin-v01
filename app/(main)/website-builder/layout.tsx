import Layout from '@/core/layouts/Layout';
import type { Metadata } from 'next';
import 'react-toastify/dist/ReactToastify.css';
import '@xterm/xterm/css/xterm.css';
import './styles/index.scss';

export const metadata: Metadata = {
  title: 'D Admin - AI Website Builder',
  description: 'AI-powered full-stack web development in the browser',
};

export default function WebsiteBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <div id="builder-root" className="w-full h-full">
        {children}
      </div>
    </Layout>
  );
}
