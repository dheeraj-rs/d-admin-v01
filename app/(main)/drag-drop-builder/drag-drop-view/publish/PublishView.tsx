'use client';

import { useState, useEffect } from 'react';
import {
  Rocket,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

const DEPLOYMENT_STEPS = [
  { id: 1, label: 'Initiating deployment...', duration: 1000 },
  { id: 2, label: 'Building project files...', duration: 2000 },
  { id: 3, label: 'Optimizing assets...', duration: 1500 },
  { id: 4, label: 'Uploading to Vercel...', duration: 2000 },
  { id: 5, label: 'Finalizing deployment...', duration: 1000 },
];

export default function PublishView() {
  const [htmlContent, setHtmlContent] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<
    'idle' | 'deploying' | 'success' | 'error'
  >('idle');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Advanced Configuration State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);

  // Loading state
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // AI Fix State
  const [errorLogs, setErrorLogs] = useState('');
  const [isFixing, setIsFixing] = useState(false);
  const [suggestedFixes, setSuggestedFixes] = useState<string[]>([]);

  // Load HTML content and generate project name on mount
  useEffect(() => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    setProjectName(`my-page-${uniqueSuffix}`);

    // Load saved HTML from localStorage (saved by DragDropBuilder)
    const savedHtml = localStorage.getItem('drag-drop-builder-html');
    if (savedHtml) {
      setHtmlContent(savedHtml);
    }
  }, []);

  const getDeploymentFormat = () => {
    return localStorage.getItem('drag-drop-builder-format') || 'html';
  };

  /**
   * Extract all image URLs from HTML content that reference the /uploaded/ folder
   */
  const extractUploadedImageUrls = (htmlContent: string): string[] => {
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    const urls: string[] = [];
    let match;

    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const url = match[1];
      // Only include images from the /uploaded/ folder
      if (url.includes('/uploaded/')) {
        urls.push(url);
      }
    }

    return [...new Set(urls)]; // Remove duplicates
  };

  /**
   * Fetch an image and convert it to base64 data URI
   */
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
      return imageUrl; // Return original URL if fetch fails
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
            setErrorLogs(
              data.error?.logs || JSON.stringify(data.error || {}, null, 2),
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
      // Extract uploaded image URLs and convert to base64
      const imageUrls = extractUploadedImageUrls(htmlContent);

      // Convert images to base64 and replace in HTML
      let processedHtml = htmlContent;
      for (const imageUrl of imageUrls) {
        const base64 = await fetchImageAsBase64(imageUrl);
        // Replace all occurrences of this image URL with base64
        processedHtml = processedHtml.replace(
          new RegExp(imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          base64,
        );
      }

      // Convert HTML content to deployable files with embedded images
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

      const deploymentFiles = [
        {
          path: 'index.html',
          content: fullHTML,
        },
      ];

      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          files: deploymentFiles,
          framework: null, // Static HTML deployment
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
      setErrorLogs(error.stack || error.toString());
      setIsDeploying(false);
    }
  };

  const handleAIFix = async () => {
    setIsFixing(true);
    setSuggestedFixes([]);

    try {
      const response = await fetch('/api/fix-deployment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorLogs,
          htmlContent,
          projectName,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuggestedFixes(result.fixes || []);

        // Apply the fixed HTML
        if (result.fixedHtml) {
          setHtmlContent(result.fixedHtml);
          localStorage.setItem('drag-drop-builder-html', result.fixedHtml);
        }

        // Auto-retry deployment with fixes after a short delay
        setTimeout(async () => {
          setIsFixing(false);
          await handleDeploy();
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to fix deployment');
      }
    } catch (error: any) {
      console.error('AI fix error:', error);
      setErrorMessage(`AI Fix Failed: ${error.message}`);
      setIsFixing(false);
    }
  };

  const hasContent = htmlContent.trim().length > 0;

  return (
    <div className="flex h-screen flex-col bg-(--d-admin-surface-section) text-(--d-admin-text-color)">
      {/* Header */}
      <div className="border-b border-(--d-admin-border) bg-(--d-admin-surface-section) px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/drag-drop-builder"
            className="text-(--d-admin-text-color-secondary) transition-colors hover:text-(--d-admin-text-color)"
          >
            ← Back to Builder
          </Link>
          <div className="h-6 w-px bg-(--d-admin-surface-border)" />
          <h1 className="text-xl font-semibold text-(--d-admin-text-color)">
            Deploy to Vercel
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-4xl p-8">
          {deploymentStatus === 'idle' && (
            <>
              <div className="mb-8">
                <div className="mb-2 flex items-center gap-3">
                  <Rocket className="h-8 w-8 text-(--d-admin-blue-600)" />
                  <h2 className="text-3xl font-bold text-(--d-admin-text-color)">
                    Deploy to Vercel
                  </h2>
                </div>
                <p className="text-(--d-admin-text-color-secondary)">
                  Deploy your page to a global edge network with a single click.
                </p>
              </div>

              <div className="mb-6 rounded-lg border border-(--d-admin-surface-border) bg-(--d-admin-surface-card) p-6">
                <h3 className="mb-4 text-xl font-semibold text-(--d-admin-text-color)">
                  Deployment Configuration
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-(--d-admin-text-color-secondary)">
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
                        className="flex-1 rounded-md border border-(--d-admin-surface-border) bg-(--d-admin-surface-ground) px-3 py-2 text-(--d-admin-text-color) focus:ring-2 focus:ring-(--d-admin-blue-500) focus:outline-none"
                      />
                      <div className="rounded-md border border-(--d-admin-surface-border) bg-(--d-admin-surface-hover) px-3 py-2 text-(--d-admin-text-color-secondary)">
                        .vercel.app
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-(--d-admin-surface-border) pt-4">
                    <div className="mb-4 flex items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={showAdvanced}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          showAdvanced
                            ? 'bg-(--d-admin-blue-600)'
                            : 'bg-(--d-admin-surface-border)'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-(--d-admin-surface-card) transition-transform ${
                            showAdvanced ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <label
                        className="cursor-pointer text-sm font-medium text-(--d-admin-text-color-secondary)"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        Enable Advanced Configuration
                      </label>
                    </div>

                    {showAdvanced && (
                      <div className="space-y-4 border-l-2 border-blue-200 pl-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium text-(--d-admin-text-color-secondary)">
                              Environment Variables
                            </label>
                            <button
                              onClick={() =>
                                setEnvVars([...envVars, { key: '', value: '' }])
                              }
                              className="flex items-center gap-1 rounded-md border border-(--d-admin-surface-border) bg-(--d-admin-surface-ground) px-2 py-1 text-sm text-(--d-admin-text-color) transition-colors hover:bg-(--d-admin-surface-hover)"
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
                                  className="flex-1 rounded-md border border-(--d-admin-surface-border) bg-(--d-admin-surface-ground) px-3 py-2 text-(--d-admin-text-color) focus:ring-2 focus:ring-(--d-admin-blue-500) focus:outline-none"
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
                                  className="flex-1 rounded-md border border-(--d-admin-surface-border) bg-(--d-admin-surface-ground) px-3 py-2 text-(--d-admin-text-color) focus:ring-2 focus:ring-(--d-admin-blue-500) focus:outline-none"
                                />
                                <button
                                  onClick={() => {
                                    const newEnvVars = envVars.filter(
                                      (_, i) => i !== index,
                                    );
                                    setEnvVars(newEnvVars);
                                  }}
                                  className="rounded-md border border-(--d-admin-surface-border) bg-(--d-admin-surface-ground) px-3 py-2 text-(--d-admin-red-600) transition-colors hover:bg-(--d-admin-surface-hover)"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {envVars.length === 0 && (
                              <p className="text-sm text-gray-500">
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
                    disabled={!projectName || isDeploying || !hasContent}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-(--d-admin-blue-600) px-4 py-3 font-medium text-(--d-admin-text-color) transition-colors hover:bg-(--d-admin-blue-700) disabled:cursor-not-allowed disabled:opacity-50"
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

                  {!hasContent && (
                    <p className="text-center text-sm text-(--d-admin-orange-500)">
                      No content found. Please create a page in the builder
                      first.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {deploymentStatus === 'deploying' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-(--d-admin-blue-50)">
                  <Loader2 className="h-10 w-10 animate-spin text-(--d-admin-blue-600)" />
                </div>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-(--d-admin-text-color)">
                Deploying to Vercel
              </h2>
              <p className="mb-8 text-(--d-admin-text-color-secondary)">
                Please wait while we build and deploy your application.
              </p>

              <div className="mb-6 w-full max-w-md space-y-4">
                {DEPLOYMENT_STEPS.map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentStep > step.id
                          ? 'bg-(--d-admin-green-500)'
                          : currentStep === step.id
                            ? 'bg-(--d-admin-blue-600)'
                            : 'bg-(--d-admin-surface-border)'
                      }`}
                    >
                      {currentStep > step.id && (
                        <CheckCircle2 className="h-5 w-5 text-(--d-admin-surface-ground)" />
                      )}
                      {currentStep === step.id && (
                        <div className="h-3 w-3 animate-pulse rounded-full bg-(--d-admin-surface-ground)" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        currentStep >= step.id
                          ? 'font-medium text-(--d-admin-text-color)'
                          : 'text-(--d-admin-text-color-secondary)'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full max-w-md">
                <div className="h-2 w-full overflow-hidden rounded-full bg-(--d-admin-surface-border)">
                  <div
                    className="h-full bg-(--d-admin-blue-600) transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {deploymentStatus === 'success' && (
            <div className="py-8">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-(--d-admin-surface-d)">
                  <CheckCircle2 className="h-8 w-8 text-(--d-admin-green-500)" />
                </div>
                <h2 className="mb-2 text-3xl font-bold text-(--d-admin-text-color)">
                  Deployment Successful!
                </h2>
                <p className="text-(--d-admin-text-color-secondary)">
                  Your page is now live on Vercel.
                </p>
              </div>

              <div className="mb-6 rounded-lg border border-(--d-admin-surface-border) bg-(--d-admin-surface-card) p-6">
                <h3 className="mb-4 text-lg font-semibold text-(--d-admin-text-color)">
                  Deployment Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-(--d-admin-text-color-secondary)">
                      Deployment URL
                    </label>
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-(--d-admin-blue-600) hover:underline"
                    >
                      {deploymentUrl.replace('https://', '')}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-(--d-admin-text-color-secondary)">
                        Status
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-(--d-admin-green-500)" />
                        <span className="text-(--d-admin-text-color)">
                          Ready
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-(--d-admin-text-color-secondary)">
                        Created
                      </label>
                      <div className="text-(--d-admin-text-color)">
                        Just now
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-md bg-blue-600 px-4 py-3 text-center font-medium text-(--d-admin-text-color) transition-colors hover:bg-blue-700"
                >
                  Visit Website
                </a>
                <button
                  onClick={() => {
                    setDeploymentStatus('idle');
                    setDeploymentUrl('');
                  }}
                  className="flex-1 rounded-md border border-(--d-admin-surface-border) bg-(--d-admin-surface-ground) px-4 py-3 font-medium text-(--d-admin-text-color) transition-colors hover:bg-(--d-admin-surface-hover)"
                >
                  Deploy Another
                </button>
              </div>
            </div>
          )}

          {deploymentStatus === 'error' && (
            <div className="py-8">
              {/* Error Header */}
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-(--d-admin-red-50)">
                  <XCircle className="h-8 w-8 text-(--d-admin-red-600)" />
                </div>
                <h2 className="mb-2 text-3xl font-bold text-(--d-admin-text-color)">
                  Deployment Failed
                </h2>
                <p className="text-(--d-admin-text-color-secondary)">
                  We encountered an error while deploying your page.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 rounded-lg border border-(--d-admin-red-200) bg-(--d-admin-red-50) p-4">
                  <p className="text-sm font-medium text-(--d-admin-red-600)">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Error Logs (Expandable) */}
              {errorLogs && (
                <details className="mb-6 rounded-lg border border-(--d-admin-surface-border) bg-(--d-admin-surface-ground) p-4">
                  <summary className="cursor-pointer text-sm font-medium text-(--d-admin-text-color) transition-colors hover:text-(--d-admin-blue-600)">
                    📋 View Error Logs
                  </summary>
                  <pre className="mt-3 max-h-64 overflow-x-auto overflow-y-auto rounded border border-(--d-admin-surface-border) bg-(--d-admin-surface-section) p-3 text-xs whitespace-pre-wrap text-(--d-admin-text-color-secondary)">
                    {errorLogs}
                  </pre>
                </details>
              )}

              {/* AI Suggested Fixes */}
              {suggestedFixes.length > 0 && (
                <div className="mb-6 rounded-lg border border-(--d-admin-blue-200) bg-(--d-admin-blue-50) p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-(--d-admin-blue-900)">
                    <span>✨</span> AI Suggested Fixes:
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-(--d-admin-blue-700)">
                    {suggestedFixes.map((fix, index) => (
                      <li key={index}>{fix}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAIFix}
                  disabled={isFixing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-(--d-admin-blue-600) px-4 py-3 font-medium text-white transition-colors hover:bg-(--d-admin-blue-700) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isFixing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing & Fixing...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Fix with AI
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeploy()}
                  disabled={isFixing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-(--d-admin-orange-600) px-4 py-3 font-medium text-white transition-colors hover:bg-(--d-admin-orange-700) disabled:opacity-50"
                >
                  <Rocket className="h-5 w-5" />
                  Retry Deployment
                </button>

                <button
                  onClick={() => {
                    setDeploymentStatus('idle');
                    setErrorMessage('');
                    setErrorLogs('');
                    setSuggestedFixes([]);
                  }}
                  disabled={isFixing}
                  className="flex-1 rounded-md border border-(--d-admin-surface-border) bg-(--d-admin-surface-ground) px-4 py-3 font-medium text-(--d-admin-text-color) transition-colors hover:bg-(--d-admin-surface-hover) disabled:opacity-50"
                >
                  Back to Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
