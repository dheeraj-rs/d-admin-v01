'use client';

import React, { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import {
  Rocket,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { classMixin } from '../../lib/classMixin';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  deploymentFormat: 'html' | 'react';
}

const DEPLOYMENT_STEPS = [
  { id: 1, label: 'Initiating deployment...', duration: 1000 },
  { id: 2, label: 'Building project files...', duration: 2000 },
  { id: 3, label: 'Optimizing assets...', duration: 1500 },
  { id: 4, label: 'Uploading to Vercel...', duration: 2000 },
  { id: 5, label: 'Finalizing deployment...', duration: 1000 },
];

export function DeploymentModal({
  isOpen,
  onClose,
  htmlContent,
  deploymentFormat,
}: DeploymentModalProps) {
  const [projectName, setProjectName] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<
    'idle' | 'deploying' | 'success' | 'error'
  >('idle');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);

  // Generate project name on mount
  useEffect(() => {
    if (isOpen) {
      const uniqueSuffix = Math.random().toString(36).substring(2, 7);
      setProjectName(`my-page-${uniqueSuffix}`);
    }
  }, [isOpen]);

  const extractUploadedImageUrls = (htmlContent: string): string[] => {
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    const urls: string[] = [];
    let match;

    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const url = match[1];
      if (url.includes('/uploaded/')) {
        urls.push(url);
      }
    }

    return [...new Set(urls)];
  };

  const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Failed to fetch image: ${imageUrl}`, error);
      return imageUrl;
    }
  };

  const pollDeploymentStatus = async (
    deploymentId: string,
    teamId?: string,
  ) => {
    const pollInterval = setInterval(async () => {
      try {
        const url = teamId
          ? `/api/deploy/status?id=${deploymentId}&teamId=${teamId}`
          : `/api/deploy/status?id=${deploymentId}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          if (data.status === 'QUEUED' || data.status === 'INITIALIZING') {
            setCurrentStep(1);
            setProgress(10);
          } else if (
            data.status === 'BUILDING' ||
            data.status === 'ANALYZING'
          ) {
            setCurrentStep(2);
            setProgress((prev) => Math.min(prev + 1, 60));
          } else if (data.status === 'DEPLOYING') {
            setCurrentStep(4);
            setProgress(80);
          } else if (data.status === 'READY') {
            clearInterval(pollInterval);
            setCurrentStep(6);
            setProgress(100);

            setTimeout(() => {
              setDeploymentStatus('success');
              setDeploymentUrl(data.url);
              setIsDeploying(false);
            }, 2000);
          } else if (data.status === 'ERROR' || data.status === 'CANCELED') {
            clearInterval(pollInterval);
            setDeploymentStatus('error');
            setErrorMessage(
              data.error?.message ||
                'Deployment failed or was canceled by Vercel.',
            );
            setIsDeploying(false);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  };

  const handleDeploy = async () => {
    if (!projectName || !htmlContent) return;

    setIsDeploying(true);
    setDeploymentStatus('deploying');
    setErrorMessage('');
    setCurrentStep(0);
    setProgress(0);

    try {
      let deploymentFiles;
      let framework = null;

      if (deploymentFormat === 'html') {
        // HTML deployment - embed images as base64
        const imageUrls = extractUploadedImageUrls(htmlContent);
        let processedHtml = htmlContent;

        for (const imageUrl of imageUrls) {
          const base64 = await fetchImageAsBase64(imageUrl);
          processedHtml = processedHtml.replace(
            new RegExp(imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            base64,
          );
        }

        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"></link>
</head>
<body>
${processedHtml}
</body>
</html>`;

        deploymentFiles = [
          {
            path: 'index.html',
            content: fullHTML,
          },
        ];
      } else {
        // React/Vite deployment
        framework = 'vite';
        
        // Create React component from HTML
        const componentContent = `export default function App() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${htmlContent.replace(/`/g, '\\`')}\` }} />
  );
}`;

        deploymentFiles = [
          {
            path: 'src/App.tsx',
            content: componentContent,
          },
          {
            path: 'src/main.tsx',
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
          },
          {
            path: 'src/index.css',
            content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
          },
          {
            path: 'index.html',
            content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
          },
          {
            path: 'package.json',
            content: JSON.stringify({
              name: projectName,
              private: true,
              version: '0.0.0',
              type: 'module',
              scripts: {
                dev: 'vite',
                build: 'tsc && vite build',
                preview: 'vite preview',
              },
              dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0',
              },
              devDependencies: {
                '@types/react': '^18.2.43',
                '@types/react-dom': '^18.2.17',
                '@vitejs/plugin-react': '^4.2.1',
                autoprefixer: '^10.4.16',
                postcss: '^8.4.32',
                tailwindcss: '^3.3.6',
                typescript: '^5.2.2',
                vite: '^5.0.8',
              },
            }, null, 2),
          },
          {
            path: 'vite.config.ts',
            content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,
          },
          {
            path: 'tsconfig.json',
            content: JSON.stringify({
              compilerOptions: {
                target: 'ES2020',
                useDefineForClassFields: true,
                lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                module: 'ESNext',
                skipLibCheck: true,
                moduleResolution: 'bundler',
                allowImportingTsExtensions: true,
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: 'react-jsx',
                strict: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noFallthroughCasesInSwitch: true,
              },
              include: ['src'],
              references: [{ path: './tsconfig.node.json' }],
            }, null, 2),
          },
          {
            path: 'tailwind.config.js',
            content: `export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
          },
          {
            path: 'postcss.config.js',
            content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
          },
        ];
      }

      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          files: deploymentFiles,
          framework,
          envVars: showAdvanced ? envVars : [],
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await pollDeploymentStatus(result.deploymentId, result.teamId);
      } else {
        throw new Error(result.error || 'Deployment failed');
      }
    } catch (error: any) {
      console.error('Deployment error:', error);
      setDeploymentStatus('error');
      setErrorMessage(error.message || 'An error occurred during deployment');
      setIsDeploying(false);
    }
  };

  const handleClose = () => {
    if (!isDeploying) {
      setDeploymentStatus('idle');
      setDeploymentUrl('');
      setErrorMessage('');
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={classMixin(
            'fixed z-50 rounded-xl bg-[var(--d-admin-surface-card)] shadow-2xl',
            'w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto',
            'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform',
            'border border-[var(--d-admin-surface-border)]',
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] px-6 py-4">
            <DialogPrimitive.Title className="flex items-center gap-2 text-lg font-semibold text-[var(--d-admin-text-color)]">
              <Rocket className="h-5 w-5 text-[var(--d-admin-blue-600)]" />
              Deploy to Vercel
            </DialogPrimitive.Title>
          </div>

          {/* Content */}
          <div className="p-6">
            {deploymentStatus === 'idle' && (
              <div className="space-y-6">
                <p className="text-sm text-[var(--d-admin-text-color-secondary)]">
                  Deploy your page to a global edge network with a single click.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--d-admin-text-color)]">
                      Project Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) =>
                          setProjectName(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, '-'),
                          )
                        }
                        placeholder="my-awesome-page"
                        className="flex-1 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-3 py-2 text-sm text-[var(--d-admin-text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--d-admin-blue-600)]"
                      />
                      <div className="flex items-center rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-hover)] px-3 py-2 text-sm text-[var(--d-admin-text-color-secondary)]">
                        .vercel.app
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--d-admin-surface-border)] pt-4">
                    <div className="mb-4 flex items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={showAdvanced}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          showAdvanced
                            ? 'bg-[var(--d-admin-blue-600)]'
                            : 'bg-[var(--d-admin-surface-border)]'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showAdvanced ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <label
                        className="cursor-pointer text-sm font-medium text-[var(--d-admin-text-color)]"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        Enable Advanced Configuration
                      </label>
                    </div>

                    {showAdvanced && (
                      <div className="space-y-4 rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] p-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium text-[var(--d-admin-text-color)]">
                              Environment Variables
                            </label>
                            <button
                              onClick={() =>
                                setEnvVars([...envVars, { key: '', value: '' }])
                              }
                              className="flex items-center gap-1 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] px-2 py-1 text-xs text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                            >
                              <Plus className="h-3 w-3" />
                              Add
                            </button>
                          </div>
                          <div className="space-y-2">
                            {envVars.map((env, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={env.key}
                                  onChange={(e) => {
                                    const newEnvVars = [...envVars];
                                    newEnvVars[index].key = e.target.value;
                                    setEnvVars(newEnvVars);
                                  }}
                                  placeholder="KEY"
                                  className="flex-1 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] px-3 py-2 text-sm text-[var(--d-admin-text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--d-admin-blue-600)]"
                                />
                                <input
                                  type="text"
                                  value={env.value}
                                  onChange={(e) => {
                                    const newEnvVars = [...envVars];
                                    newEnvVars[index].value = e.target.value;
                                    setEnvVars(newEnvVars);
                                  }}
                                  placeholder="Value"
                                  className="flex-1 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] px-3 py-2 text-sm text-[var(--d-admin-text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--d-admin-blue-600)]"
                                />
                                <button
                                  onClick={() => {
                                    const newEnvVars = envVars.filter(
                                      (_, i) => i !== index,
                                    );
                                    setEnvVars(newEnvVars);
                                  }}
                                  className="rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)] px-3 py-2 text-[var(--d-admin-red-600)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {envVars.length === 0 && (
                              <p className="text-sm text-[var(--d-admin-text-color-secondary)]">
                                No environment variables added.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleDeploy}
                    disabled={!projectName || isDeploying}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--d-admin-blue-600)] px-4 py-3 font-medium text-white transition-colors hover:bg-[var(--d-admin-blue-700)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeploying ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-5 w-5" />
                        Deploy to Vercel
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {deploymentStatus === 'deploying' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative mb-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--d-admin-blue-50)]">
                    <Loader2 className="h-10 w-10 animate-spin text-[var(--d-admin-blue-600)]" />
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-[var(--d-admin-text-color)]">
                  Deploying to Vercel
                </h3>
                <p className="mb-8 text-sm text-[var(--d-admin-text-color-secondary)]">
                  Please wait while we build and deploy your application.
                </p>

                <div className="mb-6 w-full space-y-4">
                  {DEPLOYMENT_STEPS.map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          currentStep > step.id
                            ? 'bg-[var(--d-admin-green-500)]'
                            : currentStep === step.id
                              ? 'bg-[var(--d-admin-blue-600)]'
                              : 'bg-[var(--d-admin-surface-border)]'
                        }`}
                      >
                        {currentStep > step.id && (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        )}
                        {currentStep === step.id && (
                          <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          currentStep >= step.id
                            ? 'font-medium text-[var(--d-admin-text-color)]'
                            : 'text-[var(--d-admin-text-color-secondary)]'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="w-full">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--d-admin-surface-border)]">
                    <div
                      className="h-full bg-[var(--d-admin-blue-600)] transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {deploymentStatus === 'success' && (
              <div className="py-8">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--d-admin-green-50)]">
                    <CheckCircle2 className="h-8 w-8 text-[var(--d-admin-green-500)]" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-[var(--d-admin-text-color)]">
                    Deployment Successful!
                  </h3>
                  <p className="text-sm text-[var(--d-admin-text-color-secondary)]">
                    Your page is now live on Vercel.
                  </p>
                </div>

                <div className="mb-6 space-y-4 rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] p-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--d-admin-text-color-secondary)]">
                      Deployment URL
                    </label>
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[var(--d-admin-blue-600)] hover:underline"
                    >
                      {deploymentUrl.replace('https://', '')}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-md bg-[var(--d-admin-blue-600)] px-4 py-3 text-center font-medium text-white transition-colors hover:bg-[var(--d-admin-blue-700)]"
                  >
                    Visit Website
                  </a>
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-4 py-3 font-medium text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {deploymentStatus === 'error' && (
              <div className="py-8">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--d-admin-red-50)]">
                    <XCircle className="h-8 w-8 text-[var(--d-admin-red-600)]" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-[var(--d-admin-text-color)]">
                    Deployment Failed
                  </h3>
                  <p className="text-sm text-[var(--d-admin-text-color-secondary)]">
                    We encountered an error while deploying your page.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 rounded-lg border border-[var(--d-admin-red-200)] bg-[var(--d-admin-red-50)] p-4">
                    <p className="text-sm font-medium text-[var(--d-admin-red-600)]">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => handleDeploy()}
                    className="flex-1 rounded-md bg-[var(--d-admin-orange-600)] px-4 py-3 font-medium text-white transition-colors hover:bg-[var(--d-admin-orange-700)]"
                  >
                    Retry Deployment
                  </button>
                  <button
                    onClick={() => setDeploymentStatus('idle')}
                    className="flex-1 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-4 py-3 font-medium text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          {!isDeploying && (
            <DialogPrimitive.Close
              onClick={handleClose}
              className={classMixin(
                'absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-1.5',
                'text-[var(--d-admin-text-color-secondary)]',
                'transition-colors hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]',
              )}
            >
              <XMarkIcon className="h-5 w-5" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
