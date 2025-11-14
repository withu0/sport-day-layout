import React, { useRef, useState, useCallback } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

interface SmartImageUploadProps {
  onImageUpload: (file: File) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  previewMaxHeight?: number;
  dragText?: string;
  clickText?: string;
  currentPhoto?: {
    image: HTMLImageElement;
    isSelected: boolean;
  } | null;
  onRemovePhoto?: () => void;
}

const SmartImageUpload: React.FC<SmartImageUploadProps> = ({
  onImageUpload,
  onError,
  className = '',
  disabled = false,
  showPreview = true,
  previewMaxHeight = 200,
  dragText = 'Drag & drop an image here',
  clickText = 'click to select',
  currentPhoto = null,
  onRemovePhoto
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }

    return null;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (disabled) return;

    setIsLoading(true);
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (onError) onError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Create preview
      if (showPreview) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }

      // Call the upload handler
      onImageUpload(file);
    } catch (err) {
      const errorMessage = 'Failed to process image';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [disabled, validateFile, showPreview, onImageUpload, onError]);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, handleFile]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [disabled, handleFile]);

  const handleClick = useCallback(() => {
    if (disabled || isLoading) return;
    inputRef.current?.click();
  }, [disabled, isLoading]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled || isLoading) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [disabled, isLoading, handleClick]);

  const clearPreview = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setError(null);
  }, [preview]);

  // Sync with external photo state
  React.useEffect(() => {
    if (currentPhoto) {
      // If there's a current photo, use its image source
      setPreview(currentPhoto.image.src);
    } else {
      // If no current photo, clear the preview
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
    }
  }, [currentPhoto, preview]);

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const baseClasses = `
    relative border-2 border-dashed rounded-lg p-2 text-center cursor-pointer
    transition-all duration-200 ease-in-out
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
    ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
    ${error ? 'border-red-500 bg-red-50' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      <div
        className={baseClasses}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Upload image"
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-text-secondary">Processing image...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-red-500">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto mx-auto rounded"
              style={{ maxHeight: `${previewMaxHeight}px` }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRemovePhoto) {
                  onRemovePhoto();
                } else {
                  clearPreview();
                }
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="text-text-muted">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary">
                {dragText}
              </p>
              <p className="text-xs text-text-secondary">
                or <span className="text-primary underline font-medium">{clickText}</span>
              </p>
            </div>
            {/* <div className="text-xs text-text-muted">
              <p>Any image format accepted</p>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartImageUpload;
