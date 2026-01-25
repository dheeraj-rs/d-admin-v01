/**
 * Image Dialog Component
 * Allows users to upload or set image URLs
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import Cropper from 'react-easy-crop';
import { classMixin } from '../../lib/classMixin';
import { getBaseUrl } from '../../lib/builderUtils';
import getCroppedImg from '../../lib/cropUtils';

interface ImageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    element: HTMLImageElement | null;
    standaloneServer: boolean;
}

export function ImageDialog({ isOpen, onClose, element, standaloneServer }: ImageDialogProps) {
    const [url, setUrl] = useState<string>('');
    const [urlText, setUrlText] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);

    // Default aspect ratio to 16/9, but will try to calculate from element
    const [aspect, setAspect] = useState(16 / 9);

    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (element) {
            setUrl(element.getAttribute('src') ?? '');

            // Calculate aspect ratio from element if available
            const { width, height } = element.getBoundingClientRect();
            if (width && height) {
                setAspect(width / height);
            }
        }
    }, [element]);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const uploadedFile = e.target.files![0];
        setFile(uploadedFile);

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target!.result as string;
            setUrl(result);
            setIsCropping(true); // Enable cropping mode when new image uploaded
        };
        reader.readAsDataURL(uploadedFile);
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onSave = async () => {
        if (!element) return;

        if (isCropping && croppedAreaPixels && url) {
            try {
                // Generate cropped image
                const croppedImage = await getCroppedImg(url, croppedAreaPixels);
                // eslint-disable-next-line
                element.src = croppedImage;
            } catch (e) {
                console.error('Failed to crop image', e);
            }
        } else {
            // eslint-disable-next-line
            element.src = url;
        }

        onClose();
        setIsCropping(false);
        setZoom(1);
    };

    const onCancel = () => {
        onClose();
        setIsCropping(false);
        setZoom(1);
    };

    // Media size for "original" aspect ratio
    const [mediaSize, setMediaSize] = useState<{ width: number; height: number } | null>(null);
    const [resetAspectOnLoad, setResetAspectOnLoad] = useState(false);

    const onMediaLoaded = (mediaSize: { width: number; height: number; naturalWidth: number; naturalHeight: number }) => {
        setMediaSize({ width: mediaSize.naturalWidth, height: mediaSize.naturalHeight });
        if (resetAspectOnLoad) {
            setAspect(mediaSize.naturalWidth / mediaSize.naturalHeight);
            setResetAspectOnLoad(false);
        }
    };

    // Trigger reset on new upload
    const onUploadWithReset = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetAspectOnLoad(true);
        onUpload(e);
    };

    const setAspectRatio = (ratio: number | undefined) => {
        if (ratio === undefined && mediaSize) {
            setAspect(mediaSize.width / mediaSize.height);
        } else if (ratio !== undefined) {
            setAspect(ratio);
        }
    };

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay>
                    <DialogPrimitive.Content
                        className={classMixin(
                            'fixed shadow bg-(--d-admin-surface-card) rounded-lg p-4',
                            'w-[95vw] md:w-full max-w-md', // Revert to standard size
                            'max-h-[90vh] flex flex-col', // Mobile optimization: constrained height
                            'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                            'z-50'
                        )}
                    >
                        <DialogPrimitive.Title className="text-sm font-medium text-(--d-admin-text-color) shrink-0">
                            {isCropping ? 'Crop Image' : 'Upload Image'}
                        </DialogPrimitive.Title>

                        <div className="mt-4 mb-4 flex-1 min-h-0 flex flex-col">
                            {!url || !isCropping ? (
                                <div>
                                    <div className="flex justify-center mt-8 mb-4">
                                        <input ref={input} type="file" onChange={onUpload} style={{ display: 'none' }} accept="image/*" />
                                        <button
                                            className="rounded-md px-4 py-2 text-sm font-medium bg-transparent border-(--d-admin-blue-600) text-(--d-admin-blue-600) hover:bg-(--d-admin-blue-700) hover:text-(--d-admin-text-color) border"
                                            onClick={() => input.current?.click()}
                                        >
                                            Upload
                                        </button>
                                    </div>
                                    <div className="flex justify-center mb-4">OR</div>
                                    <div className="flex justify-center mb-4">
                                        <input
                                            type="text"
                                            className="bg-(--d-admin-surface-ground) border border-(--d-admin-surface-border) text-(--d-admin-text-color) text-sm rounded-lg block w-full p-2.5"
                                            placeholder="Eg. https://www.w3schools.com/html/pic_trulli.jpg"
                                            onChange={(e) => setUrlText(e.target.value)}
                                        />
                                        <button
                                            onClick={() => {
                                                setUrl(urlText);
                                                setIsCropping(true);
                                                // Default to element aspect ratio, no reset needed as we removed the logic
                                            }}
                                            className={classMixin(
                                                'rounded-md px-4 py-2 text-sm font-medium bg-transparent border',
                                                'text-(--d-admin-blue-600) hover:opacity-50 border border-transparent',
                                                `${urlText !== '' ? 'hover:opacity-50' : 'opacity-50 cursor-not-allowed'}`
                                            )}
                                            disabled={urlText === ''}
                                        >
                                            Set
                                        </button>
                                    </div>
                                    {/* Preview existing if available */}
                                    {url && (
                                        <div className="mt-4 flex justify-center">
                                            <img src={url} alt="Current" className="max-h-40 object-contain rounded" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col h-64 md:h-80 relative shrink-0">
                                    <div className="relative flex-1 bg-black rounded overflow-hidden">
                                        <Cropper
                                            image={url}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={aspect}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                            onMediaLoaded={onMediaLoaded}
                                        />
                                    </div>

                                    {/* Controls Container */}
                                    <div className="mt-4 flex flex-col space-y-3">
                                        {/* Zoom Slider */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-(--d-admin-text-color-secondary) w-12">Zoom:</span>
                                            <input
                                                type="range"
                                                value={zoom}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                aria-labelledby="Zoom"
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        {/* Aspect Ratio controls removed per user request */}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto flex justify-end pt-2">
                            {url && !isCropping && (
                                <button
                                    style={{ marginRight: 'auto' }}
                                    className={classMixin(
                                        'rounded-md px-4 py-2 text-sm font-medium bg-transparent border',
                                        'text-(--d-admin-blue-600) hover:opacity-50 border border-transparent'
                                    )}
                                    // Reset to upload mode
                                    onClick={() => {
                                        input.current?.click();
                                    }}
                                >
                                    Replace
                                </button>
                            )}

                            {isCropping && (
                                <button
                                    style={{ marginRight: 'auto' }}
                                    className={classMixin(
                                        'rounded-md px-4 py-2 text-sm font-medium bg-transparent border',
                                        'text-(--d-admin-text-color-secondary) hover:text-(--d-admin-text-color) border border-transparent'
                                    )}
                                    onClick={() => setIsCropping(false)}
                                >
                                    Back
                                </button>
                            )}

                            <DialogPrimitive.Close
                                onClick={onSave}
                                className={classMixin(
                                    'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
                                    `bg-(--d-admin-blue-600) text-(--d-admin-text-color) border border-transparent ${url ? 'hover:bg-(--d-admin-blue-700)' : 'opacity-50 cursor-not-allowed'
                                    }`
                                )}
                                disabled={!url}
                            >
                                {isCropping ? 'Crop & Save' : 'Save'}
                            </DialogPrimitive.Close>
                        </div>

                        <DialogPrimitive.Close
                            onClick={onCancel}
                            className={classMixin(
                                'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1'
                            )}
                        >
                            <XMarkIcon className="h-4 w-4 text-(--d-admin-text-color-secondary) hover:text-(--d-admin-text-color)" />
                        </DialogPrimitive.Close>
                    </DialogPrimitive.Content>
                </DialogPrimitive.Overlay>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
