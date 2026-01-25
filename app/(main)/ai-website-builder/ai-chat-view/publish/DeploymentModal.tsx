'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/common/Modal';
import { useDeployment } from '../lib/hooks/useDeployment';
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
  ArrowLeft,
} from 'lucide-react';

const DEPLOYMENT_STEPS = [
  { id: 1, label: 'Initiating deployment...', duration: 1000 },
  { id: 2, label: 'Building project files...', duration: 2000 },
  { id: 3, label: 'Optimizing assets...', duration: 1500 },
  { id: 4, label: 'Uploading to Vercel...', duration: 2000 },
  { id: 5, label: 'Finalizing deployment...', duration: 1000 },
];

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId?: string;
}

export default function DeploymentModal({
  isOpen,
  onClose,
  chatId,
}: DeploymentModalProps) {
  const router = useRouter();
  const files = useFilesStore((state) => state.files);
  const {
    status,
    deploymentUrl,
    errorMessage,
    currentStep,
    progress,
    deploy,
    reset,
  } = useDeployment();

  const [projectName, setProjectName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [framework, setFramework] = useState('other');
  const [rootDirectory, setRootDirectory] = useState('');
  const [buildCommand, setBuildCommand] = useState('');
  const [outputDirectory, setOutputDirectory] = useState('');
  const [installCommand, setInstallCommand] = useState('');
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);

  // Generate unique project name on mount
  useEffect(() => {
    if (isOpen && !projectName) {
      const uniqueSuffix = Math.random().toString(36).substring(2, 7);
      setProjectName(`my-website-${uniqueSuffix}`);
    }
  }, [isOpen, projectName]);

  const handleDeploy = async () => {
    if (!projectName) return;

    try {
      const deploymentFiles = extractFilesForDeployment(files);
      const validation = validateDeploymentFiles(deploymentFiles);

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      await deploy(deploymentFiles, {
        projectName,
        framework: showAdvanced && framework !== 'other' ? framework : null,
        rootDirectory: showAdvanced ? rootDirectory : null,
        buildCommand: showAdvanced ? buildCommand : null,
        outputDirectory: showAdvanced ? outputDirectory : null,
        installCommand: showAdvanced ? installCommand : null,
        envVars: showAdvanced ? envVars : [],
      });
    } catch (error: any) {
      console.error('Deployment error:', error);
    }
  };

  const handleClose = () => {
    if (status !== 'deploying') {
      reset();
      onClose();
    }
  };

  const handleBackToBuilder = () => {
    reset();
    onClose();
  };

  const fileCount = Object.keys(files).filter(
    (path) => files[path]?.type !== 'folder',
  ).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      showCloseButton={status !== 'deploying'}
    >
      {/* Idle State - Configuration */}
      {status === 'idle' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-3">
              <Rocket className="h-6 w-6 text-[var(--d-admin-surface-text-primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--d-admin-surface-text-primary)]">
                Deploy to Vercel
              </h2>
              <p className="text-sm text-[var(--d-admin-surface-text-secondary)]">
                Deploy your website to a global edge network
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--d-admin-surface-text-primary)]">
                Project Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                    )
                  }
                  placeholder="my-awesome-website"
                  className="text-primary focus:ring-primary flex-1 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-3 py-2 focus:ring-2 focus:outline-none"
                />
                <div className="text-text-secondary rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-3 py-2">
                  .vercel.app
                </div>
              </div>
            </div>

            <div>
              <label className="text-primary mb-2 block text-sm font-medium">
                Project Stats
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] p-3 text-center">
                  <div className="text-xl font-bold text-blue-500">
                    {fileCount}
                  </div>
                  <div className="text-text-secondary text-xs">Files</div>
                </div>
                <div className="rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] p-3 text-center">
                  <div className="text-xl font-bold text-green-500">
                    {
                      Object.keys(files).filter((p) => p.endsWith('.html'))
                        .length
                    }
                  </div>
                  <div className="text-text-secondary text-xs">HTML</div>
                </div>
                <div className="rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] p-3 text-center">
                  <div className="text-xl font-bold text-purple-500">
                    {
                      Object.keys(files).filter(
                        (p) => p.endsWith('.css') || p.endsWith('.scss'),
                      ).length
                    }
                  </div>
                  <div className="text-text-secondary text-xs">CSS</div>
                </div>
              </div>
            </div>

            {/* Advanced Configuration Toggle */}
            <div className="border-t border-[var(--d-admin-surface-border)] pt-4">
              <div className="mb-4 flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showAdvanced}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--d-admin-surface-section)] transition-colors ${
                    showAdvanced ? 'bg-primary' : 'bg-surface-d'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-[var(--d-admin-surface-ground)] transition-transform ${
                      showAdvanced ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <label
                  className="text-primary cursor-pointer text-sm font-medium"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  Advanced Configuration
                </label>
              </div>

              {showAdvanced && (
                <div className="space-y-3 border-l-2 border-[var(--d-admin-surface-border)] pl-4">
                  <div>
                    <label className="text-text mb-1 block text-sm font-medium">
                      Framework
                    </label>
                    <select
                      value={framework}
                      onChange={(e) => setFramework(e.target.value)}
                      className="text-primary focus:ring-primary w-full rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    >
                      <option value="html">HTML (Static)</option>
                      <option value="nextjs">Next.js</option>
                      <option value="vite">Vite</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-[var(--d-admin-surface-border)] pt-4">
            <button
              onClick={handleClose}
              className="text-primary flex-1 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-4 py-2 font-medium transition-colors hover:bg-[var(--d-admin-surface-ground)]"
            >
              Cancel
            </button>
            <button
              onClick={handleDeploy}
              disabled={!projectName || fileCount === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-primary-color)] px-4 py-2 font-medium text-[var(--d-admin-primary-text)] transition-colors hover:bg-[var(--d-admin-primary-color)]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Rocket className="h-4 w-4" />
              Deploy to Vercel
            </button>
          </div>

          {fileCount === 0 && (
            <p className="text-warning text-center text-sm">
              No files found. Please generate a website first.
            </p>
          )}
        </div>
      )}

      {/* Deploying State */}
      {status === 'deploying' && (
        <div className="flex flex-col items-center justify-center border border-[var(--d-admin-surface-border)] py-8">
          <div className="mb-6">
            <div className="bg-primary/20 flex h-16 w-16 items-center justify-center rounded-full">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          </div>

          <h2 className="text-primary mb-2 text-xl font-bold">
            Deploying to Vercel
          </h2>
          <p className="text-text-secondary mb-6 text-sm">
            Please wait while we build and deploy your application
          </p>

          <div className="mb-6 w-full max-w-md space-y-3">
            {DEPLOYMENT_STEPS.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    currentStep > step.id
                      ? 'bg-green-500'
                      : currentStep === step.id
                        ? 'bg-primary'
                        : 'bg-surface-d'
                  }`}
                >
                  {currentStep > step.id && (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  )}
                  {currentStep === step.id && (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--d-admin-surface-ground)]" />
                  )}
                </div>
                <span
                  className={`text-sm ${currentStep >= step.id ? 'text-primary font-medium' : 'text-text-secondary'}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-md">
            <div className="h-3 w-full overflow-hidden rounded-full border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] shadow-sm">
              <div
                className="h-full bg-[var(--d-admin-primary-color)] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="space-y-6 border border-[var(--d-admin-surface-border)]">
          <div className="text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-7 w-7 text-green-500" />
            </div>
            <h2 className="text-primary mb-2 text-2xl font-bold">
              Deployment Successful!
            </h2>
            <p className="text-text-secondary text-sm">
              Your website is now live on Vercel
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] p-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--d-admin-surface-text-secondary)]">
                Deployment URL
              </label>
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--d-admin-primary-color)] hover:underline"
              >
                {deploymentUrl.replace('https://', '')}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--d-admin-surface-text-secondary)]">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-[var(--d-admin-surface-text-primary)]">
                    Ready
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--d-admin-surface-text-secondary)]">
                  Source
                </label>
                <div className="flex items-center gap-2 text-sm text-[var(--d-admin-surface-text-primary)]">
                  <GitBranch className="h-3 w-3" />
                  <span>main</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBackToBuilder}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-4 py-2 font-medium text-[var(--d-admin-primary-color)] transition-colors hover:bg-[var(--d-admin-surface-ground)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Builder
            </button>
            <a
              href={deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-primary-color)] px-4 py-2 text-center font-medium text-[var(--d-admin-primary-text)] transition-colors hover:bg-[var(--d-admin-primary-color)]/90"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </a>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
              <XCircle className="h-7 w-7 text-red-500" />
            </div>
            <h2 className="text-primary mb-2 text-2xl font-bold">
              Deployment Failed
            </h2>
            <p className="text-text-secondary text-sm">
              We encountered an error while deploying
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleBackToBuilder}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-ground)] px-4 py-2 font-medium text-[var(--d-admin-primary-color)] transition-colors hover:bg-[var(--d-admin-surface-ground)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Builder
            </button>
            <button
              onClick={reset}
              className="flex-1 rounded-md border border-transparent bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
