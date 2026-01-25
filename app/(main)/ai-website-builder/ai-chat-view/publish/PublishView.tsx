'use client';

import { useState, useEffect } from 'react';
import { useFilesStore } from '../lib/stores/zustand';
import {
  extractFilesForDeployment,
  validateDeploymentFiles,
} from '../lib/utils/extractFiles';
import {
  Rocket,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  GitBranch,
  Terminal,
  ChevronDown,
  Plus,
  Trash2,
} from 'lucide-react';

const DEPLOYMENT_STEPS = [
  { id: 1, label: 'Initiating deployment...', duration: 1000 },
  { id: 2, label: 'Building project files...', duration: 2000 },
  { id: 3, label: 'Optimizing assets...', duration: 1500 },
  { id: 4, label: 'Uploading to Vercel...', duration: 2000 },
  { id: 5, label: 'Finalizing deployment...', duration: 1000 },
];

export default function PublishView() {
  const files = useFilesStore((state) => state.files);

  const [projectName, setProjectName] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<
    'idle' | 'deploying' | 'success' | 'error'
  >('idle');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Advanced Configuration State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [framework, setFramework] = useState('other');
  const [rootDirectory, setRootDirectory] = useState('');
  const [buildCommand, setBuildCommand] = useState('');
  const [outputDirectory, setOutputDirectory] = useState('');
  const [installCommand, setInstallCommand] = useState('');
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);

  // Loading state
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Generate unique project name on mount
  useEffect(() => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    setProjectName(`my-website-${uniqueSuffix}`);
  }, []);

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
            setErrorMessage('Deployment failed or was canceled by Vercel.');
            setIsDeploying(false);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  };

  const handleDeploy = async () => {
    if (!projectName) return;

    setIsDeploying(true);
    setDeploymentStatus('deploying');
    setErrorMessage('');
    setCurrentStep(0);
    setProgress(0);

    try {
      // Extract files from WebContainer
      const deploymentFiles = extractFilesForDeployment(files);

      // Validate files
      const validation = validateDeploymentFiles(deploymentFiles);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          files: deploymentFiles,
          framework: showAdvanced && framework !== 'other' ? framework : null,
          rootDirectory: showAdvanced ? rootDirectory : null,
          buildCommand: showAdvanced ? buildCommand : null,
          outputDirectory: showAdvanced ? outputDirectory : null,
          installCommand: showAdvanced ? installCommand : null,
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

  const fileCount = Object.keys(files).filter(
    (path) => files[path]?.type !== 'folder',
  ).length;

  return (
    <div className="bg-surface-primary flex h-full flex-col overflow-auto">
      <div className="mx-auto w-full max-w-4xl p-8">
        {deploymentStatus === 'idle' && (
          <>
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-3">
                <Rocket className="text-primary h-8 w-8" />
                <h1 className="text-primary text-3xl font-bold">
                  Deploy to Vercel
                </h1>
              </div>
              <p className="text-secondary">
                Deploy your website to a global edge network with a single
                click.
              </p>
            </div>

            <div className="bg-surface-secondary border-border mb-6 rounded-lg border p-6">
              <h2 className="text-primary mb-4 text-xl font-semibold">
                Deployment Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-primary mb-2 block text-sm font-medium">
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
                      placeholder="my-awesome-website"
                      className="bg-surface-primary border-border text-primary focus:ring-primary flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    />
                    <div className="bg-surface-tertiary border-border text-secondary rounded-md border px-3 py-2">
                      .vercel.app
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-primary mb-2 block text-sm font-medium">
                    Project Stats
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-surface-primary border-border rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {fileCount}
                      </div>
                      <div className="text-secondary text-sm">Files</div>
                    </div>
                    <div className="bg-surface-primary border-border rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {
                          Object.keys(files).filter((p) => p.endsWith('.html'))
                            .length
                        }
                      </div>
                      <div className="text-secondary text-sm">HTML</div>
                    </div>
                    <div className="bg-surface-primary border-border rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold text-purple-500">
                        {
                          Object.keys(files).filter(
                            (p) => p.endsWith('.css') || p.endsWith('.scss'),
                          ).length
                        }
                      </div>
                      <div className="text-secondary text-sm">CSS</div>
                    </div>
                  </div>
                </div>

                <div className="border-border border-t pt-4">
                  <div className="mb-4 flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showAdvanced}
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showAdvanced ? 'bg-primary' : 'bg-surface-tertiary'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                          showAdvanced ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <label
                      className="text-primary cursor-pointer text-sm font-medium"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      Enable Advanced Configuration
                    </label>
                  </div>

                  {showAdvanced && (
                    <div className="border-primary/20 space-y-4 border-l-2 pl-4">
                      <div>
                        <label className="text-primary mb-2 block text-sm font-medium">
                          Framework Preset
                        </label>
                        <div className="relative">
                          <select
                            value={framework}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFramework(value);
                              switch (value) {
                                case 'nextjs':
                                  setBuildCommand('next build');
                                  setOutputDirectory('.next');
                                  setInstallCommand('npm install');
                                  break;
                                case 'vite':
                                  setBuildCommand('vite build');
                                  setOutputDirectory('dist');
                                  setInstallCommand('npm install');
                                  break;
                                default:
                                  setBuildCommand('');
                                  setOutputDirectory('');
                                  setInstallCommand('');
                              }
                            }}
                            className="bg-surface-primary border-border text-primary focus:ring-primary w-full appearance-none rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                          >
                            <option value="html">HTML (Static)</option>
                            <option value="nextjs">Next.js</option>
                            <option value="vite">Vite</option>
                            <option value="other">Other</option>
                          </select>
                          <ChevronDown className="text-secondary pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="text-primary mb-2 block text-sm font-medium">
                          Build Command
                        </label>
                        <input
                          type="text"
                          value={buildCommand}
                          onChange={(e) => setBuildCommand(e.target.value)}
                          placeholder="npm run build"
                          className="bg-surface-primary border-border text-primary focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-primary mb-2 block text-sm font-medium">
                          Output Directory
                        </label>
                        <input
                          type="text"
                          value={outputDirectory}
                          onChange={(e) => setOutputDirectory(e.target.value)}
                          placeholder="dist"
                          className="bg-surface-primary border-border text-primary focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-primary block text-sm font-medium">
                            Environment Variables
                          </label>
                          <button
                            onClick={() =>
                              setEnvVars([...envVars, { key: '', value: '' }])
                            }
                            className="bg-surface-primary border-border text-primary hover:bg-surface-tertiary flex items-center gap-1 rounded-md border px-2 py-1 text-sm transition-colors"
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
                                className="bg-surface-primary border-border text-primary focus:ring-primary flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
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
                                className="bg-surface-primary border-border text-primary focus:ring-primary flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const newEnvVars = envVars.filter(
                                    (_, i) => i !== index,
                                  );
                                  setEnvVars(newEnvVars);
                                }}
                                className="bg-surface-primary border-border text-error hover:bg-surface-tertiary rounded-md border px-3 py-2 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {envVars.length === 0 && (
                            <p className="text-secondary text-sm">
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
                  disabled={!projectName || isDeploying || fileCount === 0}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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

                {fileCount === 0 && (
                  <p className="text-warning text-center text-sm">
                    No files found. Please generate a website first using the
                    chat.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {deploymentStatus === 'deploying' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-8">
              <div className="bg-primary/20 flex h-20 w-20 items-center justify-center rounded-full">
                <Loader2 className="text-primary h-10 w-10 animate-spin" />
              </div>
            </div>

            <h2 className="text-primary mb-2 text-2xl font-bold">
              Deploying to Vercel
            </h2>
            <p className="text-secondary mb-8">
              Please wait while we build and deploy your application.
            </p>

            <div className="mb-6 w-full max-w-md space-y-4">
              {DEPLOYMENT_STEPS.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep > step.id
                        ? 'bg-green-500'
                        : currentStep === step.id
                          ? 'bg-primary'
                          : 'bg-surface-tertiary'
                    }`}
                  >
                    {currentStep > step.id && (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                    {currentStep === step.id && (
                      <div className="h-3 w-3 animate-pulse rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      currentStep >= step.id
                        ? 'text-primary font-medium'
                        : 'text-secondary'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full max-w-md">
              <div className="bg-surface-tertiary border-border h-3 w-full overflow-hidden rounded-full border shadow-sm">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {deploymentStatus === 'success' && (
          <div className="py-8">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-primary mb-2 text-3xl font-bold">
                Deployment Successful!
              </h1>
              <p className="text-secondary">
                Your website is now live on Vercel.
              </p>
            </div>

            <div className="bg-surface-secondary border-border mb-6 rounded-lg border p-6">
              <h3 className="text-primary mb-4 text-lg font-semibold">
                Deployment Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-secondary mb-1 block text-sm font-medium">
                    Deployment URL
                  </label>
                  <a
                    href={deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-2 hover:underline"
                  >
                    {deploymentUrl.replace('https://', '')}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-secondary mb-1 block text-sm font-medium">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-primary">Ready</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-secondary mb-1 block text-sm font-medium">
                      Created
                    </label>
                    <div className="text-primary">Just now</div>
                  </div>
                </div>

                <div>
                  <label className="text-secondary mb-1 block text-sm font-medium">
                    Source
                  </label>
                  <div className="text-primary flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span>main</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-md px-4 py-3 text-center font-medium transition-colors"
              >
                Visit Website
              </a>
              <button
                onClick={() => {
                  setDeploymentStatus('idle');
                  setDeploymentUrl('');
                }}
                className="bg-surface-secondary border-border text-primary hover:bg-surface-tertiary flex-1 rounded-md border px-4 py-3 font-medium transition-colors"
              >
                Deploy Another
              </button>
            </div>

            <div className="bg-surface-secondary border-border text-secondary mt-6 flex items-center gap-3 rounded-lg border p-4 text-sm">
              <Terminal className="h-4 w-4" />
              <span>To deploy to Production, run </span>
              <code className="bg-surface-primary text-primary rounded px-2 py-1">
                vercel --prod
              </code>
              <span> via the CLI.</span>
            </div>
          </div>
        )}

        {deploymentStatus === 'error' && (
          <div className="py-8">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-primary mb-2 text-3xl font-bold">
                Deployment Failed
              </h1>
              <p className="text-secondary">
                We encountered an error while deploying your website.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-sm text-red-500">{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setDeploymentStatus('idle');
                  setErrorMessage('');
                }}
                className="flex-1 rounded-md bg-red-500 px-4 py-3 font-medium text-[var(--d-admin-text-color)] transition-colors hover:bg-red-600"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setDeploymentStatus('idle');
                  setErrorMessage('');
                }}
                className="bg-surface-secondary border-border text-primary hover:bg-surface-tertiary flex-1 rounded-md border px-4 py-3 font-medium transition-colors"
              >
                Back to Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
