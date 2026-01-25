'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DeploymentModal from './DeploymentModal';
import { Rocket, ArrowLeft } from 'lucide-react';

export default function PublishPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const chatId = params?.id as string | undefined;

  const handleBackToBuilder = () => {
    if (chatId) {
      router.push(`/ai-website-builder/${chatId}`);
    } else {
      router.push('/ai-website-builder');
    }
  };

  return (
    <div className="bg-surface-primary flex h-full flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center p-8">
        <div className="space-y-6 text-center">
          {/* Icon */}
          <div className="bg-primary/10 inline-flex h-20 w-20 items-center justify-center rounded-full">
            <Rocket className="text-primary h-10 w-10" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-primary mb-3 text-4xl font-bold">
              Deploy Your Website
            </h1>
            <p className="text-secondary max-w-2xl text-lg">
              Deploy your website to Vercel's global edge network with a single
              click. Your site will be live in minutes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleBackToBuilder}
              className="bg-surface-secondary border-border text-primary hover:bg-surface-tertiary flex items-center gap-2 rounded-md border px-6 py-3 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Builder
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-md px-6 py-3 font-medium transition-colors"
            >
              <Rocket className="h-5 w-5" />
              Deploy to Vercel
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-surface-secondary border-border mx-auto mt-8 max-w-xl rounded-lg border p-6 text-left">
            <h3 className="text-primary mb-3 text-sm font-semibold">
              What happens when you deploy?
            </h3>
            <ul className="text-secondary space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Your files are optimized and prepared for production
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Website is deployed to Vercel's global CDN</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You get a live URL to share with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Automatic HTTPS and performance optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Deployment Modal */}
      <DeploymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chatId={chatId}
      />
    </div>
  );
}
