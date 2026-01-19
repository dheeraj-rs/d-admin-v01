'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/common/Modal';
import { useDeployment } from '../lib/hooks/useDeployment';
import { useFilesStore } from '../lib/stores/zustand';
import { extractFilesForDeployment, validateDeploymentFiles } from '../lib/utils/extractFiles';
import { Rocket, Loader2, CheckCircle2, XCircle, ExternalLink, GitBranch, Terminal, ChevronDown, Plus, Trash2, ArrowLeft } from 'lucide-react';

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

export default function DeploymentModal({ isOpen, onClose, chatId }: DeploymentModalProps) {
    const router = useRouter();
    const files = useFilesStore(state => state.files);
    const { status, deploymentUrl, errorMessage, currentStep, progress, deploy, reset } = useDeployment();

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

    const fileCount = Object.keys(files).filter(path => files[path]?.type !== 'folder').length;

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
                        <div className="p-3 rounded-lg">
                            <Rocket className="h-6 w-6 text-[var(--d-admin-surface-text-primary)]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--d-admin-surface-text-primary)]">Deploy to Vercel</h2>
                            <p className="text-sm text-[var(--d-admin-surface-text-secondary)]">Deploy your website to a global edge network</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--d-admin-surface-text-primary)] mb-2">
                                Project Name
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                    placeholder="my-awesome-website"
                                    className="flex-1 px-3 py-2 bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="px-3 py-2 bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] rounded-md text-text-secondary">
                                    .vercel.app
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Project Stats
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-blue-500">{fileCount}</div>
                                    <div className="text-xs text-text-secondary">Files</div>
                                </div>
                                <div className="bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-green-500">
                                        {Object.keys(files).filter(p => p.endsWith('.html')).length}
                                    </div>
                                    <div className="text-xs text-text-secondary">HTML</div>
                                </div>
                                <div className="bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-purple-500">
                                        {Object.keys(files).filter(p => p.endsWith('.css') || p.endsWith('.scss')).length}
                                    </div>
                                    <div className="text-xs text-text-secondary">CSS</div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Configuration Toggle */}
                        <div className="border-t border-[var(--d-admin-surface-border)] pt-4">
                            <div className="flex items-center gap-3 mb-4 ">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={showAdvanced}
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-[var(--d-admin-surface-section)] ${showAdvanced ? 'bg-primary' : 'bg-surface-d'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 bg-white transform rounded-full transition-transform ${showAdvanced ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                                <label className="text-sm font-medium text-primary cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
                                    Advanced Configuration
                                </label>
                            </div>

                            {showAdvanced && (
                                <div className="space-y-3 pl-4 border-l-2 border-[var(--d-admin-surface-border)]">
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">Framework</label>
                                        <select
                                            value={framework}
                                            onChange={(e) => setFramework(e.target.value)}
                                            className="w-full px-3 py-2 bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] rounded-md text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                    <div className="flex gap-3 pt-4 border-t border-[var(--d-admin-surface-border)]">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] text-primary rounded-md font-medium hover:bg-[var(--d-admin-surface-ground)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeploy}
                            disabled={!projectName || fileCount === 0}
                            className="flex-1 px-4 py-2 text-[var(--d-admin-primary-text)] rounded-md font-medium bg-[var(--d-admin-primary-color)] hover:bg-[var(--d-admin-primary-color)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 border border-[var(--d-admin-surface-border)]"
                        >
                            <Rocket className="h-4 w-4" />
                            Deploy to Vercel
                        </button>
                    </div>

                    {fileCount === 0 && (
                        <p className="text-sm text-warning text-center">
                            No files found. Please generate a website first.
                        </p>
                    )}
                </div>
            )}

            {/* Deploying State */}
            {status === 'deploying' && (
                <div className="flex flex-col items-center justify-center py-8 border border-[var(--d-admin-surface-border)]">
                    <div className="mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-primary mb-2">Deploying to Vercel</h2>
                    <p className="text-sm text-text-secondary mb-6">Please wait while we build and deploy your application</p>

                    <div className="w-full max-w-md space-y-3 mb-6">
                        {DEPLOYMENT_STEPS.map((step) => (
                            <div key={step.id} className="flex items-center gap-3">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center ${currentStep > step.id
                                        ? 'bg-green-500'
                                        : currentStep === step.id
                                            ? 'bg-primary'
                                            : 'bg-surface-d'
                                        }`}
                                >
                                    {currentStep > step.id && <CheckCircle2 className="h-4 w-4 text-white" />}
                                    {currentStep === step.id && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                </div>
                                <span className={`text-sm ${currentStep >= step.id ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="w-full max-w-md">
                        <div className="h-3 w-full bg-[var(--d-admin-surface-section)] border border-[var(--d-admin-surface-border)] rounded-full overflow-hidden shadow-sm">
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
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 mb-4">
                            <CheckCircle2 className="h-7 w-7 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Deployment Successful!</h2>
                        <p className="text-sm text-text-secondary">Your website is now live on Vercel</p>
                    </div>

                    <div className="bg-[var(--d-admin-surface-ground)] rounded-lg border border-[var(--d-admin-surface-border)] p-4 space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-[var(--d-admin-surface-text-secondary)] mb-1">Deployment URL</label>
                            <a
                                href={deploymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--d-admin-primary-color)] hover:underline flex items-center gap-2 text-sm"
                            >
                                {deploymentUrl.replace('https://', '')}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-[var(--d-admin-surface-text-secondary)] mb-1">Status</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-sm text-[var(--d-admin-surface-text-primary)]">Ready</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--d-admin-surface-text-secondary)] mb-1">Source</label>
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
                            className="flex-1 px-4 py-2 bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-primary-color)] rounded-md font-medium hover:bg-[var(--d-admin-surface-ground)] transition-colors flex items-center justify-center gap-2 border border-[var(--d-admin-surface-border)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Builder
                        </button>
                        <a
                            href={deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-[var(--d-admin-primary-color)] text-[var(--d-admin-primary-text)] rounded-md font-medium hover:bg-[var(--d-admin-primary-color)]/90 transition-colors text-center flex items-center justify-center gap-2 border border-[var(--d-admin-surface-border)]"
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
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/20 mb-4">
                            <XCircle className="h-7 w-7 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Deployment Failed</h2>
                        <p className="text-sm text-text-secondary">We encountered an error while deploying</p>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                            <p className="text-red-500 text-sm">{errorMessage}</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleBackToBuilder}
                            className="flex-1 px-4 py-2 bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] text-[var(--d-admin-primary-color)] rounded-md font-medium hover:bg-[var(--d-admin-surface-ground)] transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Builder
                        </button>
                        <button
                            onClick={reset}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors border border-transparent"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
