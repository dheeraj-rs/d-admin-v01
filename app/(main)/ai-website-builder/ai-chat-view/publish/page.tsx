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
        <div className="flex flex-col h-full bg-surface-primary">
            <div className="max-w-4xl mx-auto w-full p-8 flex-1 flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                        <Rocket className="h-10 w-10 text-primary" />
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-4xl font-bold text-primary mb-3">Deploy Your Website</h1>
                        <p className="text-lg text-secondary max-w-2xl">
                            Deploy your website to Vercel's global edge network with a single click.
                            Your site will be live in minutes.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center pt-4">
                        <button
                            onClick={handleBackToBuilder}
                            className="px-6 py-3 bg-surface-secondary border border-border text-primary rounded-md font-medium hover:bg-surface-tertiary transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back to Builder
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Rocket className="h-5 w-5" />
                            Deploy to Vercel
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 bg-surface-secondary border border-border rounded-lg p-6 max-w-xl mx-auto text-left">
                        <h3 className="text-sm font-semibold text-primary mb-3">What happens when you deploy?</h3>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Your files are optimized and prepared for production</span>
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
