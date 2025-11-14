import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Rect, Group } from 'react-konva';
import { templates } from '../data/templates';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import SmartImageUpload from '../components/SmartImageUpload';

interface PhotoData {
  id: string;
  image: HTMLImageElement;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
  extendedOpacity: number;
  isSelected: boolean;
}

function PhotoEditor() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const transformerRefs = useRef<{ [key: string]: any }>({});
  const stageRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 600, height: 776 });

  const template = templates.find(t => t.id === templateId);

  // Handle transformer updates for individual stages
  useEffect(() => {
    if (selectedId && transformerRefs.current[selectedId]) {
      // Force transformer to update by calling getLayer().batchDraw()
      const layer = transformerRefs.current[selectedId].getLayer();
      if (layer) {
        layer.batchDraw();
      }
    }
  }, [selectedId]);

  // Clean up transformers when photos are removed
  useEffect(() => {
    const currentPhotoIds = photos.map(p => p.id);
    Object.keys(transformerRefs.current).forEach(id => {
      if (!currentPhotoIds.includes(id)) {
        delete transformerRefs.current[id];
      }
    });
  }, [photos]);

  // Handle responsive stage sizing
  useEffect(() => {
    const updateStageSize = () => {
      const container = document.querySelector('.paper-preview-container');
      if (container) {
        const containerWidth = container.clientWidth;
        const aspectRatio = 8.5 / 11;
        const newWidth = Math.min(containerWidth, 600);
        const newHeight = newWidth / aspectRatio;
        setStageSize({ width: newWidth, height: newHeight });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  // Helper function to calculate proper scaling to fit image to slot
  const calculateFitScale = (image: HTMLImageElement, slotId: string) => {
    const slot = template?.layout.find(s => s.id === slotId);
    if (!slot) return { scaleX: 1, scaleY: 1 };

    const slotWidth = (slot.width / 8.5) * stageSize.width;
    const slotHeight = (slot.height / 11) * stageSize.height;
    const imageAspectRatio = image.width / image.height;
    const slotAspectRatio = slotWidth / slotHeight;

    let scaleX, scaleY;
    if (imageAspectRatio > slotAspectRatio) {
      // Image is wider than slot, fit to height
      scaleX = scaleY = slotHeight / image.height;
    } else {
      // Image is taller than slot, fit to width
      scaleX = scaleY = slotWidth / image.width;
    }

    return { scaleX, scaleY };
  };

  const handleImageUpload = (file: File, slotId: string) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const slot = template?.layout.find(s => s.id === slotId);
        if (!slot) return;

        // Calculate scale to fit image to slot dimensions
        const { scaleX, scaleY } = calculateFitScale(img, slotId);

        const newPhoto: PhotoData = {
          id: slotId,
          image: img,
          x: 0, // Start at origin of individual canvas
          y: 0,
          scaleX: scaleX,
          scaleY: scaleY,
          rotation: 0,
          opacity: 1,
          extendedOpacity: 0.3,
          isSelected: false
        };

        setPhotos(prev => {
          const filtered = prev.filter(p => p.id !== slotId);
          return [...filtered, newPhoto];
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePaperClick = () => {
    // Clear selection and hide transformers when clicking on paper background
    setSelectedId(null);
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      isSelected: false
    })));
  };

  // Photo interaction handlers are now handled within each individual Stage component

  const handlePrint = () => {
    // Check if there are any photos to print
    if (photos.length === 0) {
      alert('Please upload at least one photo before printing.');
      return;
    }
    
    // Unselect all photos to hide selection lines and control points
    setSelectedId(null);
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      isSelected: false
    })));
    
    setShowPrintPopup(true);
  };

  const handlePrintConfirm = () => {
    setShowPrintPopup(false);
    setIsLoading(true);

    try {
      // Capture the Konva stage as an image
      if (!stageRef.current) {
        alert('Unable to capture canvas. Please try again.');
        setIsLoading(false);
        return;
      }

      // Force a redraw to ensure transformers are hidden
      const stage = stageRef.current;
      const layer = stage.getLayers()[0];
      if (layer) {
        layer.batchDraw();
      }

      // Small delay to ensure state updates are applied
      setTimeout(() => {
        // Get the canvas data URL
        const dataURL = stage.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2 // Higher resolution for print
        });

        // Create a new window with the captured image
        const printWindow = window.open('', '_blank', 'width=800,height=1000');
        if (!printWindow) {
          alert('Please allow popups for this site to enable printing.');
          setIsLoading(false);
          return;
        }

        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                @page {
                  margin: 0.5in;
                  size: 8.5in 11in;
                }
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                  background: white;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                .print-image {
                  max-width: 7.5in;
                  max-height: 10in;
                  width: auto;
                  height: auto;
                  border: 1px solid #ccc;
                }
                @media print {
                  body { 
                    margin: 0; 
                    padding: 0; 
                    display: block;
                  }
                  .print-image { 
                    border: none; 
                    max-width: 100%;
                    max-height: 100%;
                  }
                }
              </style>
            </head>
            <body>
              <img src="${dataURL}" alt="Photo Layout" class="print-image" />
            </body>
          </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for image to load before printing
        printWindow.onload = () => {
          console.log('Print window loaded with canvas image');
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            // Don't close immediately to allow user to see the print preview
            setTimeout(() => {
              printWindow.close();
            }, 1000);
          }, 500);
        };
        
        setIsLoading(false);
      }, 100); // Small delay to ensure transformers are hidden
    } catch (error) {
      console.error('Print error:', error);
      alert('Error capturing canvas for printing. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSavePDF = async () => {
    // Unselect all photos to hide selection lines and control points
    setSelectedId(null);
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      isSelected: false
    })));
    
    setIsLoading(true);

    try {
      // Capture the Konva stage as an image
      if (!stageRef.current) {
        alert('Unable to capture canvas for PDF. Please try again.');
        setIsLoading(false);
        return;
      }

      // Force a redraw to ensure transformers are hidden
      const stage = stageRef.current;
      const layer = stage.getLayers()[0];
      if (layer) {
        layer.batchDraw();
      }

      // Small delay to ensure state updates are applied
      setTimeout(() => {
        // Get the canvas data URL optimized for PDF (smaller file size)
        const dataURL = stage.toDataURL({
          mimeType: 'image/jpeg',
          quality: 0.9, // High quality but compressed
          pixelRatio: 2 // Reduced from 3x to 2x for smaller file size
        });

        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'in',
          format: [8.5, 11]
        });

        // Add the captured image to fill the entire page
        pdf.addImage(dataURL, 'JPEG', 0, 0, 8.5, 11);

        pdf.save('heirloominary-photos.pdf');
        setIsLoading(false);
      }, 100); // Small delay to ensure transformers are hidden
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      setIsLoading(false);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Template not found</h1>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-4">
            <img
              src="/Heirloominary_logo.avif"
              alt="Heirloominary Logo"
              className="header-logo"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-text-primary text-center mb-8">
          {template.title}
        </h1>

        {/* Instructions */}
        <div className="text-center mb-8 max-w-4xl mx-auto">
          <p className="text-text-secondary">
            Upload or drag and drop your photos into the image slots below. You can edit the photos crop and zoom once it is loaded into the image frame.
          </p>
        </div>

        {/* Photo Editor Canvas */}
        <div className="flex justify-center mb-8">
          <div
            className="paper-preview-container"
            style={{
              width: '100%',
              maxWidth: '602px',
              aspectRatio: '8.5/11',
              backgroundColor: '#fff',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              border: '1px solid #12121255',
              borderRadius: '4px',
              position: 'relative',
            }}
          >
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              onClick={handlePaperClick}
              style={{
                width: '100%',
                height: 'auto',
              }}
            >
              <Layer>
                {/* Paper background */}
                <Rect
                  x={0}
                  y={0}
                  width={stageSize.width}
                  height={stageSize.height}
                  fill="#ffffff"
                />

                {/* Photo areas positioned exactly according to template coordinates */}
                {template.layout.map((slot) => {
                  const photo = photos.find(p => p.id === slot.id);

                  // Convert template coordinates to Konva coordinates
                  // Template uses 8.5" x 11" paper, Konva stage is dynamic
                  const slotX = (slot.x / 8.5) * stageSize.width;
                  const slotY = (slot.y / 11) * stageSize.height;
                  const slotWidth = (slot.width / 8.5) * stageSize.width;
                  const slotHeight = (slot.height / 11) * stageSize.height;

                  return (
                    <Rect
                      key={slot.id}
                      x={slotX}
                      y={slotY}
                      width={slotWidth}
                      height={slotHeight}
                      fill={photo ? 'transparent' : '#f0f0f0'}
                      onClick={() => {
                        // Only handle clicks on empty slots or when clicking outside the photo
                        if (!photo) {
                          // Clear selection when clicking on empty slot
                          setSelectedId(null);
                          setPhotos(prev => prev.map(p => ({
                            ...p,
                            isSelected: false
                          })));
                        } else {
                          // If there's a photo, let the photo handle the click
                          // This will be handled by the photo's onClick handler
                        }
                      }}
                    />
                  );
                })}

                {/* Photo images with clipping groups */}
                {template.layout.map((slot) => {
                  const photo = photos.find(p => p.id === slot.id);
                  if (!photo) return null;

                  // Convert template coordinates to Konva coordinates
                  const slotX = (slot.x / 8.5) * stageSize.width;
                  const slotY = (slot.y / 11) * stageSize.height;
                  const slotWidth = (slot.width / 8.5) * stageSize.width;
                  const slotHeight = (slot.height / 11) * stageSize.height;

                  return (
                    <Group
                      key={`group-${slot.id}`}
                      clipFunc={(ctx) => {
                        ctx.rect(slotX, slotY, slotWidth, slotHeight);
                      }}
                    >
                      <KonvaImage
                        key={`image-${slot.id}`}
                        id={slot.id}
                        x={slotX + photo.x}
                        y={slotY + photo.y}
                        image={photo.image}
                        scaleX={photo.scaleX}
                        scaleY={photo.scaleY}
                        rotation={photo.rotation}
                        opacity={photo.opacity}
                        draggable
                        onClick={(e) => {
                          e.cancelBubble = true;
                          // Toggle selection - if already selected, deselect
                          if (photo.isSelected) {
                            setSelectedId(null);
                            setPhotos(prev => prev.map(p => ({
                              ...p,
                              isSelected: false
                            })));
                          } else {
                            setSelectedId(photo.id);
                            setPhotos(prev => prev.map(p => ({
                              ...p,
                              isSelected: p.id === photo.id
                            })));
                          }
                        }}
                        onTap={(e) => {
                          e.cancelBubble = true;
                          // Toggle selection - if already selected, deselect
                          if (photo.isSelected) {
                            setSelectedId(null);
                            setPhotos(prev => prev.map(p => ({
                              ...p,
                              isSelected: false
                            })));
                          } else {
                            setSelectedId(photo.id);
                            setPhotos(prev => prev.map(p => ({
                              ...p,
                              isSelected: p.id === photo.id
                            })));
                          }
                        }}
                        onDragEnd={(e) => {
                          const newX = e.target.x() - slotX;
                          const newY = e.target.y() - slotY;
                          setPhotos(prev => prev.map(p =>
                            p.id === photo.id ? { ...p, x: newX, y: newY } : p
                          ));
                        }}
                        onTransformEnd={(e) => {
                          const node = e.target;
                          const newX = node.x() - slotX;
                          const newY = node.y() - slotY;
                          const newScaleX = node.scaleX();
                          const newScaleY = node.scaleY();
                          const newRotation = node.rotation();

                          // Maintain aspect ratio by using the average of scaleX and scaleY
                          const uniformScale = (newScaleX + newScaleY) / 2;

                          setPhotos(prev => prev.map(p =>
                            p.id === photo.id ? {
                              ...p,
                              x: newX,
                              y: newY,
                              scaleX: uniformScale,
                              scaleY: uniformScale,
                              rotation: newRotation
                            } : p
                          ));
                        }}
                      />
                    </Group>
                  );
                })}

                {/* Transformers for selected photos */}
                {template.layout.map((slot) => {
                  const photo = photos.find(p => p.id === slot.id);
                  if (!photo || !photo.isSelected) return null;

                  return (
                    <Transformer
                      key={`transformer-${slot.id}`}
                      ref={(ref) => {
                        if (ref) {
                          transformerRefs.current[photo.id] = ref;
                          // Attach transformer to the image node
                          const stage = ref.getStage();
                          if (stage) {
                            const imageNode = stage.findOne(`#${photo.id}`);
                            if (imageNode) {
                              ref.nodes([imageNode]);
                              const layer = ref.getLayer();
                              if (layer) {
                                layer.batchDraw();
                              }
                            }
                          }
                        }
                      }}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                          return oldBox;
                        }
                        return newBox;
                      }}
                      keepRatio={true}
                      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                      rotateEnabled={true}
                      flipEnabled={false}
                    />
                  );
                })}
              </Layer>
            </Stage>
            
            {/* Selection indicators as CSS overlays */}
            {template.layout.map((slot) => {
              const photo = photos.find(p => p.id === slot.id);
              if (!photo || !photo.isSelected) return null;

              // Convert template coordinates to percentage for CSS positioning
              const slotLeftPercent = (slot.x / 8.5) * 100;
              const slotTopPercent = (slot.y / 11) * 100;
              const slotWidthPercent = (slot.width / 8.5) * 100;
              const slotHeightPercent = (slot.height / 11) * 100;

              return (
                <div
                  key={`selection-${slot.id}`}
                  style={{
                    position: 'absolute',
                    left: `${slotLeftPercent}%`,
                    top: `${slotTopPercent}%`,
                    width: `${slotWidthPercent}%`,
                    height: `${slotHeightPercent}%`,
                    border: '3px solid #007bff',
                    borderRadius: '2px',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />
              );
            })}
          </div>
        </div>


        {/* Individual Photo Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {template.layout.map((slot) => {
            const photo = photos.find(p => p.id === slot.id);
            return (
              <div key={slot.id} className="bg-background-secondary border border-border p-3">
                <div className='flex justify-between items-start mb-2'>
                  <h3 className="font-medium text-text-primary text-sm">
                    Photo {slot.id.split('-')[1]} ({slot.orientation})
                  </h3>
                  {/* Photo controls - only show if photo is uploaded */}
                  {photo && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setPhotos(prev => prev.map(p => {
                            if (p.id === slot.id) {
                              // Recalculate proper scaling to fit image to slot
                              const { scaleX, scaleY } = calculateFitScale(p.image, slot.id);
                              return { 
                                ...p, 
                                scaleX, 
                                scaleY, 
                                rotation: 0, 
                                opacity: 1, 
                                extendedOpacity: 0.3,
                                x: 0,
                                y: 0
                              };
                            }
                            return p;
                          }));
                        }}
                        className="btn-secondary rounded-none text-xs px-2 py-1"
                        title="Reset image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                      </button>
                      <button
                        onClick={() => {
                          setPhotos(prev => prev.filter(p => p.id !== slot.id));
                          setSelectedId(null);
                        }}
                        className="btn-danger rounded-none text-xs px-2 py-1"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-text-secondary text-xs mb-2">
                  {slot.width}" × {slot.height}"
                </p>

                <SmartImageUpload
                  onImageUpload={(file) => handleImageUpload(file, slot.id)}
                  showPreview={true}
                  previewMaxHeight={120}
                  className="mt-1"
                  dragText="Drag photo here"
                  clickText="click to select"
                  currentPhoto={photo ? { image: photo.image, isSelected: photo.isSelected } : null}
                  onRemovePhoto={() => {
                    setPhotos(prev => prev.filter(p => p.id !== slot.id));
                    setSelectedId(null);
                  }}
                />


              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePrint}
            disabled={isLoading}
            className="btn-primary rounded-none px-8 py-3 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'PRINT PHOTOS'}
          </button>
          <button
            onClick={handleSavePDF}
            disabled={isLoading}
            className="btn-primary rounded-none px-8 py-3 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'SAVE PDF'}
          </button>
        </div>
      </main>

      {/* Print Confirmation Popup */}
      {showPrintPopup && (
        <div className="print-popup">
          <div className="print-popup-content rounded-none">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Print Confirmation
            </h3>
            <p className="text-text-secondary mb-6">
              We recommend you try a test print first!<br />
              Mark a corner of a blank sheet with an "X" to see how your printer feeds paper—so you'll know which side faces up when you print your form.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPrintPopup(false)}
                className="flex-1 bg-background-secondary text-text-primary px-4 py-2 rounded-none border border-border hover:bg-background-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePrintConfirm}
                className="btn-primary rounded-none flex-1 px-4 py-2"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              © 2025 Heirloominary. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PhotoEditor;
