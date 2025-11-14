import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Rect, Group } from 'react-konva';

interface ImageData {
  image: HTMLImageElement | null;
  props: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
  };
  isSelected: boolean;
}

const Demo = () => {
  const [images, setImages] = useState<ImageData[]>([
    {
      image: null,
      props: { x: 0, y: 0, width: 0, height: 0, rotation: 0, scaleX: 1, scaleY: 1 },
      isSelected: false,
    },
    {
      image: null,
      props: { x: 0, y: 0, width: 0, height: 0, rotation: 0, scaleX: 1, scaleY: 1 },
      isSelected: false,
    },
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageRefs = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformerRefs = useRef<any[]>([]);

  const canvasWidth = 1000;
  const canvasHeight = 700;
  const rectWidth = canvasWidth * 0.4;
  const rectHeight = canvasHeight * 0.5;
  const gap = 40;
  const totalWidth = rectWidth * 2 + gap;
  const rect1X = (canvasWidth - totalWidth) / 2;
  const rect2X = rect1X + rectWidth + gap;
  const rectY = (canvasHeight - rectHeight) / 2;

  const rects = [
    { x: rect1X, y: rectY, width: rectWidth, height: rectHeight },
    { x: rect2X, y: rectY, width: rectWidth, height: rectHeight },
  ];

  useEffect(() => {
    images.forEach((img, index) => {
      if (img.isSelected && transformerRefs.current[index] && imageRefs.current[index]) {
        transformerRefs.current[index].nodes([imageRefs.current[index]]);
        transformerRefs.current[index].getLayer()?.batchDraw();
      } else if (transformerRefs.current[index]) {
        transformerRefs.current[index].nodes([]);
      }
    });
  }, [images]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, rectIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const rect = rects[rectIndex];
        // Calculate initial size to fit within the rectangle
        const rectAspectRatio = rect.width / rect.height;
        const imgAspectRatio = img.width / img.height;

        let initialWidth: number;
        let initialHeight: number;

        if (imgAspectRatio > rectAspectRatio) {
          // Image is wider - fit to width
          initialWidth = rect.width;
          initialHeight = rect.width / imgAspectRatio;
        } else {
          // Image is taller - fit to height
          initialHeight = rect.height;
          initialWidth = rect.height * imgAspectRatio;
        }

        const newImages = [...images];
        newImages[rectIndex] = {
          image: img,
          props: {
            x: rect.x + (rect.width - initialWidth) / 2,
            y: rect.y + (rect.height - initialHeight) / 2,
            width: initialWidth,
            height: initialHeight,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          },
          isSelected: true,
        };
        setImages(newImages);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      const newImages = images.map((img) => ({ ...img, isSelected: false }));
      setImages(newImages);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 grid grid-cols-2 gap-4">
        {rects.map((_, index) => (
          <div key={index} className="flex flex-col">
            <label className="block mb-2 text-lg font-semibold">
              Upload Image for Rectangle {index + 1}:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, index)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            {rects.map((rect, rectIndex) => (
              <Group key={rectIndex}>
                {/* Clipping rectangle - this defines the visible area */}
                <Group
                  clipFunc={(ctx) => {
                    ctx.rect(rect.x, rect.y, rect.width, rect.height);
                  }}
                >
                  {/* Display rectangle border to show the clipping area */}
                  <Rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    stroke="#666"
                    strokeWidth={2}
                    dash={[10, 5]}
                    fill="rgba(200, 200, 200, 0.1)"
                  />

                  {/* Uploaded image */}
                  {images[rectIndex].image && (
                    <KonvaImage
                      ref={(el) => {
                        imageRefs.current[rectIndex] = el;
                      }}
                      image={images[rectIndex].image}
                      x={images[rectIndex].props.x}
                      y={images[rectIndex].props.y}
                      width={images[rectIndex].props.width}
                      height={images[rectIndex].props.height}
                      rotation={images[rectIndex].props.rotation}
                      scaleX={images[rectIndex].props.scaleX}
                      scaleY={images[rectIndex].props.scaleY}
                      draggable={images[rectIndex].isSelected}
                      onClick={(e) => {
                        e.cancelBubble = true;
                        const newImages = images.map((img, idx) => ({
                          ...img,
                          isSelected: idx === rectIndex,
                        }));
                        setImages(newImages);
                      }}
                      onTap={(e) => {
                        e.cancelBubble = true;
                        const newImages = images.map((img, idx) => ({
                          ...img,
                          isSelected: idx === rectIndex,
                        }));
                        setImages(newImages);
                      }}
                      onDragEnd={(e) => {
                        const newImages = [...images];
                        newImages[rectIndex] = {
                          ...newImages[rectIndex],
                          props: {
                            ...newImages[rectIndex].props,
                            x: e.target.x(),
                            y: e.target.y(),
                          },
                        };
                        setImages(newImages);
                      }}
                      onTransformEnd={() => {
                        const node = imageRefs.current[rectIndex];
                        if (!node) return;

                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        // Reset scale and apply it to width/height
                        node.scaleX(1);
                        node.scaleY(1);

                        const newImages = [...images];
                        newImages[rectIndex] = {
                          ...newImages[rectIndex],
                          props: {
                            ...newImages[rectIndex].props,
                            x: node.x(),
                            y: node.y(),
                            rotation: node.rotation(),
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
                            scaleX: 1,
                            scaleY: 1,
                          },
                        };
                        setImages(newImages);
                      }}
                    />
                  )}
                </Group>

                {/* Transformer for resize and rotate */}
                {images[rectIndex].isSelected && images[rectIndex].image && (
                  <Transformer
                    ref={(el) => {
                      transformerRefs.current[rectIndex] = el;
                    }}
                    boundBoxFunc={(oldBox, newBox) => {
                      // Limit minimum size
                      if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>

      {(images[0].image || images[1].image) && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Click and drag an image to move it</p>
          <p>Use the corner handles to resize and rotate</p>
          <p>Only the area within each dashed rectangle will be visible</p>
        </div>
      )}
    </div>
  );
};

export default Demo;
