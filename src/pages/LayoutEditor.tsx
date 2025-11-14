import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Transformer,
  Rect,
  Group,
  Text,
} from "react-konva";
// import SmartImageUpload from '../components/SmartImageUpload';

interface Photo {
  id: string;
  isInUse: boolean;
}

interface Background {
  id: string;
  name: string;
  imageUrl: string;
  isInUse: boolean;
}

interface PhotoData {
  id: string;
  image: HTMLImageElement;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
  isSelected: boolean;
}

type TabType = "background" | "template" | "text" | "decoration" | null;

interface TextData {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontSizeUnit: "pt" | "Q";
  fontFamily: string;
  fill: string;
  rotation: number;
  lineHeight?: number;
  letterSpacing?: number;
  align?: "left" | "center" | "right" | "justify";
  isSelected: boolean;
  isEditing?: boolean;
  isLocked?: boolean;
  zIndex?: number;
}

interface ImageFrameData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  isSelected: boolean;
}

interface DecorationData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  imageUrl: string;
  image: HTMLImageElement | null;
  isSelected: boolean;
  isLocked?: boolean;
  zIndex?: number;
  opacity?: number;
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
  style?: {
    border: {
      enabled: boolean;
      width: number;
      color: string;
    };
    shadow: {
      enabled: boolean;
      blur: number;
      offsetX: number;
      offsetY: number;
      color: string;
      opacity: number;
    };
  };
}

function LayoutEditor() {
  const [activeTab, setActiveTab] = useState<TabType>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformerRefs = useRef<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [layoutPhotos, setLayoutPhotos] = useState<PhotoData[]>([]);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<
    string | null
  >(null);
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [photoModalImageMap, setPhotoModalImageMap] = useState<{ [photoId: string]: string }>({});
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [transformerBox, setTransformerBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showOtherMenu, setShowOtherMenu] = useState<{ type: 'photo' | 'text' | 'decoration' | null; position: { x: number; y: number } | null }>({ type: null, position: null });
  const [copiedElement, setCopiedElement] = useState<{ type: 'text' | 'decoration' | null; data: TextData | DecorationData | null }>({ type: null, data: null });
  const [stageSize] = useState({ width: 1000, height: 700 });
  const [textElements, setTextElements] = useState<TextData[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textInputPosition, setTextInputPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textTransformerRefs = useRef<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textNodeRefs = useRef<{ [key: string]: any }>({});
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textTransformerBox, setTextTransformerBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [textActiveMenu, setTextActiveMenu] = useState<string | null>(null);
  const [imageFrames, setImageFrames] = useState<ImageFrameData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageFrameTransformerRefs = useRef<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageFrameNodeRefs = useRef<{ [key: string]: any }>({});
  const [canvasDecorations, setCanvasDecorations] = useState<DecorationData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decorationTransformerRefs = useRef<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decorationNodeRefs = useRef<{ [key: string]: any }>({});
  const [selectedDecorationId, setSelectedDecorationId] = useState<string | null>(null);
  const [decorationTransformerBox, setDecorationTransformerBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [decorationActiveMenu, setDecorationActiveMenu] = useState<string | null>(null);
  const [photos] = useState<Photo[]>([
    { id: "1", isInUse: false },
    { id: "2", isInUse: true },
    { id: "3", isInUse: false },
    { id: "4", isInUse: true },
    { id: "5", isInUse: false },
    { id: "6", isInUse: false },
    { id: "7", isInUse: false },
    { id: "8", isInUse: false },
    { id: "9", isInUse: false },
    { id: "10", isInUse: false },
    { id: "11", isInUse: false },
    { id: "12", isInUse: false },
  ]);

  const [backgrounds] = useState<Background[]>([
    {
      id: "1",
      name: "運動会のグラウンド",
      imageUrl:
        "https://images.unsplash.com/photo-1564571258158-87eb9649eb63?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isInUse: false,
    },
    {
      id: "2",
      name: "青空の運動場",
      imageUrl:
        "https://images.unsplash.com/photo-1551946822-e7e7e3792ac9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isInUse: true,
    },
    {
      id: "3",
      name: "芝生のフィールド",
      imageUrl:
        "https://images.unsplash.com/photo-1623208525215-a573aacb1560?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isInUse: false,
    },
    {
      id: "4",
      name: "トラック競技場",
      imageUrl:
        "https://images.unsplash.com/photo-1733648222907-0bb67d214c13?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isInUse: false,
    },
    {
      id: "5",
      name: "学校の運動場",
      imageUrl:
        "https://images.unsplash.com/photo-1720799359333-974848b7dd8b?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isInUse: false,
    },
    {
      id: "6",
      name: "運動会の雰囲気",
      imageUrl:
        "https://images.unsplash.com/photo-1663246544635-118c34cc488b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isInUse: false,
    },
  ]);
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState<Background[]>([]);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  const [decorationCategory, setDecorationCategory] = useState("stamp");
  const [uploadedDecorations, setUploadedDecorations] = useState<Array<{ id: string; imageUrl: string; name: string; isInUse: boolean }>>([]);
  const decorationFileInputRef = useRef<HTMLInputElement>(null);

  const templates = [
    {
      id: "1",
      name: "中面 1",
      layout: {
        left: [
          { type: "square", position: "top" },
          { type: "rectangle", position: "bottom" },
        ],
        right: [{ type: "grid", cols: 2, rows: 4 }],
      },
      isInUse: false,
    },
    {
      id: "2",
      name: "中面 2",
      layout: {
        left: [{ type: "grid", cols: 2, rows: 4 }],
        right: [
          { type: "square", position: "top" },
          { type: "rectangle", position: "bottom" },
        ],
      },
      isInUse: false,
    },
    {
      id: "3",
      name: "中面 3",
      layout: {
        left: [
          { type: "rectangle", position: "top" },
          { type: "grid", cols: 2, rows: 1, position: "bottom" },
        ],
        right: [
          { type: "grid", cols: 2, rows: 2, position: "top" },
          { type: "rectangle", position: "bottom" },
        ],
      },
      isInUse: true,
    },
    {
      id: "4",
      name: "中面 4",
      layout: {
        left: [{ type: "grid", cols: 2, rows: 2, position: "top" }],
        right: [{ type: "rectangle", position: "bottom" }],
      },
      isInUse: false,
    },
  ];

  const [decorations] = useState([
    { 
      id: "1", 
      isInUse: false,
      imageUrl: "/deco (1).png",
      name: "スタンプ 1"
    },
    { 
      id: "2", 
      isInUse: false,
      imageUrl: "/deco (2).png",
      name: "スタンプ 2"
    },
    { 
      id: "3", 
      isInUse: false,
      imageUrl: "/deco (3).png",
      name: "スタンプ 3"
    },
    { 
      id: "4", 
      isInUse: false,
      imageUrl: "/deco (4).png",
      name: "スタンプ 4"
    },
    { 
      id: "5", 
      isInUse: false,
      imageUrl: "/deco (5).png",
      name: "スタンプ 5"
    },
    { 
      id: "6", 
      isInUse: false,
      imageUrl: "/deco (6).png",
      name: "スタンプ 6"
    },
  ]);

  // Gap between photo areas
  const gap = 10;

  // Define layout slots for two-page spread with gaps (not currently used - kept for potential future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const layoutSlots = [
    // Left Page - 3 slots
    {
      id: "left-1",
      x: gap,
      y: gap,
      width: 500 - gap * 2,
      height: 175 - gap,
      page: "left",
    }, // Top square
    {
      id: "left-2",
      x: gap,
      y: 175 + gap,
      width: 500 - gap * 2,
      height: 350 - gap * 2,
      page: "left",
    }, // Middle large rectangle
    {
      id: "left-3",
      x: gap,
      y: 525 + gap,
      width: 500 - gap * 2,
      height: 175 - gap,
      page: "left",
    }, // Bottom square
    // Right Page - 5 slots
    // right-1: starts at 500 + gap, width 245 - gap (leaves gap on left)
    // right-2: starts at 500 + 245 + gap = 745 + gap = 755, width 245 - gap (leaves gap on right)
    {
      id: "right-1",
      x: 500 + gap,
      y: gap,
      width: 245 - gap,
      height: 140 - gap,
      page: "right",
    }, // Top-left small square
    {
      id: "right-2",
      x: 500 + 245 + gap,
      y: gap,
      width: 245 - gap,
      height: 140 - gap,
      page: "right",
    }, // Top-right small square
    {
      id: "right-3",
      x: 500 + gap,
      y: 140 + gap,
      width: 245 - gap,
      height: 140 - gap * 2,
      page: "right",
    }, // Middle-left small square
    {
      id: "right-4",
      x: 500 + 245 + gap,
      y: 140 + gap,
      width: 245 - gap,
      height: 140 - gap * 2,
      page: "right",
    }, // Middle-right small square
    {
      id: "right-5",
      x: 500 + gap,
      y: 280 + gap,
      width: 500 - gap * 2,
      height: 420 - gap * 2,
      page: "right",
    }, // Bottom large rectangle
  ];

  // Handle transformer updates for individual stages
  useEffect(() => {
    if (selectedSlotId && transformerRefs.current[selectedSlotId]) {
      // Force transformer to update by calling getLayer().batchDraw()
      const layer = transformerRefs.current[selectedSlotId].getLayer();
      if (layer) {
        layer.batchDraw();
      }
    }
  }, [selectedSlotId]);

  // Clean up transformers when photos are removed
  useEffect(() => {
    const currentPhotoIds = layoutPhotos.map((p) => p.id);
    Object.keys(transformerRefs.current).forEach((id) => {
      if (!currentPhotoIds.includes(id)) {
        delete transformerRefs.current[id];
      }
    });
  }, [layoutPhotos]);

  // Update transformers for text elements when selection changes
  useEffect(() => {
    textElements.forEach((textData) => {
      if (textData.isSelected && textTransformerRefs.current[textData.id]) {
        const transformer = textTransformerRefs.current[textData.id];
        const textNode = textNodeRefs.current[textData.id];
        if (transformer && textNode) {
          transformer.nodes([textNode]);
          transformer.getLayer()?.batchDraw();
        }
      }
    });
  }, [textElements]);

  // Update transformers for image frames when selection changes
  useEffect(() => {
    imageFrames.forEach((frameData) => {
      if (
        frameData.isSelected &&
        imageFrameTransformerRefs.current[frameData.id]
      ) {
        const transformer = imageFrameTransformerRefs.current[frameData.id];
        const frameNode = imageFrameNodeRefs.current[frameData.id];
        if (transformer && frameNode) {
          transformer.nodes([frameNode]);
          transformer.getLayer()?.batchDraw();
        }
      }
    });
  }, [imageFrames]);

  // Update text transformer box position when selection changes
  useEffect(() => {
    const selectedText = textElements.find(
      (t) => t.isSelected && t.id !== editingTextId
    );
    if (selectedText && textTransformerRefs.current[selectedText.id]) {
      const updateTransformerBox = () => {
        const transformer = textTransformerRefs.current[selectedText.id];
        if (transformer) {
          const box = transformer.getClientRect();
          const stage = transformer.getStage();
          if (stage) {
            const container = stage.container().parentElement;
            if (container) {
              const containerRect = container.getBoundingClientRect();
              setTextTransformerBox({
                x: box.x + containerRect.left - container.scrollLeft,
                y: box.y + containerRect.top - container.scrollTop,
                width: box.width,
                height: box.height,
              });
              setSelectedTextId(selectedText.id);
            }
          }
        }
      };

      // Update immediately and on window resize/scroll
      updateTransformerBox();
      const interval = setInterval(updateTransformerBox, 100);
      window.addEventListener("resize", updateTransformerBox);
      window.addEventListener("scroll", updateTransformerBox, true);

      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", updateTransformerBox);
        window.removeEventListener("scroll", updateTransformerBox, true);
      };
    } else {
      setTextTransformerBox(null);
      setSelectedTextId(null);
    }
  }, [textElements, editingTextId]);

  // // Calculate fit scale for image to slot
  // const calculateFitScale = (image: HTMLImageElement, slotId: string) => {
  //   const slot = layoutSlots.find((s) => s.id === slotId);
  //   if (!slot) return { scaleX: 1, scaleY: 1 };

  //   const imageAspectRatio = image.width / image.height;
  //   const slotAspectRatio = slot.width / slot.height;

  //   let scaleX, scaleY;
  //   if (imageAspectRatio > slotAspectRatio) {
  //     scaleX = scaleY = slot.height / image.height;
  //   } else {
  //     scaleX = scaleY = slot.width / image.width;
  //   }

  //   return { scaleX, scaleY };
  // };

  // // Handle image upload to slot (not currently used - kept for potential future use)
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  // const handleImageUpload = (file: File, slotId: string) => {
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const img = new window.Image();
  //     img.onload = () => {
  //       const { scaleX, scaleY } = calculateFitScale(img, slotId);

  //       const newPhoto: PhotoData = {
  //         id: slotId,
  //         image: img,
  //         x: 0,
  //         y: 0,
  //         scaleX: scaleX,
  //         scaleY: scaleY,
  //         rotation: 0,
  //         opacity: 1,
  //         isSelected: false,
  //       };

  //       setLayoutPhotos((prev) => {
  //         const filtered = prev.filter((p) => p.id !== slotId);
  //         return [...filtered, newPhoto];
  //       });
  //     };
  //     img.src = e.target?.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // };

  // // Handle drag over for Konva (not currently used - kept for potential future use)
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleDragOver = (e: { evt: DragEvent }) => {
  //   e.evt.preventDefault();
  // };

  // // Handle paper click to deselect (not currently used - kept for potential future use)
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handlePaperClick = () => {
  //   setSelectedSlotId(null);
  //   setLayoutPhotos((prev) =>
  //     prev.map((photo) => ({
  //       ...photo,
  //       isSelected: false,
  //     }))
  //   );
  // };

  // Demo canvas state - for two rectangles
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
    isLocked?: boolean;
    zIndex?: number;
    style?: {
      frameShape: "none" | "rounded" | "circle";
      borderRadius?: number;
      border: {
        enabled: boolean;
        width: number;
        color: string;
      };
      shadow: {
        enabled: boolean;
        blur: number;
        offsetX: number;
        offsetY: number;
        color: string;
        opacity: number;
      };
      opacity: number;
    };
  }

  const [demoImages, setDemoImages] = useState<ImageData[]>([
    // Initialize 8 image slots
    ...Array.from({ length: 8 }, () => ({
      image: null as HTMLImageElement | null,
      props: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      isSelected: false,
      style: {
        frameShape: "none" as const,
        borderRadius: 10,
        border: {
          enabled: false,
          width: 2,
          color: "#000000",
        },
        shadow: {
          enabled: false,
          blur: 5,
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          opacity: 0.5,
        },
        opacity: 1,
      },
    })),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const demoImageRefs = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const demoTransformerRefs = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const demoDraggableGroupRefs = useRef<any[]>([]);

  const canvasWidth = stageSize.width;
  const canvasHeight = stageSize.height;
  const margin = 20; // Margin from edges
  const demoGap = 10; // Gap between rectangles
  const pageWidth = (canvasWidth - margin * 2) / 2; // Each page width
  const pageHeight = canvasHeight - margin * 2; // Page height
  const pageLeftX = margin; // Left page X position
  const pageRightX = margin + pageWidth; // Right page X position
  const pageY = margin; // Y position for both pages

  // Define 8 rectangles based on the layout:
  // Left page: 1 large top, 2 small bottom
  // Right page: 2 medium top, 2 small middle, 1 large bottom
  // Right top rectangle size (to match left bottom rectangles)
  const rightTopRectSize = {
    width: (pageWidth - demoGap * 3) / 2,
    height: pageHeight * 0.25 - demoGap,
  };
  // Right bottom large rectangle size (to match left top rectangle)
  const rightBottomRectSize = {
    width: pageWidth - demoGap * 2,
    height: pageHeight * 0.5 - demoGap * 2,
  };
  // Calculate left rectangles aligned to bottom (alignItems: end)
  // Total height of left rectangles: 2 small rectangles (side by side) + 1 large rectangle + gaps
  const leftBottomRectsY = pageY + pageHeight - rightTopRectSize.height;
  const leftTopRectY = leftBottomRectsY - demoGap - rightBottomRectSize.height;

  const demoRects = [
    // Left Page (aligned to bottom - alignItems: end)
    // 1. Top: Large rectangle (same size as right bottom large rectangle)
    {
      x: pageLeftX + demoGap,
      y: leftTopRectY,
      width: rightBottomRectSize.width,
      height: rightBottomRectSize.height,
    },
    // 2. Bottom-Left: Small rectangle (same size as right top rectangles)
    {
      x: pageLeftX + demoGap,
      y: leftBottomRectsY,
      width: rightTopRectSize.width,
      height: rightTopRectSize.height,
    },
    // 3. Bottom-Right: Small rectangle (same size as right top rectangles)
    {
      x: pageLeftX + demoGap + rightTopRectSize.width + demoGap,
      y: leftBottomRectsY,
      width: rightTopRectSize.width,
      height: rightTopRectSize.height,
    },
    // Right Page
    // 4. Top-Left: Medium rectangle
    {
      x: pageRightX + demoGap,
      y: pageY + demoGap,
      width: (pageWidth - demoGap * 3) / 2,
      height: pageHeight * 0.25 - demoGap,
    },
    // 5. Top-Right: Medium rectangle
    {
      x: pageRightX + demoGap + (pageWidth - demoGap * 3) / 2 + demoGap,
      y: pageY + demoGap,
      width: (pageWidth - demoGap * 3) / 2,
      height: pageHeight * 0.25 - demoGap,
    },
    // 6. Middle-Left: Small rectangle
    {
      x: pageRightX + demoGap,
      y: pageY + pageHeight * 0.25 + demoGap,
      width: (pageWidth - demoGap * 3) / 2,
      height: pageHeight * 0.25 - demoGap * 2,
    },
    // 7. Middle-Right: Small rectangle
    {
      x: pageRightX + demoGap + (pageWidth - demoGap * 3) / 2 + demoGap,
      y: pageY + pageHeight * 0.25 + demoGap,
      width: (pageWidth - demoGap * 3) / 2,
      height: pageHeight * 0.25 - demoGap * 2,
    },
    // 8. Bottom: Large rectangle
    {
      x: pageRightX + demoGap,
      y: pageY + pageHeight * 0.5 + demoGap,
      width: pageWidth - demoGap * 2,
      height: pageHeight * 0.5 - demoGap * 2,
    },
  ];

  useEffect(() => {
    demoImages.forEach((img, index) => {
      if (
        img.isSelected &&
        demoTransformerRefs.current[index] &&
        demoDraggableGroupRefs.current[index]
      ) {
        demoTransformerRefs.current[index].nodes([
          demoDraggableGroupRefs.current[index],
        ]);
        demoTransformerRefs.current[index].getLayer()?.batchDraw();
      } else if (demoTransformerRefs.current[index]) {
        demoTransformerRefs.current[index].nodes([]);
      }
    });
  }, [demoImages]);

  // Helper function to load image and place it in a rectangle
  const loadImageToRectangle = (imageUrl: string, rectIndex: number) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const rect = demoRects[rectIndex];
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

      const newImages = [...demoImages];
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
      setDemoImages(newImages);
    };
    img.onerror = () => {
      console.error("Failed to load image:", imageUrl);
    };
    img.src = imageUrl;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDemoStageClick = (e: any) => {
    // Deselect all images when clicking on empty stage
    const stage = e.target.getStage();

    // If clicking directly on the stage, deselect all
    if (e.target === stage) {
      const newImages = demoImages.map((img) => ({
        ...img,
        isSelected: false,
      }));
      setDemoImages(newImages);
      setSelectedImageIndex(null);
      setTransformerBox(null);
      // Deselect text elements
      setTextElements((prev) => prev.map((t) => ({ ...t, isSelected: false })));
      setSelectedTextId(null);
      setTextTransformerBox(null);
      setTextActiveMenu(null);
      // Deselect image frames
      setImageFrames((prev) => prev.map((f) => ({ ...f, isSelected: false })));
      // Deselect decorations
      setCanvasDecorations((prev) => prev.map((d) => ({ ...d, isSelected: false })));
      setSelectedDecorationId(null);
      setDecorationTransformerBox(null);
      setDecorationActiveMenu(null);
      // Close other menu
      setShowOtherMenu({ type: null, position: null });
      return;
    }

    // Check if clicking on background elements (which have listening={false} but still trigger events)
    const targetType = e.target.getType?.() || "";
    const isBackgroundRect =
      targetType === "Rect" &&
      e.target.x() === 0 &&
      e.target.y() === 0 &&
      e.target.width() === canvasWidth &&
      e.target.height() === canvasHeight;
    const isBackgroundImage =
      targetType === "Image" &&
      e.target.width() === canvasWidth &&
      e.target.height() === canvasHeight &&
      !e.target.getParent()?.getParent?.()?.getType?.()?.includes("Group");
    const isDivider =
      targetType === "Rect" && Math.abs(e.target.x() - canvasWidth / 2) < 5;

    // Deselect if clicking on background (not on a user-uploaded image)
    if (isBackgroundRect || isBackgroundImage || isDivider) {
      // Double-check we're not clicking on an uploaded image
      let isUserImage = false;
      for (let i = 0; i < demoImages.length; i++) {
        if (demoImages[i].image && e.target === demoImageRefs.current[i]) {
          isUserImage = true;
          break;
        }
      }

      if (!isUserImage) {
        const newImages = demoImages.map((img) => ({
          ...img,
          isSelected: false,
        }));
        setDemoImages(newImages);
        setSelectedImageIndex(null);
        setTransformerBox(null);
        // Deselect text elements
        setTextElements((prev) =>
          prev.map((t) => ({ ...t, isSelected: false }))
        );
        setSelectedTextId(null);
        setTextTransformerBox(null);
        setTextActiveMenu(null);
        // Deselect image frames
        setImageFrames((prev) =>
          prev.map((f) => ({ ...f, isSelected: false }))
        );
        // Deselect decorations
        setCanvasDecorations((prev) =>
          prev.map((d) => ({ ...d, isSelected: false }))
        );
        setSelectedDecorationId(null);
        setDecorationTransformerBox(null);
        setDecorationActiveMenu(null);
        // Close other menu
        setShowOtherMenu({ type: null, position: null });
      }
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.shiftKey && !e.altKey) {
        // Ctrl+C or Cmd+C
        if (selectedTextId || selectedDecorationId) {
          e.preventDefault();
          if (selectedTextId) {
            const selectedText = textElements.find(t => t.id === selectedTextId);
            if (selectedText) {
              setCopiedElement({ type: 'text', data: { ...selectedText } });
            }
          } else if (selectedDecorationId) {
            const selectedDecoration = canvasDecorations.find(d => d.id === selectedDecorationId);
            if (selectedDecoration) {
              setCopiedElement({ type: 'decoration', data: { ...selectedDecoration } });
            }
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !e.shiftKey && !e.altKey) {
        // Ctrl+V or Cmd+V
        if (copiedElement.type && copiedElement.data) {
          e.preventDefault();
          if (copiedElement.type === 'text' && copiedElement.data && 'text' in copiedElement.data) {
            const newText: TextData = {
              ...copiedElement.data as TextData,
              id: `text-${Date.now()}`,
              x: copiedElement.data.x + 20,
              y: copiedElement.data.y + 20,
              isSelected: false,
            };
            setTextElements(prev => [...prev, newText]);
          } else if (copiedElement.type === 'decoration' && copiedElement.data && 'image' in copiedElement.data && copiedElement.data.image) {
            const newDecoration: DecorationData = {
              ...copiedElement.data as DecorationData,
              id: `decoration-${Date.now()}`,
              x: copiedElement.data.x + 20,
              y: copiedElement.data.y + 20,
              isSelected: false,
            };
            setCanvasDecorations(prev => [...prev, newDecoration]);
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !e.shiftKey && !e.altKey) {
        // Ctrl+D or Cmd+D
        if (selectedTextId || selectedDecorationId) {
          e.preventDefault();
          if (selectedTextId) {
            const selectedText = textElements.find(t => t.id === selectedTextId);
            if (selectedText) {
              const newText: TextData = {
                ...selectedText,
                id: `text-${Date.now()}`,
                x: selectedText.x + 20,
                y: selectedText.y + 20,
                isSelected: false,
              };
              setTextElements(prev => [...prev, newText]);
            }
          } else if (selectedDecorationId) {
            const selectedDecoration = canvasDecorations.find(d => d.id === selectedDecorationId);
            if (selectedDecoration) {
              const newDecoration: DecorationData = {
                ...selectedDecoration,
                id: `decoration-${Date.now()}`,
                x: selectedDecoration.x + 20,
                y: selectedDecoration.y + 20,
                isSelected: false,
              };
              setCanvasDecorations(prev => [...prev, newDecoration]);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTextId, selectedDecorationId, copiedElement, textElements, canvasDecorations]);

  // Update transformer box position when selection changes
  useEffect(() => {
    if (
      selectedImageIndex !== null &&
      demoImages[selectedImageIndex]?.isSelected
    ) {
      const updateTransformerBox = () => {
        const transformer = demoTransformerRefs.current[selectedImageIndex];
        if (transformer) {
          const box = transformer.getClientRect();
          const stage = transformer.getStage();
          if (stage) {
            const container = stage.container().parentElement;
            if (container) {
              const containerRect = container.getBoundingClientRect();
              setTransformerBox({
                x: box.x + containerRect.left - container.scrollLeft,
                y: box.y + containerRect.top - container.scrollTop,
                width: box.width,
                height: box.height,
              });
            }
          }
        }
      };

      // Update immediately and on window resize/scroll
      updateTransformerBox();
      const interval = setInterval(updateTransformerBox, 100);
      window.addEventListener("resize", updateTransformerBox);
      window.addEventListener("scroll", updateTransformerBox, true);

      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", updateTransformerBox);
        window.removeEventListener("scroll", updateTransformerBox, true);
      };
    } else {
      setTransformerBox(null);
    }
  }, [selectedImageIndex, demoImages]);

  // Force layer redraw when style changes
  useEffect(() => {
    if (selectedImageIndex !== null && demoImages[selectedImageIndex]?.image) {
      const transformer = demoTransformerRefs.current[selectedImageIndex];
      if (transformer) {
        const stage = transformer.getStage();
        if (stage) {
          const layer = stage.getLayers()[0];
          if (layer) {
            layer.batchDraw();
          }
        }
      }
    }
  }, [demoImages, selectedImageIndex]);

  // Cleanup object URLs for uploaded backgrounds on unmount
  useEffect(() => {
    return () => {
      uploadedBackgrounds.forEach((bg) => {
        if (bg.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(bg.imageUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach transformers to selected decorations
  useEffect(() => {
    canvasDecorations.forEach((decoration) => {
      const transformer = decorationTransformerRefs.current[decoration.id];
      const decorationNode = decorationNodeRefs.current[decoration.id];
      
      if (decoration.isSelected && transformer && decorationNode) {
        transformer.nodes([decorationNode]);
        transformer.getLayer()?.batchDraw();
      } else if (transformer) {
        transformer.nodes([]);
      }
    });
  }, [canvasDecorations]);


  // Update decoration transformer box position when selection changes
  useEffect(() => {
    const selectedDecoration = canvasDecorations.find(
      (d) => d.isSelected
    );
    if (selectedDecoration && decorationTransformerRefs.current[selectedDecoration.id]) {
      const updateTransformerBox = () => {
        const transformer = decorationTransformerRefs.current[selectedDecoration.id];
        if (transformer) {
          const box = transformer.getClientRect();
          const stage = transformer.getStage();
          if (stage) {
            const container = stage.container().parentElement;
            if (container) {
              const containerRect = container.getBoundingClientRect();
              setDecorationTransformerBox({
                x: box.x + containerRect.left - container.scrollLeft,
                y: box.y + containerRect.top - container.scrollTop,
                width: box.width,
                height: box.height,
              });
              setSelectedDecorationId(selectedDecoration.id);
            }
          }
        }
      };

      // Update immediately and on window resize/scroll
      updateTransformerBox();
      const interval = setInterval(updateTransformerBox, 100);
      window.addEventListener("resize", updateTransformerBox);
      window.addEventListener("scroll", updateTransformerBox, true);

      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", updateTransformerBox);
        window.removeEventListener("scroll", updateTransformerBox, true);
      };
    } else {
      setDecorationTransformerBox(null);
      setSelectedDecorationId(null);
    }
  }, [canvasDecorations]);

  // Handle magnifier icon click - show random images modal
  const handleMagnifierClick = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    // Randomly select one image from photo1.jpg to photo4.jpg
    const allImages = ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"];
    // Randomly pick one image
    const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
    setModalImages([randomImage]);
    // Store the modal image for this photo
    setPhotoModalImageMap(prev => ({
      ...prev,
      [photoId]: randomImage
    }));
    setIsModalOpen(true);
  };

  // Handle add text button click - add text above left side rectangles
  const handleAddText = () => {
    // Get the topmost left rectangle (rect 0)
    const leftTopRect = demoRects[0];
    if (!leftTopRect) return;

    // Create a new text element positioned above the left rectangles
    const newText: TextData = {
      id: `text-${Date.now()}`,
      text: "テキスト",
      x: leftTopRect.x + leftTopRect.width / 2 - 50,
      y: leftTopRect.y - 100, // Position 40px above the top rectangle
      fontSize: 24,
      fontSizeUnit: "pt",
      fontFamily: "Noto Sans JP",
      fill: "#000000",
      rotation: 0,
      lineHeight: 1.2,
      letterSpacing: 0,
      align: "left",
      isSelected: false,
    };

    setTextElements((prev) => [...prev, newText]);
  };

  // Handle add image frame button click - add rectangle above left side rectangles
  const handleAddImageFrame = () => {
    // Get the topmost left rectangle (rect 0)
    const leftTopRect = demoRects[0];
    if (!leftTopRect) return;

    const defaultSize = Math.min(160, leftTopRect.width);
    const frameWidth = defaultSize;
    const frameHeight = defaultSize;
    const frameX = leftTopRect.x + (leftTopRect.width - frameWidth) / 2;
    const frameY = leftTopRect.y - frameHeight - 16; // place above with a small gap

    // Create a new image frame element positioned above the left rectangles
    const newFrame: ImageFrameData = {
      id: `frame-${Date.now()}`,
      x: frameX,
      y: frameY,
      width: frameWidth,
      height: frameHeight,
      rotation: 0,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 2,
      isSelected: false,
    };

    setImageFrames((prev) => [...prev, newFrame]);
  };

  // Handle background image upload
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        const newBackground: Background = {
          id: `uploaded-${Date.now()}-${Math.random()}`,
          name: file.name,
          imageUrl: imageUrl,
          isInUse: false,
        };
        setUploadedBackgrounds(prev => [...prev, newBackground]);
      }
    });

    // Reset input
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.value = '';
    }
  };

  // Handle background selection (for both predefined and uploaded)
  const handleBackgroundSelect = (bg: Background) => {
    setSelectedBackgroundId(bg.id);
    // Load the image and set it as background
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setBackgroundImage(img);
    };
    img.onerror = () => {
      console.error("Failed to load background image:", bg.imageUrl);
      setSelectedBackgroundId(null);
      setBackgroundImage(null);
    };
    img.src = bg.imageUrl;
  };

  // Handle decoration selection - add decoration to canvas
  const handleDecorationSelect = (decoration: { id: string; imageUrl: string; name: string }) => {
    // Get the topmost left rectangle (rect 0) - same position as image frame
    const leftTopRect = demoRects[0];
    if (!leftTopRect) return;

    const defaultSize = Math.min(160, leftTopRect.width);
    const decorationWidth = defaultSize;
    const decorationHeight = defaultSize;
    const decorationX = leftTopRect.x + (leftTopRect.width - decorationWidth) / 2;
    const decorationY = leftTopRect.y - decorationHeight - 16; // place above with a small gap

    // Load the image
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const newDecoration: DecorationData = {
        id: `decoration-${Date.now()}`,
        x: decorationX,
        y: decorationY,
        width: decorationWidth,
        height: decorationHeight,
        rotation: 0,
        imageUrl: decoration.imageUrl,
        image: img,
        isSelected: false,
        opacity: 1,
        filters: {
          brightness: 1,
          contrast: 1,
          saturation: 1,
        },
        style: {
          border: {
            enabled: false,
            width: 2,
            color: "#000000",
          },
          shadow: {
            enabled: false,
            blur: 5,
            offsetX: 2,
            offsetY: 2,
            color: "#000000",
            opacity: 0.5,
          },
        },
      };
      setCanvasDecorations(prev => [...prev, newDecoration]);
    };
    img.onerror = () => {
      console.error("Failed to load decoration image:", decoration.imageUrl);
    };
    img.src = decoration.imageUrl;
  };

  // Handle save button - download canvas as image
  const handleSave = () => {
    if (!stageRef.current) {
      alert('キャンバスを保存できませんでした。もう一度お試しください。');
      return;
    }

    try {
      // Deselect all elements to hide transformers and selection indicators
      setDemoImages(prev => prev.map(img => ({ ...img, isSelected: false })));
      setSelectedImageIndex(null);
      setTextElements(prev => prev.map(t => ({ ...t, isSelected: false })));
      setSelectedTextId(null);
      setImageFrames(prev => prev.map(f => ({ ...f, isSelected: false })));
      setCanvasDecorations(prev => prev.map(d => ({ ...d, isSelected: false })));
      setSelectedDecorationId(null);

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
          pixelRatio: 2 // Higher quality
        });

        // Create a download link
        const link = document.createElement('a');
        link.download = `layout-${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert('画像の保存中にエラーが発生しました。もう一度お試しください。');
    }
  };

  // Handle copy, paste, duplicate for elements
  const handleCopy = () => {
    if (showOtherMenu.type === 'text' && selectedTextId) {
      const selectedText = textElements.find(t => t.id === selectedTextId);
      if (selectedText) {
        setCopiedElement({ type: 'text', data: { ...selectedText } });
      }
    } else if (showOtherMenu.type === 'decoration' && selectedDecorationId) {
      const selectedDecoration = canvasDecorations.find(d => d.id === selectedDecorationId);
      if (selectedDecoration) {
        setCopiedElement({ type: 'decoration', data: { ...selectedDecoration } });
      }
    }
    setShowOtherMenu({ type: null, position: null });
  };

  const handlePaste = () => {
    if (!copiedElement.type || !copiedElement.data) return;

    if (copiedElement.type === 'text' && copiedElement.data && 'text' in copiedElement.data) {
      const newText: TextData = {
        ...copiedElement.data as TextData,
        id: `text-${Date.now()}`,
        x: copiedElement.data.x + 20,
        y: copiedElement.data.y + 20,
        isSelected: false,
      };
      setTextElements(prev => [...prev, newText]);
    } else if (copiedElement.type === 'decoration' && copiedElement.data && 'image' in copiedElement.data && copiedElement.data.image) {
      const newDecoration: DecorationData = {
        ...copiedElement.data as DecorationData,
        id: `decoration-${Date.now()}`,
        x: copiedElement.data.x + 20,
        y: copiedElement.data.y + 20,
        isSelected: false,
      };
      setCanvasDecorations(prev => [...prev, newDecoration]);
    }
    setShowOtherMenu({ type: null, position: null });
  };

  const handleDuplicate = () => {
    if (showOtherMenu.type === 'text' && selectedTextId) {
      const selectedText = textElements.find(t => t.id === selectedTextId);
      if (selectedText) {
        const newText: TextData = {
          ...selectedText,
          id: `text-${Date.now()}`,
          x: selectedText.x + 20,
          y: selectedText.y + 20,
          isSelected: false,
        };
        setTextElements(prev => [...prev, newText]);
      }
    } else if (showOtherMenu.type === 'decoration' && selectedDecorationId) {
      const selectedDecoration = canvasDecorations.find(d => d.id === selectedDecorationId);
      if (selectedDecoration) {
        const newDecoration: DecorationData = {
          ...selectedDecoration,
          id: `decoration-${Date.now()}`,
          x: selectedDecoration.x + 20,
          y: selectedDecoration.y + 20,
          isSelected: false,
        };
        setCanvasDecorations(prev => [...prev, newDecoration]);
      }
    }
    setShowOtherMenu({ type: null, position: null });
  };

  // Handle lock/unlock
  const handleLock = (type: 'photo' | 'text' | 'decoration') => {
    if (type === 'photo' && selectedImageIndex !== null) {
      setDemoImages(prev => prev.map((img, idx) => 
        idx === selectedImageIndex 
          ? { ...img, isLocked: !img.isLocked }
          : img
      ));
    } else if (type === 'text' && selectedTextId) {
      setTextElements(prev => prev.map(t => 
        t.id === selectedTextId 
          ? { ...t, isLocked: !t.isLocked }
          : t
      ));
    } else if (type === 'decoration' && selectedDecorationId) {
      setCanvasDecorations(prev => prev.map(d => 
        d.id === selectedDecorationId 
          ? { ...d, isLocked: !d.isLocked }
          : d
      ));
    }
  };

  // Handle layer order (bring to front, send to back)
  const handleLayerOrder = (action: 'front' | 'back', type: 'photo' | 'text' | 'decoration') => {
    if (type === 'photo' && selectedImageIndex !== null) {
      setDemoImages(prev => {
        const newImages = [...prev];
        const selected = newImages[selectedImageIndex];
        newImages.splice(selectedImageIndex, 1);
        if (action === 'front') {
          newImages.push(selected);
        } else {
          newImages.unshift(selected);
        }
        return newImages.map((img, idx) => ({ ...img, zIndex: idx }));
      });
    } else if (type === 'text' && selectedTextId) {
      setTextElements(prev => {
        const newElements = [...prev];
        const selectedIndex = newElements.findIndex(t => t.id === selectedTextId);
        if (selectedIndex === -1) return prev;
        const selected = newElements[selectedIndex];
        newElements.splice(selectedIndex, 1);
        if (action === 'front') {
          newElements.push(selected);
        } else {
          newElements.unshift(selected);
        }
        return newElements.map((t, idx) => ({ ...t, zIndex: idx }));
      });
    } else if (type === 'decoration' && selectedDecorationId) {
      setCanvasDecorations(prev => {
        const newDecorations = [...prev];
        const selectedIndex = newDecorations.findIndex(d => d.id === selectedDecorationId);
        if (selectedIndex === -1) return prev;
        const selected = newDecorations[selectedIndex];
        newDecorations.splice(selectedIndex, 1);
        if (action === 'front') {
          newDecorations.push(selected);
        } else {
          newDecorations.unshift(selected);
        }
        return newDecorations.map((d, idx) => ({ ...d, zIndex: idx }));
      });
    }
  };

  // Handle alignment
  const handleAlign = (align: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom', type: 'photo' | 'text' | 'decoration') => {
    if (type === 'photo' && selectedImageIndex !== null) {
      const rect = demoRects[selectedImageIndex];
      if (!rect) return;
      let newX = demoImages[selectedImageIndex].props.x;
      let newY = demoImages[selectedImageIndex].props.y;
      
      if (align === 'left') newX = rect.x;
      else if (align === 'center') newX = rect.x + (rect.width - demoImages[selectedImageIndex].props.width) / 2;
      else if (align === 'right') newX = rect.x + rect.width - demoImages[selectedImageIndex].props.width;
      else if (align === 'top') newY = rect.y;
      else if (align === 'middle') newY = rect.y + (rect.height - demoImages[selectedImageIndex].props.height) / 2;
      else if (align === 'bottom') newY = rect.y + rect.height - demoImages[selectedImageIndex].props.height;

      setDemoImages(prev => prev.map((img, idx) => 
        idx === selectedImageIndex 
          ? { ...img, props: { ...img.props, x: newX, y: newY } }
          : img
      ));
    } else if (type === 'text' && selectedTextId) {
      setTextElements(prev => prev.map(t => 
        t.id === selectedTextId 
          ? { ...t, align: align as 'left' | 'center' | 'right' }
          : t
      ));
    } else if (type === 'decoration' && selectedDecorationId) {
      const canvasCenterX = canvasWidth / 2;
      const canvasCenterY = canvasHeight / 2;
      const decoration = canvasDecorations.find(d => d.id === selectedDecorationId);
      if (!decoration) return;
      
      let newX = decoration.x;
      let newY = decoration.y;
      
      if (align === 'left') newX = 0;
      else if (align === 'center') newX = canvasCenterX - decoration.width / 2;
      else if (align === 'right') newX = canvasWidth - decoration.width;
      else if (align === 'top') newY = 0;
      else if (align === 'middle') newY = canvasCenterY - decoration.height / 2;
      else if (align === 'bottom') newY = canvasHeight - decoration.height;

      setCanvasDecorations(prev => prev.map(d => 
        d.id === selectedDecorationId 
          ? { ...d, x: newX, y: newY }
          : d
      ));
    }
  };

  // Handle delete photo
  const handleDeletePhoto = () => {
    if (selectedImageIndex !== null) {
      setDemoImages(prev => prev.map((img, idx) => 
        idx === selectedImageIndex 
          ? { ...img, image: null, isSelected: false }
          : img
      ));
      setSelectedImageIndex(null);
      setTransformerBox(null);
      setActiveMenu(null);
    }
  };

  // Handle decoration image upload
  const handleDecorationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        const newDecoration = {
          id: `uploaded-decoration-${Date.now()}-${Math.random()}`,
          name: file.name,
          imageUrl: imageUrl,
          isInUse: false,
        };
        setUploadedDecorations(prev => [...prev, newDecoration]);
      }
    });

    // Reset input
    if (decorationFileInputRef.current) {
      decorationFileInputRef.current.value = '';
    }
  };

  // Handle double-click on text to start editing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTextDoubleClick = (textData: TextData, e: any) => {
    e.cancelBubble = true;
    const textNode = e.target;

    // Calculate position relative to the container parent
    // The text position is already relative to the stage, so we just need to add the container's offset
    const x = textNode.x();
    const y = textNode.y();

    setEditingTextId(textData.id);
    setTextInputPosition({ x, y });

    // Focus input after a short delay to ensure it's rendered
    setTimeout(() => {
      textInputRef.current?.focus();
      textInputRef.current?.select();
    }, 10);
  };

  // Handle text input change
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTextId) return;

    setTextElements((prev) =>
      prev.map((t) =>
        t.id === editingTextId ? { ...t, text: e.target.value } : t
      )
    );
  };

  // Handle text input blur (finish editing)
  const handleTextInputBlur = () => {
    setEditingTextId(null);
    setTextInputPosition(null);
  };

  // Handle text input key down
  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      setEditingTextId(null);
      setTextInputPosition(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-lg font-semibold text-text-primary whitespace-nowrap">
              レイアウト - ver1 (P11-12 運動会)
            </h1>
            <div className="flex flex-1 justify-between items-center gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-background-secondary transition-colors whitespace-nowrap">
                  ページ切替
                </button>
                <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-background-secondary transition-colors whitespace-nowrap">
                  設定
                </button>
                <button className="ml-20 px-3 py-1.5 text-sm border border-border rounded hover:bg-background-secondary transition-colors whitespace-nowrap">
                  ver1を確定
                </button>
                <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-background-secondary transition-colors whitespace-nowrap">
                  全画面プレビュー
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-background-secondary transition-colors whitespace-nowrap">
                  原稿一覧に戻る
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors whitespace-nowrap font-medium"
                >
                  保存する
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Panel - 候補BOX */}
        <div className="w-64 bg-background-secondary border-r border-border p-4 overflow-y-auto">
          <h2 className="text-base font-semibold text-text-primary mb-4">
            候補BOX
          </h2>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mb-4">
            <button className="w-full px-4 py-2 text-text-primary border border-border rounded hover:bg-background-tertiary transition-colors text-sm font-medium">
              AIにおまかせ流し込み
            </button>
            <button className="w-full px-4 py-2 text-text-primary border border-border rounded hover:bg-background-tertiary transition-colors text-sm font-medium">
              自動流し込み
            </button>
          </div>

          {/* Filter and Sort Buttons */}
          <div className="flex gap-2 mb-4">
            <button className="flex-1 px-3 py-1.5 text-xs border border-border rounded hover:bg-background-tertiary transition-colors">
              絞り込み
            </button>
            <button className="flex-1 px-3 py-1.5 text-xs border border-border rounded hover:bg-background-tertiary transition-colors">
              並び替え
            </button>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square bg-gray-200 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors group overflow-hidden"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", photo.id);
                  e.dataTransfer.setData("photoId", photo.id);
                  e.dataTransfer.effectAllowed = "copy";
                  setDraggedPhotoId(photo.id);
                  // Set drag image
                  const img = e.currentTarget.querySelector(
                    "img"
                  ) as HTMLImageElement;
                  if (img) {
                    const dragImage = img.cloneNode(true) as HTMLImageElement;
                    dragImage.style.width = "100px";
                    dragImage.style.height = "100px";
                    document.body.appendChild(dragImage);
                    e.dataTransfer.setDragImage(dragImage, 50, 50);
                    setTimeout(() => document.body.removeChild(dragImage), 0);
                  }
                }}
                onDragEnd={() => {
                  setDraggedPhotoId(null);
                }}
              >
                {/* Photo Image */}
                <img
                  src={`/${photo.id}.jpg`}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />

                {/* Magnifying Glass Icon at bottom left */}
                <div
                  className="absolute bottom-1 left-1 z-10 cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={(e) => handleMagnifierClick(e, photo.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-md"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>

                {/* In Use Tag */}
                {photo.isInUse && (
                  <div className="absolute bottom-1 right-1 bg-primary text-text-light text-xs px-1.5 py-0.5 rounded z-10">
                    使用中
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main View - Demo Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background-tertiary">
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="flex flex-col items-center p-2.5 bg-white">
              <div
                className="border-2 border-red-500 border-dashed  overflow-hidden relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Check if we have a dragged photo (via types or state)
                  const hasPhotoData =
                    draggedPhotoId ||
                    e.dataTransfer?.types.includes("photoId") ||
                    e.dataTransfer?.types.includes("text/plain");
                  if (hasPhotoData) {
                    e.dataTransfer.dropEffect = "copy";
                  } else {
                    e.dataTransfer.dropEffect = "none";
                  }
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // Try to get photoId from dataTransfer first, then from state
                  let photoId: string | null = null;

                  // Try different methods to get the photoId
                  try {
                    photoId =
                      e.dataTransfer?.getData("photoId") ||
                      e.dataTransfer?.getData("text/plain") ||
                      draggedPhotoId;
                  } catch {
                    photoId = draggedPhotoId;
                  }

                  if (!photoId) {
                    console.log("No photoId found in drop event");
                    setDraggedPhotoId(null);
                    return;
                  }

                  // Get the mouse position relative to the Stage container
                  const containerRect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - containerRect.left;
                  const y = e.clientY - containerRect.top;

                  // Find which rectangle contains the drop point
                  const rectIndex = demoRects.findIndex(
                    (demoRect) =>
                      x >= demoRect.x &&
                      x <= demoRect.x + demoRect.width &&
                      y >= demoRect.y &&
                      y <= demoRect.y + demoRect.height
                  );

                  console.log("Drop detected:", { photoId, x, y, rectIndex });

                  if (rectIndex !== -1) {
                    // Use the modal image if available, otherwise randomly select one
                    let imageToUse: string;
                    if (photoModalImageMap[photoId]) {
                      imageToUse = photoModalImageMap[photoId];
                    } else {
                      // Randomly select one image from photo1.jpg to photo4.jpg
                      const allImages = ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"];
                      const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
                      // Store it for future use
                      setPhotoModalImageMap(prev => ({
                        ...prev,
                        [photoId]: randomImage
                      }));
                      imageToUse = randomImage;
                    }
                    loadImageToRectangle(`/${imageToUse}`, rectIndex);
                  } else {
                    console.log("Drop was not on any rectangle");
                  }

                  setDraggedPhotoId(null);
                }}
              >
                <Stage
                  ref={stageRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  onClick={handleDemoStageClick}
                  onTap={handleDemoStageClick}
                >
                  <Layer>
                    {/* Paper background */}
                    {backgroundImage ? (
                      <KonvaImage
                        x={0}
                        y={0}
                        width={canvasWidth}
                        height={canvasHeight}
                        image={backgroundImage}
                        listening={false}
                      />
                    ) : (
                      <Rect
                        x={0}
                        y={0}
                        width={canvasWidth}
                        height={canvasHeight}
                        fill="#ffffff"
                        listening={false}
                      />
                    )}

                    {/* Page divider */}
                    <Rect
                      x={canvasWidth / 2}
                      y={0}
                      width={2}
                      height={canvasHeight}
                      fill="#d1d5db"
                      listening={false}
                    />
                    {demoRects.map((rect, rectIndex) => (
                      <Group key={rectIndex}>
                        {/* Clipping rectangle - this defines the visible area for rectangle bounds */}
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
                            stroke={backgroundImage ? "#ffffff" : "#666"}
                            strokeWidth={backgroundImage ? 4 : 2}
                            dash={[10, 5]}
                            fill={
                              backgroundImage
                                ? "rgba(255, 255, 255, 0.3)"
                                : "rgba(200, 200, 200, 0.1)"
                            }
                            opacity={1}
                            shadowBlur={backgroundImage ? 4 : 0}
                            shadowColor={
                              backgroundImage ? "#000000" : undefined
                            }
                            shadowOpacity={backgroundImage ? 0.5 : 0}
                            listening={false}
                          />

                          {/* Uploaded image with shadow - INSIDE clipping group */}
                          {demoImages[rectIndex].image &&
                            (() => {
                              const shadowEnabled =
                                demoImages[rectIndex].style?.shadow?.enabled ||
                                false;
                              // Only set shadow properties when enabled - Konva needs actual values
                              const shadowBlur = shadowEnabled
                                ? demoImages[rectIndex].style?.shadow?.blur || 5
                                : undefined;
                              const shadowOffsetX = shadowEnabled
                                ? demoImages[rectIndex].style?.shadow
                                    ?.offsetX || 2
                                : undefined;
                              const shadowOffsetY = shadowEnabled
                                ? demoImages[rectIndex].style?.shadow
                                    ?.offsetY || 2
                                : undefined;
                              const shadowColor = shadowEnabled
                                ? demoImages[rectIndex].style?.shadow?.color ||
                                  "#000000"
                                : undefined;
                              const shadowOpacity = shadowEnabled
                                ? demoImages[rectIndex].style?.shadow
                                    ?.opacity || 0.5
                                : undefined;

                              console.log(`[Shadow Debug] Rect ${rectIndex}:`, {
                                shadowEnabled,
                                shadowBlur,
                                shadowOffsetX,
                                shadowOffsetY,
                                shadowColor,
                                shadowOpacity,
                                style: demoImages[rectIndex].style?.shadow,
                                fullStyle: demoImages[rectIndex].style,
                              });

                              // Create a wrapper group that will contain both shadow and clipped content
                              return (
                                <Group
                                  key={`image-wrapper-${rectIndex}`}
                                  x={0}
                                  y={0}
                                  draggable={false}
                                >
                                  {/* Shadow group - OUTSIDE clipping */}
                                  <Group
                                    x={demoImages[rectIndex].props.x}
                                    y={demoImages[rectIndex].props.y}
                                    rotation={
                                      demoImages[rectIndex].props.rotation
                                    }
                                    opacity={
                                      demoImages[rectIndex].style?.opacity ?? 1
                                    }
                                    shadowBlur={shadowBlur}
                                    shadowOffsetX={shadowOffsetX}
                                    shadowOffsetY={shadowOffsetY}
                                    shadowColor={shadowColor}
                                    shadowOpacity={shadowOpacity}
                                    onMouseEnter={() => {
                                      console.log(
                                        `[Shadow Debug] Shadow Group mouse enter - Rect ${rectIndex}`
                                      );
                                      console.log(
                                        `[Shadow Debug] Shadow properties on Group:`,
                                        {
                                          shadowBlur,
                                          shadowOffsetX,
                                          shadowOffsetY,
                                          shadowColor,
                                          shadowOpacity,
                                          enabled: shadowEnabled,
                                        }
                                      );
                                      // Check actual Konva node shadow properties (if available)
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      const node = (window as any).konvaNode;
                                      if (node) {
                                        console.log(
                                          `[Shadow Debug] Konva node shadowBlur:`,
                                          node.shadowBlur?.()
                                        );
                                        console.log(
                                          `[Shadow Debug] Konva node shadowOffsetX:`,
                                          node.shadowOffsetX?.()
                                        );
                                        console.log(
                                          `[Shadow Debug] Konva node shadowColor:`,
                                          node.shadowColor?.()
                                        );
                                      }
                                    }}
                                    ref={(el) => {
                                      if (el && shadowEnabled) {
                                        console.log(
                                          `[Shadow Debug] Group ref set - Rect ${rectIndex}`
                                        );
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const node = el as any;
                                        console.log(
                                          `[Shadow Debug] Node type:`,
                                          node.getType?.()
                                        );
                                        console.log(
                                          `[Shadow Debug] Node attrs (full):`,
                                          node.getAttrs?.()
                                        );
                                        console.log(
                                          `[Shadow Debug] Node attrs (shadowBlur):`,
                                          node.attrs?.shadowBlur
                                        );
                                        console.log(
                                          `[Shadow Debug] Node attrs (shadowOffsetX):`,
                                          node.attrs?.shadowOffsetX
                                        );
                                        console.log(
                                          `[Shadow Debug] Node attrs (shadowOffsetY):`,
                                          node.attrs?.shadowOffsetY
                                        );
                                        console.log(
                                          `[Shadow Debug] Node attrs (shadowColor):`,
                                          node.attrs?.shadowColor
                                        );
                                        console.log(
                                          `[Shadow Debug] Node attrs (shadowOpacity):`,
                                          node.attrs?.shadowOpacity
                                        );
                                        // Try accessing as methods
                                        if (
                                          typeof node.shadowBlur === "function"
                                        ) {
                                          console.log(
                                            `[Shadow Debug] Group shadowBlur (method):`,
                                            node.shadowBlur()
                                          );
                                        }
                                        if (
                                          typeof node.shadowOffsetX ===
                                          "function"
                                        ) {
                                          console.log(
                                            `[Shadow Debug] Group shadowOffsetX (method):`,
                                            node.shadowOffsetX()
                                          );
                                        }
                                        if (
                                          typeof node.shadowOffsetY ===
                                          "function"
                                        ) {
                                          console.log(
                                            `[Shadow Debug] Group shadowOffsetY (method):`,
                                            node.shadowOffsetY()
                                          );
                                        }
                                        if (
                                          typeof node.shadowColor === "function"
                                        ) {
                                          console.log(
                                            `[Shadow Debug] Group shadowColor (method):`,
                                            node.shadowColor()
                                          );
                                        }
                                        if (
                                          typeof node.shadowOpacity ===
                                          "function"
                                        ) {
                                          console.log(
                                            `[Shadow Debug] Group shadowOpacity (method):`,
                                            node.shadowOpacity()
                                          );
                                        }
                                        console.log(
                                          `[Shadow Debug] Shadow values passed to props:`,
                                          {
                                            shadowBlur,
                                            shadowOffsetX,
                                            shadowOffsetY,
                                            shadowColor,
                                            shadowOpacity,
                                            shadowEnabled,
                                          }
                                        );
                                      }
                                    }}
                                  >
                                    {/* Inner Group for clipping - shadow is applied to outer Group */}
                                    <Group
                                      clipFunc={(ctx) => {
                                        const style =
                                          demoImages[rectIndex].style;
                                        const w =
                                          demoImages[rectIndex].props.width;
                                        const h =
                                          demoImages[rectIndex].props.height;

                                        // Clip function uses coordinates relative to the group
                                        if (style?.frameShape === "circle") {
                                          const radius = Math.min(w, h) / 2;
                                          ctx.beginPath();
                                          ctx.arc(
                                            w / 2,
                                            h / 2,
                                            radius,
                                            0,
                                            Math.PI * 2
                                          );
                                          ctx.closePath();
                                        } else if (
                                          style?.frameShape === "rounded"
                                        ) {
                                          const radius =
                                            style.borderRadius || 10;
                                          ctx.beginPath();
                                          ctx.moveTo(radius, 0);
                                          ctx.lineTo(w - radius, 0);
                                          ctx.quadraticCurveTo(w, 0, w, radius);
                                          ctx.lineTo(w, h - radius);
                                          ctx.quadraticCurveTo(
                                            w,
                                            h,
                                            w - radius,
                                            h
                                          );
                                          ctx.lineTo(radius, h);
                                          ctx.quadraticCurveTo(
                                            0,
                                            h,
                                            0,
                                            h - radius
                                          );
                                          ctx.lineTo(0, radius);
                                          ctx.quadraticCurveTo(0, 0, radius, 0);
                                          ctx.closePath();
                                        } else {
                                          ctx.rect(0, 0, w, h);
                                        }
                                      }}
                                    >
                                      <KonvaImage
                                        ref={(el) => {
                                          demoImageRefs.current[rectIndex] = el;
                                        }}
                                        image={
                                          demoImages[rectIndex].image ||
                                          undefined
                                        }
                                        x={0}
                                        y={0}
                                        width={
                                          demoImages[rectIndex].props.width
                                        }
                                        height={
                                          demoImages[rectIndex].props.height
                                        }
                                        scaleX={
                                          demoImages[rectIndex].props.scaleX
                                        }
                                        scaleY={
                                          demoImages[rectIndex].props.scaleY
                                        }
                                        draggable={false}
                                      />

                                      {/* Border as separate rect when enabled */}
                                      {demoImages[rectIndex].style?.border
                                        ?.enabled && (
                                        <Rect
                                          x={0}
                                          y={0}
                                          width={
                                            demoImages[rectIndex].props.width
                                          }
                                          height={
                                            demoImages[rectIndex].props.height
                                          }
                                          stroke={
                                            demoImages[rectIndex].style.border
                                              .color
                                          }
                                          strokeWidth={
                                            demoImages[rectIndex].style.border
                                              .width
                                          }
                                          cornerRadius={
                                            demoImages[rectIndex].style
                                              .frameShape === "rounded"
                                              ? demoImages[rectIndex].style
                                                  .borderRadius || 10
                                              : demoImages[rectIndex].style
                                                  .frameShape === "circle"
                                              ? Math.min(
                                                  demoImages[rectIndex].props
                                                    .width,
                                                  demoImages[rectIndex].props
                                                    .height
                                                ) / 2
                                              : 0
                                          }
                                          listening={false}
                                        />
                                      )}
                                    </Group>
                                  </Group>

                                  {/* Draggable wrapper for interaction */}
                                  <Group
                                    ref={(el) => {
                                      if (el) {
                                        demoDraggableGroupRefs.current[
                                          rectIndex
                                        ] = el;
                                      }
                                    }}
                                    x={demoImages[rectIndex].props.x}
                                    y={demoImages[rectIndex].props.y}
                                    rotation={
                                      demoImages[rectIndex].props.rotation
                                    }
                                    offsetX={0}
                                    offsetY={0}
                                    draggable={demoImages[rectIndex].isSelected && !demoImages[rectIndex].isLocked}
                                    onClick={(e) => {
                                      e.cancelBubble = true;
                                      // Toggle selection: if already selected, deselect; otherwise select
                                      const isCurrentlySelected =
                                        demoImages[rectIndex].isSelected;
                                      const newImages = demoImages.map(
                                        (img, idx) => ({
                                          ...img,
                                          isSelected:
                                            idx === rectIndex
                                              ? !isCurrentlySelected
                                              : false,
                                        })
                                      );
                                      setDemoImages(newImages);

                                      // Update selected image index
                                      if (!isCurrentlySelected) {
                                        setSelectedImageIndex(rectIndex);
                                      } else {
                                        setSelectedImageIndex(null);
                                        setTransformerBox(null);
                                        setActiveMenu(null);
                                      }
                                    }}
                                    onTap={(e) => {
                                      e.cancelBubble = true;
                                      // Toggle selection: if already selected, deselect; otherwise select
                                      const isCurrentlySelected =
                                        demoImages[rectIndex].isSelected;
                                      const newImages = demoImages.map(
                                        (img, idx) => ({
                                          ...img,
                                          isSelected:
                                            idx === rectIndex
                                              ? !isCurrentlySelected
                                              : false,
                                        })
                                      );
                                      setDemoImages(newImages);

                                      // Update selected image index
                                      if (!isCurrentlySelected) {
                                        setSelectedImageIndex(rectIndex);
                                      } else {
                                        setSelectedImageIndex(null);
                                        setTransformerBox(null);
                                        setActiveMenu(null);
                                      }
                                    }}
                                    onDragEnd={(e) => {
                                      const node = e.target;
                                      const newImages = [...demoImages];
                                      newImages[rectIndex] = {
                                        ...newImages[rectIndex],
                                        props: {
                                          ...newImages[rectIndex].props,
                                          x: node.x(),
                                          y: node.y(),
                                        },
                                      };
                                      setDemoImages(newImages);
                                    }}
                                  >
                                    {/* Invisible rect for hit area */}
                                    <Rect
                                      x={0}
                                      y={0}
                                      width={demoImages[rectIndex].props.width}
                                      height={
                                        demoImages[rectIndex].props.height
                                      }
                                      fill="transparent"
                                    />
                                  </Group>
                                </Group>
                              );
                            })()}
                        </Group>

                        {/* Transformer for resize and rotate */}
                        {demoImages[rectIndex].isSelected &&
                          demoImages[rectIndex].image && (
                            <Transformer
                              ref={(el) => {
                                demoTransformerRefs.current[rectIndex] = el;
                                if (
                                  el &&
                                  demoDraggableGroupRefs.current[rectIndex]
                                ) {
                                  // Directly attach to the draggable group using ref
                                  el.nodes([
                                    demoDraggableGroupRefs.current[rectIndex],
                                  ]);
                                  el.getLayer()?.batchDraw();
                                }
                              }}
                              onTransformEnd={() => {
                                const transformer =
                                  demoTransformerRefs.current[rectIndex];
                                const group =
                                  demoDraggableGroupRefs.current[rectIndex];
                                if (!transformer || !group) return;

                                const scaleX = group.scaleX();
                                const scaleY = group.scaleY();

                                const currentWidth =
                                  demoImages[rectIndex].props.width;
                                const currentHeight =
                                  demoImages[rectIndex].props.height;
                                const newWidth = Math.max(
                                  10,
                                  currentWidth * scaleX
                                );
                                const newHeight = Math.max(
                                  10,
                                  currentHeight * scaleY
                                );

                                const newX = group.x();
                                const newY = group.y();
                                const newRotation = group.rotation();

                                group.scaleX(1);
                                group.scaleY(1);
                                group.offsetX(0);
                                group.offsetY(0);
                                group.x(newX);
                                group.y(newY);

                                const newImages = [...demoImages];
                                newImages[rectIndex] = {
                                  ...newImages[rectIndex],
                                  props: {
                                    ...newImages[rectIndex].props,
                                    x: newX,
                                    y: newY,
                                    rotation: newRotation,
                                    width: newWidth,
                                    height: newHeight,
                                    scaleX: 1,
                                    scaleY: 1,
                                  },
                                };

                                setDemoImages(newImages);
                              }}
                              onDragEnd={() => {
                                const group =
                                  demoDraggableGroupRefs.current[rectIndex];
                                if (!group) return;

                                const newImages = [...demoImages];
                                newImages[rectIndex] = {
                                  ...newImages[rectIndex],
                                  props: {
                                    ...newImages[rectIndex].props,
                                    x: group.x(),
                                    y: group.y(),
                                  },
                                };
                                setDemoImages(newImages);
                              }}
                              boundBoxFunc={(oldBox, newBox) => {
                                // Limit minimum size
                                if (
                                  Math.abs(newBox.width) < 5 ||
                                  Math.abs(newBox.height) < 5
                                ) {
                                  return oldBox;
                                }
                                return newBox;
                              }}
                            />
                          )}
                      </Group>
                    ))}

                    {/* Text elements */}
                    {textElements.map((textData) => {
                      // Hide text when editing
                      if (editingTextId === textData.id) return null;

                      return (
                        <Text
                          key={textData.id}
                          ref={(node) => {
                            if (node) {
                              textNodeRefs.current[textData.id] = node;
                            }
                          }}
                          x={textData.x}
                          y={textData.y}
                          text={textData.text}
                          fontSize={textData.fontSize}
                          fontFamily={textData.fontFamily}
                          fill={textData.fill}
                          rotation={textData.rotation}
                          lineHeight={textData.lineHeight || 1.2}
                          letterSpacing={textData.letterSpacing || 0}
                          align={textData.align || "left"}
                          draggable={editingTextId !== textData.id && !textData.isLocked}
                          onClick={(e) => {
                            e.cancelBubble = true;
                            // Toggle selection
                            const newIsSelected = !textData.isSelected;
                            setTextElements((prev) =>
                              prev.map((t) =>
                                t.id === textData.id
                                  ? { ...t, isSelected: newIsSelected }
                                  : { ...t, isSelected: false }
                              )
                            );
                          }}
                          onDblClick={(e) => {
                            handleTextDoubleClick(textData, e);
                          }}
                          onDragEnd={(e) => {
                            setTextElements((prev) =>
                              prev.map((t) =>
                                t.id === textData.id
                                  ? {
                                      ...t,
                                      x: e.target.x(),
                                      y: e.target.y(),
                                      rotation: e.target.rotation(),
                                    }
                                  : t
                              )
                            );
                          }}
                        />
                      );
                    })}

                    {/* Transformers for selected text elements */}
                    {textElements.map((textData) => {
                      if (!textData.isSelected || editingTextId === textData.id)
                        return null;

                      return (
                        <Transformer
                          key={`transformer-${textData.id}`}
                          ref={(ref) => {
                            if (ref) {
                              textTransformerRefs.current[textData.id] = ref;
                              const textNode =
                                textNodeRefs.current[textData.id];
                              if (textNode) {
                                ref.nodes([textNode]);
                                ref.getLayer()?.batchDraw();
                              }
                            }
                          }}
                          boundBoxFunc={(oldBox, newBox) => {
                            // Limit minimum size
                            if (
                              Math.abs(newBox.width) < 5 ||
                              Math.abs(newBox.height) < 5
                            ) {
                              return oldBox;
                            }
                            return newBox;
                          }}
                          onTransformEnd={() => {
                            const transformer =
                              textTransformerRefs.current[textData.id];
                            const textNode = textNodeRefs.current[textData.id];
                            if (!transformer || !textNode) return;

                            const nodes = transformer.nodes();
                            if (nodes.length === 0) return;
                            const node = nodes[0];

                            // Get the current scale
                            const scaleY = node.scaleY();

                            // Calculate new font size based on scale
                            // The visual size is fontSize * scaleY, so new fontSize = currentFontSize * scaleY
                            const newFontSize = Math.max(
                              5,
                              textData.fontSize * scaleY
                            );

                            // Update the node's fontSize directly to prevent visual glitch
                            node.fontSize(newFontSize);

                            // Reset scale
                            node.scaleX(1);
                            node.scaleY(1);

                            // Update state to persist the changes
                            setTextElements((prev) =>
                              prev.map((t) =>
                                t.id === textData.id
                                  ? {
                                      ...t,
                                      x: node.x(),
                                      y: node.y(),
                                      fontSize: newFontSize,
                                      rotation: node.rotation(),
                                    }
                                  : t
                              )
                            );

                            // Force layer redraw
                            const layer = node.getLayer();
                            if (layer) {
                              layer.batchDraw();
                            }
                          }}
                          onDragEnd={() => {
                            const transformer =
                              textTransformerRefs.current[textData.id];
                            const textNode = textNodeRefs.current[textData.id];
                            if (!transformer || !textNode) return;

                            const nodes = transformer.nodes();
                            if (nodes.length === 0) return;
                            const node = nodes[0];

                            setTextElements((prev) =>
                              prev.map((t) =>
                                t.id === textData.id
                                  ? {
                                      ...t,
                                      x: node.x(),
                                      y: node.y(),
                                      rotation: node.rotation(),
                                    }
                                  : t
                              )
                            );
                          }}
                        />
                      );
                    })}

                    {/* Image Frame elements */}
                    {imageFrames.map((frameData) => (
                      <Rect
                        key={frameData.id}
                        ref={(node) => {
                          if (node) {
                            imageFrameNodeRefs.current[frameData.id] = node;
                          }
                        }}
                        x={frameData.x}
                        y={frameData.y}
                        width={frameData.width}
                        height={frameData.height}
                        fill={frameData.fill}
                        stroke={frameData.stroke}
                        strokeWidth={frameData.strokeWidth}
                        rotation={frameData.rotation}
                        draggable
                        onClick={(e) => {
                          e.cancelBubble = true;
                          // Toggle selection
                          setImageFrames((prev) =>
                            prev.map((f) =>
                              f.id === frameData.id
                                ? { ...f, isSelected: !f.isSelected }
                                : { ...f, isSelected: false }
                            )
                          );
                        }}
                        onDragEnd={(e) => {
                          setImageFrames((prev) =>
                            prev.map((f) =>
                              f.id === frameData.id
                                ? {
                                    ...f,
                                    x: e.target.x(),
                                    y: e.target.y(),
                                    rotation: e.target.rotation(),
                                  }
                                : f
                            )
                          );
                        }}
                      />
                    ))}

                    {/* Transformers for selected image frames */}
                    {imageFrames.map((frameData) => {
                      if (!frameData.isSelected) return null;

                      return (
                        <Transformer
                          key={`transformer-frame-${frameData.id}`}
                          ref={(ref) => {
                            if (ref) {
                              imageFrameTransformerRefs.current[frameData.id] =
                                ref;
                              const frameNode =
                                imageFrameNodeRefs.current[frameData.id];
                              if (frameNode) {
                                ref.nodes([frameNode]);
                                ref.getLayer()?.batchDraw();
                              }
                            }
                          }}
                          boundBoxFunc={(oldBox, newBox) => {
                            // Limit minimum size
                            if (
                              Math.abs(newBox.width) < 10 ||
                              Math.abs(newBox.height) < 10
                            ) {
                              return oldBox;
                            }
                            return newBox;
                          }}
                          onTransformEnd={() => {
                            const transformer =
                              imageFrameTransformerRefs.current[frameData.id];
                            const frameNode =
                              imageFrameNodeRefs.current[frameData.id];
                            if (!transformer || !frameNode) return;

                            const nodes = transformer.nodes();
                            if (nodes.length === 0) return;
                            const node = nodes[0];

                            const newWidth = Math.max(
                              10,
                              node.width() * node.scaleX()
                            );
                            const newHeight = Math.max(
                              10,
                              node.height() * node.scaleY()
                            );
                            const newX = node.x();
                            const newY = node.y();
                            const newRotation = node.rotation();

                            node.width(newWidth);
                            node.height(newHeight);
                            node.scaleX(1);
                            node.scaleY(1);
                            node.offsetX(0);
                            node.offsetY(0);
                            node.x(newX);
                            node.y(newY);

                            setImageFrames((prev) =>
                              prev.map((f) =>
                                f.id === frameData.id
                                  ? {
                                      ...f,
                                      x: newX,
                                      y: newY,
                                      width: newWidth,
                                      height: newHeight,
                                      rotation: newRotation,
                                    }
                                  : f
                              )
                            );
                          }}
                          onDragEnd={() => {
                            const transformer =
                              imageFrameTransformerRefs.current[frameData.id];
                            const frameNode =
                              imageFrameNodeRefs.current[frameData.id];
                            if (!transformer || !frameNode) return;

                            const nodes = transformer.nodes();
                            if (nodes.length === 0) return;
                            const node = nodes[0];

                            setImageFrames((prev) =>
                              prev.map((f) =>
                                f.id === frameData.id
                                  ? {
                                      ...f,
                                      x: node.x(),
                                      y: node.y(),
                                      rotation: node.rotation(),
                                    }
                                  : f
                              )
                            );
                          }}
                        />
                      );
                    })}

                    {/* Decoration elements */}
                    {canvasDecorations.map((decorationData) => {
                      if (!decorationData.image) return null;
                      
                      const shadowEnabled = decorationData.style?.shadow?.enabled || false;
                      const shadowBlur = shadowEnabled
                        ? decorationData.style?.shadow?.blur || 5
                        : undefined;
                      const shadowOffsetX = shadowEnabled
                        ? decorationData.style?.shadow?.offsetX || 2
                        : undefined;
                      const shadowOffsetY = shadowEnabled
                        ? decorationData.style?.shadow?.offsetY || 2
                        : undefined;
                      const shadowColor = shadowEnabled
                        ? decorationData.style?.shadow?.color || "#000000"
                        : undefined;
                      const shadowOpacity = shadowEnabled
                        ? decorationData.style?.shadow?.opacity || 0.5
                        : undefined;
                      
                      return (
                        <Group
                          key={decorationData.id}
                          x={decorationData.x}
                          y={decorationData.y}
                          rotation={decorationData.rotation}
                          shadowBlur={shadowBlur}
                          shadowOffsetX={shadowOffsetX}
                          shadowOffsetY={shadowOffsetY}
                          shadowColor={shadowColor}
                          shadowOpacity={shadowOpacity}
                          draggable={!decorationData.isLocked}
                          onClick={(e) => {
                            e.cancelBubble = true;
                            // Toggle selection
                            const newIsSelected = !decorationData.isSelected;
                            setCanvasDecorations((prev) =>
                              prev.map((d) =>
                                d.id === decorationData.id
                                  ? { ...d, isSelected: newIsSelected }
                                  : { ...d, isSelected: false }
                              )
                            );
                            if (!newIsSelected) {
                              setSelectedDecorationId(null);
                              setDecorationTransformerBox(null);
                              setDecorationActiveMenu(null);
                            }
                          }}
                          onDragEnd={(e) => {
                            setCanvasDecorations((prev) =>
                              prev.map((d) =>
                                d.id === decorationData.id
                                  ? {
                                      ...d,
                                      x: e.target.x(),
                                      y: e.target.y(),
                                      rotation: e.target.rotation(),
                                    }
                                  : d
                              )
                            );
                          }}
                          ref={(node) => {
                            if (node) {
                              decorationNodeRefs.current[decorationData.id] = node;
                            }
                          }}
                        >
                          <KonvaImage
                            image={decorationData.image}
                            x={0}
                            y={0}
                            width={decorationData.width}
                            height={decorationData.height}
                            opacity={decorationData.opacity !== undefined ? decorationData.opacity : 1}
                          />
                          
                          {/* Border as separate rect when enabled */}
                          {decorationData.style?.border?.enabled && (
                            <Rect
                              x={0}
                              y={0}
                              width={decorationData.width}
                              height={decorationData.height}
                              stroke={decorationData.style.border.color}
                              strokeWidth={decorationData.style.border.width}
                              listening={false}
                            />
                          )}
                        </Group>
                      );
                    })}

                    {/* Transformers for selected decorations */}
                    {canvasDecorations.map((decorationData) => {
                      if (!decorationData.isSelected || !decorationData.image) return null;

                      return (
                        <Transformer
                          key={`transformer-decoration-${decorationData.id}`}
                          ref={(ref) => {
                            if (ref) {
                              decorationTransformerRefs.current[decorationData.id] = ref;
                              const decorationNode = decorationNodeRefs.current[decorationData.id];
                              if (decorationNode) {
                                ref.nodes([decorationNode]);
                                ref.getLayer()?.batchDraw();
                              }
                            }
                          }}
                          boundBoxFunc={(oldBox, newBox) => {
                            // Limit minimum size
                            if (
                              Math.abs(newBox.width) < 10 ||
                              Math.abs(newBox.height) < 10
                            ) {
                              return oldBox;
                            }
                            return newBox;
                          }}
                          onTransformEnd={() => {
                            const transformer = decorationTransformerRefs.current[decorationData.id];
                            const decorationNode = decorationNodeRefs.current[decorationData.id];
                            if (!transformer || !decorationNode) return;

                            const nodes = transformer.nodes();
                            if (nodes.length === 0) return;
                            const node = nodes[0];

                            const newWidth = Math.max(10, node.width() * node.scaleX());
                            const newHeight = Math.max(10, node.height() * node.scaleY());
                            const newX = node.x();
                            const newY = node.y();
                            const newRotation = node.rotation();

                            node.width(newWidth);
                            node.height(newHeight);
                            node.scaleX(1);
                            node.scaleY(1);
                            node.offsetX(0);
                            node.offsetY(0);
                            node.x(newX);
                            node.y(newY);

                            setCanvasDecorations((prev) =>
                              prev.map((d) =>
                                d.id === decorationData.id
                                  ? {
                                      ...d,
                                      x: newX,
                                      y: newY,
                                      width: newWidth,
                                      height: newHeight,
                                      rotation: newRotation,
                                    }
                                  : d
                              )
                            );
                          }}
                          onDragEnd={() => {
                            const transformer = decorationTransformerRefs.current[decorationData.id];
                            const decorationNode = decorationNodeRefs.current[decorationData.id];
                            if (!transformer || !decorationNode) return;

                            const nodes = transformer.nodes();
                            if (nodes.length === 0) return;
                            const node = nodes[0];

                            setCanvasDecorations((prev) =>
                              prev.map((d) =>
                                d.id === decorationData.id
                                  ? {
                                      ...d,
                                      x: node.x(),
                                      y: node.y(),
                                      rotation: node.rotation(),
                                    }
                                  : d
                              )
                            );
                          }}
                        />
                      );
                    })}
                  </Layer>
                </Stage>

                {/* Decoration menu bar below transformer */}
                {selectedDecorationId !== null &&
                  canvasDecorations.find((d) => d.id === selectedDecorationId)?.isSelected &&
                  decorationTransformerBox && (
                    <div
                      style={{
                        position: "fixed",
                        left: `${
                          decorationTransformerBox.x + decorationTransformerBox.width / 2
                        }px`,
                        top: `${
                          decorationTransformerBox.y + decorationTransformerBox.height + 10
                        }px`,
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                      }}
                      className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-6"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {/* Menu items */}
                      {[
                        { label: "分類", icon: "○", id: "category" },
                        { label: "トリミング", icon: "○", id: "trim" },
                        { label: "スタイル", icon: "○", id: "style" },
                        {
                          label: "整列",
                          icon: "○",
                          id: "align",
                          active: decorationActiveMenu === null,
                        },
                        { label: "重ね版", icon: "○", id: "layer" },
                        { label: "削除", icon: "○", id: "delete" },
                        { label: "ロック", icon: "○", id: "lock" },
                        { label: "その他", icon: "○", id: "other" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (item.id === "delete" && selectedDecorationId) {
                              // Delete decoration
                              setCanvasDecorations((prev) =>
                                prev.filter((d) => d.id !== selectedDecorationId)
                              );
                              setSelectedDecorationId(null);
                              setDecorationTransformerBox(null);
                              setDecorationActiveMenu(null);
                            } else if (item.id === "lock") {
                              handleLock('decoration');
                            } else if (item.id === "layer") {
                              // Bring to front
                              handleLayerOrder('front', 'decoration');
                            } else if (item.id === "align") {
                              // Show alignment menu
                              const newActiveMenu = decorationActiveMenu === "align" ? null : "align";
                              setDecorationActiveMenu(newActiveMenu);
                              setShowOtherMenu({ type: null, position: null });
                            } else if (item.id === "style") {
                              const newActiveMenu =
                                decorationActiveMenu === "style" ? null : "style";
                              setDecorationActiveMenu(newActiveMenu);
                              setShowOtherMenu({ type: null, position: null });
                            } else if (item.id === "category" || item.id === "trim") {
                              // Show info or placeholder
                              alert(`${item.label}機能は準備中です`);
                            } else if (item.id === "other") {
                              // Show other menu for decorations
                              if (showOtherMenu.type === 'decoration') {
                                setShowOtherMenu({ type: null, position: null });
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setShowOtherMenu({ 
                                  type: 'decoration', 
                                  position: { x: rect.left, y: rect.bottom + 5 } 
                                });
                              }
                              setDecorationActiveMenu(null);
                            } else {
                              setDecorationActiveMenu(null);
                              setShowOtherMenu({ type: null, position: null });
                            }
                          }}
                          className={`flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity ${
                            decorationActiveMenu === item.id ? "opacity-100" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs ${
                              decorationActiveMenu === item.id || item.active
                                ? "bg-gray-300"
                                : ""
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="text-xs text-gray-700 whitespace-nowrap">
                            {item.label}
                          </span>
                          {(decorationActiveMenu === item.id || item.active) && (
                            <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {/* Decoration Alignment Panel */}
                {decorationActiveMenu === "align" &&
                  selectedDecorationId !== null &&
                  decorationTransformerBox && (
                    <div
                      style={{
                        position: "fixed",
                        left: `${
                          decorationTransformerBox.x + decorationTransformerBox.width / 2
                        }px`,
                        top: `${
                          decorationTransformerBox.y + decorationTransformerBox.height + 150
                        }px`,
                        transform: "translateX(-50%)",
                        zIndex: 1002,
                        maxWidth: "300px",
                        width: "90%",
                      }}
                      className="bg-white rounded-lg shadow-xl p-4"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="text-sm font-medium text-gray-700 mb-3">整列</div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "左", align: "left" as const },
                          { label: "中央", align: "center" as const },
                          { label: "右", align: "right" as const },
                          { label: "上", align: "top" as const },
                          { label: "中央", align: "middle" as const },
                          { label: "下", align: "bottom" as const },
                        ].map((align) => (
                          <button
                            key={align.align}
                            onClick={() => {
                              handleAlign(align.align, 'decoration');
                              setDecorationActiveMenu(null);
                            }}
                            className="px-3 py-2 text-xs rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            {align.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Decoration Style Panel */}
                {decorationActiveMenu === "style" &&
                  selectedDecorationId !== null &&
                  decorationTransformerBox &&
                  (() => {
                    const selectedDecoration = canvasDecorations.find(
                      (d) => d.id === selectedDecorationId
                    );
                    if (!selectedDecoration) return null;

                    return (
                      <div
                        style={{
                          position: "fixed",
                          left: `${
                            decorationTransformerBox.x + decorationTransformerBox.width / 2
                          }px`,
                          top: `${
                            decorationTransformerBox.y +
                            decorationTransformerBox.height +
                            80
                          }px`,
                          transform: "translateX(-50%)",
                          zIndex: 1001,
                          maxWidth: "400px",
                          width: "90%",
                        }}
                        className="bg-white rounded-lg shadow-xl p-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-base font-semibold mb-3">
                          スタイル設定
                        </h3>

                        {/* Border */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium">
                              外枠
                            </label>
                            <input
                              type="checkbox"
                              checked={
                                selectedDecoration.style?.border?.enabled || false
                              }
                              onChange={(e) => {
                                setCanvasDecorations((prev) =>
                                  prev.map((d) => {
                                    if (d.id !== selectedDecorationId) return d;
                                    if (!d.style) {
                                      return {
                                        ...d,
                                        style: {
                                          border: {
                                            enabled: e.target.checked,
                                            width: 2,
                                            color: "#000000",
                                          },
                                          shadow: {
                                            enabled: false,
                                            blur: 5,
                                            offsetX: 2,
                                            offsetY: 2,
                                            color: "#000000",
                                            opacity: 0.5,
                                          },
                                        },
                                      };
                                    }
                                    return {
                                      ...d,
                                      style: {
                                        ...d.style,
                                        border: {
                                          ...d.style.border,
                                          enabled: e.target.checked,
                                        },
                                      },
                                    };
                                  })
                                );
                              }}
                              className="w-4 h-4"
                            />
                          </div>
                          {selectedDecoration.style?.border?.enabled && (
                            <div className="ml-4 space-y-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  太さ:{" "}
                                  {selectedDecoration.style?.border?.width || 2}
                                  px
                                </label>
                                <input
                                  type="range"
                                  min="1"
                                  max="20"
                                  value={
                                    selectedDecoration.style?.border?.width || 2
                                  }
                                  onChange={(e) => {
                                    setCanvasDecorations((prev) =>
                                      prev.map((d) => {
                                        if (d.id !== selectedDecorationId || !d.style) return d;
                                        return {
                                          ...d,
                                          style: {
                                            ...d.style,
                                            border: {
                                              ...d.style.border,
                                              width: parseInt(e.target.value),
                                            },
                                          },
                                        };
                                      })
                                    );
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  色
                                </label>
                                <input
                                  type="color"
                                  value={
                                    selectedDecoration.style?.border?.color || "#000000"
                                  }
                                  onChange={(e) => {
                                    setCanvasDecorations((prev) =>
                                      prev.map((d) => {
                                        if (d.id !== selectedDecorationId || !d.style) return d;
                                        return {
                                          ...d,
                                          style: {
                                            ...d.style,
                                            border: {
                                              ...d.style.border,
                                              color: e.target.value,
                                            },
                                          },
                                        };
                                      })
                                    );
                                  }}
                                  className="w-full h-8 rounded border border-gray-300"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Shadow */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium">
                              シャドウ
                            </label>
                            <input
                              type="checkbox"
                              checked={
                                selectedDecoration.style?.shadow?.enabled || false
                              }
                              onChange={(e) => {
                                setCanvasDecorations((prev) =>
                                  prev.map((d) => {
                                    if (d.id !== selectedDecorationId) return d;
                                    if (!d.style) {
                                      return {
                                        ...d,
                                        style: {
                                          border: {
                                            enabled: false,
                                            width: 2,
                                            color: "#000000",
                                          },
                                          shadow: {
                                            enabled: e.target.checked,
                                            blur: 5,
                                            offsetX: 2,
                                            offsetY: 2,
                                            color: "#000000",
                                            opacity: 0.5,
                                          },
                                        },
                                      };
                                    }
                                    return {
                                      ...d,
                                      style: {
                                        ...d.style,
                                        shadow: {
                                          ...d.style.shadow,
                                          enabled: e.target.checked,
                                        },
                                      },
                                    };
                                  })
                                );
                              }}
                              className="w-4 h-4"
                            />
                          </div>
                          {selectedDecoration.style?.shadow?.enabled && (
                            <div className="ml-4 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    ブラー:{" "}
                                    {selectedDecoration.style?.shadow?.blur || 5}
                                    px
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={
                                      selectedDecoration.style?.shadow?.blur || 5
                                    }
                                    onChange={(e) => {
                                      setCanvasDecorations((prev) =>
                                        prev.map((d) => {
                                          if (d.id !== selectedDecorationId || !d.style) return d;
                                          return {
                                            ...d,
                                            style: {
                                              ...d.style,
                                              shadow: {
                                                ...d.style.shadow,
                                                blur: parseInt(e.target.value),
                                              },
                                            },
                                          };
                                        })
                                      );
                                    }}
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    不透明度:{" "}
                                    {Math.round(
                                      (selectedDecoration.style?.shadow?.opacity || 0.5) * 100
                                    )}
                                    %
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={
                                      (selectedDecoration.style?.shadow?.opacity || 0.5) * 100
                                    }
                                    onChange={(e) => {
                                      setCanvasDecorations((prev) =>
                                        prev.map((d) => {
                                          if (d.id !== selectedDecorationId || !d.style) return d;
                                          return {
                                            ...d,
                                            style: {
                                              ...d.style,
                                              shadow: {
                                                ...d.style.shadow,
                                                opacity: parseInt(e.target.value) / 100,
                                              },
                                            },
                                          };
                                        })
                                      );
                                    }}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    X:{" "}
                                    {selectedDecoration.style?.shadow?.offsetX || 2}
                                    px
                                  </label>
                                  <input
                                    type="range"
                                    min="-20"
                                    max="20"
                                    value={
                                      selectedDecoration.style?.shadow?.offsetX || 2
                                    }
                                    onChange={(e) => {
                                      setCanvasDecorations((prev) =>
                                        prev.map((d) => {
                                          if (d.id !== selectedDecorationId || !d.style) return d;
                                          return {
                                            ...d,
                                            style: {
                                              ...d.style,
                                              shadow: {
                                                ...d.style.shadow,
                                                offsetX: parseInt(e.target.value),
                                              },
                                            },
                                          };
                                        })
                                      );
                                    }}
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    Y:{" "}
                                    {selectedDecoration.style?.shadow?.offsetY || 2}
                                    px
                                  </label>
                                  <input
                                    type="range"
                                    min="-20"
                                    max="20"
                                    value={
                                      selectedDecoration.style?.shadow?.offsetY || 2
                                    }
                                    onChange={(e) => {
                                      setCanvasDecorations((prev) =>
                                        prev.map((d) => {
                                          if (d.id !== selectedDecorationId || !d.style) return d;
                                          return {
                                            ...d,
                                            style: {
                                              ...d.style,
                                              shadow: {
                                                ...d.style.shadow,
                                                offsetY: parseInt(e.target.value),
                                              },
                                            },
                                          };
                                        })
                                      );
                                    }}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  色
                                </label>
                                <input
                                  type="color"
                                  value={
                                    selectedDecoration.style?.shadow?.color || "#000000"
                                  }
                                  onChange={(e) => {
                                    setCanvasDecorations((prev) =>
                                      prev.map((d) => {
                                        if (d.id !== selectedDecorationId || !d.style) return d;
                                        return {
                                          ...d,
                                          style: {
                                            ...d.style,
                                            shadow: {
                                              ...d.style.shadow,
                                              color: e.target.value,
                                            },
                                          },
                                        };
                                      })
                                    );
                                  }}
                                  className="w-full h-8 rounded border border-gray-300"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Opacity */}
                        <div className="mb-4">
                          <label className="block text-xs font-medium mb-2 text-gray-700">
                            不透明度: {((selectedDecoration.opacity || 1) * 100).toFixed(0)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={selectedDecoration.opacity || 1}
                            onChange={(e) => {
                              setCanvasDecorations((prev) =>
                                prev.map((d) =>
                                  d.id === selectedDecorationId
                                    ? { ...d, opacity: parseFloat(e.target.value) }
                                    : d
                                )
                              );
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                    );
                  })()}

                {/* Text editing input field */}
                {editingTextId &&
                  textInputPosition &&
                  (() => {
                    const editingText = textElements.find(
                      (t) => t.id === editingTextId
                    );
                    if (!editingText) return null;

                    return (
                      <input
                        ref={textInputRef}
                        type="text"
                        value={editingText.text}
                        onChange={handleTextInputChange}
                        onBlur={handleTextInputBlur}
                        onKeyDown={handleTextInputKeyDown}
                        style={{
                          position: "absolute",
                          left: `${textInputPosition.x}px`,
                          top: `${textInputPosition.y}px`,
                          fontSize: `${editingText.fontSize}px`,
                          fontFamily: editingText.fontFamily,
                          color: editingText.fill,
                          border: "2px solid #3b82f6",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          background: "white",
                          outline: "none",
                          zIndex: 1000,
                          minWidth: "100px",
                          pointerEvents: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    );
                  })()}

                {/* Text menu bar below transformer */}
                {selectedTextId &&
                  textElements.find((t) => t.id === selectedTextId)
                    ?.isSelected &&
                  textTransformerBox && (
                    <div
                      style={{
                        position: "fixed",
                        left: `${
                          textTransformerBox.x + textTransformerBox.width / 2
                        }px`,
                        top: `${
                          textTransformerBox.y + textTransformerBox.height + 10
                        }px`,
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                      }}
                      className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-6"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {/* Menu items */}
                      {[
                        { label: "文字設定", icon: "○", id: "textSettings" },
                        { label: "スタイル", icon: "○", id: "style" },
                        {
                          label: "整列",
                          icon: "○",
                          id: "align",
                          active: textActiveMenu === null,
                        },
                        { label: "重ね順", icon: "○", id: "layer" },
                        { label: "削除", icon: "○", id: "delete" },
                        { label: "ロック", icon: "○", id: "lock" },
                        { label: "その他", icon: "○", id: "other" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (item.id === "delete" && selectedTextId) {
                              // Delete text element
                              setTextElements((prev) =>
                                prev.filter((t) => t.id !== selectedTextId)
                              );
                              setSelectedTextId(null);
                              setTextTransformerBox(null);
                              setTextActiveMenu(null);
                            } else if (item.id === "textSettings") {
                              const newActiveMenu =
                                textActiveMenu === "textSettings"
                                  ? null
                                  : "textSettings";
                              setTextActiveMenu(newActiveMenu);
                            } else if (item.id === "lock") {
                              handleLock('text');
                            } else if (item.id === "layer") {
                              // Bring to front
                              handleLayerOrder('front', 'text');
                            } else if (item.id === "align") {
                              // Show alignment menu
                              const newActiveMenu = textActiveMenu === "align" ? null : "align";
                              setTextActiveMenu(newActiveMenu);
                              setShowOtherMenu({ type: null, position: null });
                            } else if (item.id === "style") {
                              const newActiveMenu =
                                textActiveMenu === "style" ? null : "style";
                              setTextActiveMenu(newActiveMenu);
                              setShowOtherMenu({ type: null, position: null });
                            } else if (item.id === "other") {
                              // Show other menu for text
                              if (showOtherMenu.type === 'text') {
                                setShowOtherMenu({ type: null, position: null });
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setShowOtherMenu({ 
                                  type: 'text', 
                                  position: { x: rect.left, y: rect.bottom + 5 } 
                                });
                              }
                              setTextActiveMenu(null);
                            } else {
                              setTextActiveMenu(null);
                              setShowOtherMenu({ type: null, position: null });
                            }
                          }}
                          className={`flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity ${
                            textActiveMenu === item.id ? "opacity-100" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs ${
                              textActiveMenu === item.id || item.active
                                ? "bg-gray-300"
                                : ""
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="text-xs text-gray-700 whitespace-nowrap">
                            {item.label}
                          </span>
                          {(textActiveMenu === item.id || item.active) && (
                            <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {/* Other Menu (Copy, Paste, Duplicate) */}
                {showOtherMenu.type && showOtherMenu.position && (
                  <div
                    style={{
                      position: "fixed",
                      left: `${showOtherMenu.position.x}px`,
                      top: `${showOtherMenu.position.y}px`,
                      zIndex: 1001,
                    }}
                    className="bg-white rounded-lg shadow-lg py-1 min-w-[160px]"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handleCopy}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    >
                      <span>コピー</span>
                      <span className="text-xs text-gray-400">Ctrl + C</span>
                    </button>
                    <button
                      onClick={handlePaste}
                      disabled={!copiedElement.type}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>ペースト</span>
                      <span className="text-xs text-gray-400">Ctrl + V</span>
                    </button>
                    <button
                      onClick={handleDuplicate}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    >
                      <span>複製</span>
                      <span className="text-xs text-gray-400">Ctrl + D</span>
                    </button>
                  </div>
                )}

                {/* Text Settings Panel */}
                {textActiveMenu === "textSettings" &&
                  selectedTextId &&
                  textTransformerBox &&
                  (() => {
                    const selectedText = textElements.find(
                      (t) => t.id === selectedTextId
                    );
                    if (!selectedText) return null;

                    return (
                      <div
                        style={{
                          position: "fixed",
                          left: `${
                            textTransformerBox.x + textTransformerBox.width / 2
                          }px`,
                          top: `${
                            textTransformerBox.y +
                            textTransformerBox.height +
                            80
                          }px`,
                          transform: "translateX(-50%)",
                          zIndex: 1001,
                          maxWidth: "600px",
                          width: "90%",
                        }}
                        className="bg-white rounded-lg shadow-xl p-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-base font-semibold mb-4">
                          文字設定
                        </h3>

                        {/* Font Family and Size Controls */}
                        <div className="flex items-center gap-3 mb-4">
                          {/* Font Family Dropdown */}
                          <select
                            value={selectedText.fontFamily}
                            onChange={(e) => {
                              setTextElements((prev) =>
                                prev.map((t) =>
                                  t.id === selectedTextId
                                    ? { ...t, fontFamily: e.target.value }
                                    : t
                                )
                              );
                            }}
                            className="px-3 py-2 border border-gray-300 rounded bg-white text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <option value="Noto Sans JP">Noto Sans JP</option>
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">
                              Times New Roman
                            </option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Palatino">Palatino</option>
                          </select>

                          {/* Font Size Decrease Button */}
                          <button
                            onClick={() => {
                              setTextElements((prev) =>
                                prev.map((t) =>
                                  t.id === selectedTextId
                                    ? {
                                        ...t,
                                        fontSize: Math.max(
                                          1,
                                          t.fontSize -
                                            (t.fontSizeUnit === "pt" ? 1 : 0.5)
                                        ),
                                      }
                                    : t
                                )
                              );
                            }}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
                          >
                            <span className="text-sm font-bold">−</span>
                          </button>

                          {/* Font Size Input and Unit Selector */}
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={selectedText.fontSize}
                              onChange={(e) => {
                                const size = parseFloat(e.target.value);
                                if (!isNaN(size) && size > 0) {
                                  const maxSize = 200;
                                  setTextElements((prev) =>
                                    prev.map((t) =>
                                      t.id === selectedTextId
                                        ? {
                                            ...t,
                                            fontSize: Math.max(
                                              1,
                                              Math.min(maxSize, size)
                                            ),
                                          }
                                        : t
                                    )
                                  );
                                }
                              }}
                              className="px-2 py-2 border border-gray-300 rounded bg-white text-sm w-16 text-center"
                              min="1"
                              step={
                                selectedText.fontSizeUnit === "pt" ? "1" : "0.5"
                              }
                            />
                            <select
                              value={selectedText.fontSizeUnit || "pt"}
                              onChange={(e) => {
                                const newUnit = e.target.value as "pt" | "Q";
                                let newSize = selectedText.fontSize;

                                // Convert between units
                                // 1Q ≈ 0.708pt, 1pt ≈ 1.411Q
                                if (
                                  (selectedText.fontSizeUnit || "pt") ===
                                    "pt" &&
                                  newUnit === "Q"
                                ) {
                                  newSize = selectedText.fontSize * 1.411; // Convert pt to Q
                                } else if (
                                  (selectedText.fontSizeUnit || "pt") === "Q" &&
                                  newUnit === "pt"
                                ) {
                                  newSize = selectedText.fontSize * 0.708; // Convert Q to pt
                                }

                                setTextElements((prev) =>
                                  prev.map((t) =>
                                    t.id === selectedTextId
                                      ? {
                                          ...t,
                                          fontSize:
                                            Math.round(newSize * 10) / 10,
                                          fontSizeUnit: newUnit,
                                        }
                                      : t
                                  )
                                );
                              }}
                              className="px-2 py-2 border border-gray-300 rounded bg-white text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <option value="pt">pt</option>
                              <option value="Q">Q</option>
                            </select>
                          </div>

                          {/* Font Size Increase Button */}
                          <button
                            onClick={() => {
                              setTextElements((prev) =>
                                prev.map((t) =>
                                  t.id === selectedTextId
                                    ? {
                                        ...t,
                                        fontSize: Math.min(
                                          200,
                                          t.fontSize +
                                            (t.fontSizeUnit === "pt" ? 1 : 0.5)
                                        ),
                                      }
                                    : t
                                )
                              );
                            }}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
                          >
                            <span className="text-sm font-bold">+</span>
                          </button>

                          {/* Text Alignment and Spacing Buttons */}
                          <div className="flex items-center gap-2 ml-2">
                            <button
                              onClick={() => {
                                const currentMenu = textActiveMenu as
                                  | string
                                  | null;
                                const newActiveMenu =
                                  currentMenu === "textAlign"
                                    ? null
                                    : "textAlign";
                                setTextActiveMenu(newActiveMenu);
                              }}
                              className={`px-3 py-2 text-xs rounded border transition-colors ${
                                (textActiveMenu as string | null) ===
                                "textAlign"
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              文字揃え
                            </button>
                            <button
                              onClick={() => {
                                const currentMenu = textActiveMenu as
                                  | string
                                  | null;
                                const newActiveMenu =
                                  currentMenu === "textSpacing"
                                    ? null
                                    : "textSpacing";
                                setTextActiveMenu(newActiveMenu);
                              }}
                              className={`px-3 py-2 text-xs rounded border transition-colors ${
                                (textActiveMenu as string | null) ===
                                "textSpacing"
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              行間・カーニング
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Text Alignment Panel */}
                {textActiveMenu === "textAlign" &&
                  selectedTextId &&
                  textTransformerBox &&
                  (() => {
                    const selectedText = textElements.find(
                      (t) => t.id === selectedTextId
                    );
                    if (!selectedText) return null;

                    return (
                      <div
                        style={{
                          position: "fixed",
                          left: `${
                            textTransformerBox.x + textTransformerBox.width / 2
                          }px`,
                          top: `${
                            textTransformerBox.y +
                            textTransformerBox.height +
                            150
                          }px`,
                          transform: "translateX(-50%)",
                          zIndex: 1002,
                          maxWidth: "400px",
                          width: "90%",
                        }}
                        className="bg-white rounded-lg shadow-xl p-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-base font-semibold mb-3">
                          文字揃え
                        </h3>
                        <div className="flex gap-2">
                          {[
                            { value: "left", label: "左", icon: "☰" },
                            { value: "center", label: "中央", icon: "☰" },
                            { value: "right", label: "右", icon: "☰" },
                            { value: "justify", label: "両端", icon: "☰" },
                          ].map((align) => (
                            <button
                              key={align.value}
                              onClick={() => {
                                setTextElements((prev) =>
                                  prev.map((t) =>
                                    t.id === selectedTextId
                                      ? {
                                          ...t,
                                          align: align.value as
                                            | "left"
                                            | "center"
                                            | "right"
                                            | "justify",
                                        }
                                      : t
                                  )
                                );
                              }}
                              className={`flex-1 px-3 py-2 text-xs rounded border transition-colors ${
                                (selectedText.align || "left") === align.value
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span>{align.icon}</span>
                                <span>{align.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                {/* Text Spacing Panel */}
                {textActiveMenu === "textSpacing" &&
                  selectedTextId &&
                  textTransformerBox &&
                  (() => {
                    const selectedText = textElements.find(
                      (t) => t.id === selectedTextId
                    );
                    if (!selectedText) return null;

                    return (
                      <div
                        style={{
                          position: "fixed",
                          left: `${
                            textTransformerBox.x + textTransformerBox.width / 2
                          }px`,
                          top: `${
                            textTransformerBox.y +
                            textTransformerBox.height +
                            150
                          }px`,
                          transform: "translateX(-50%)",
                          zIndex: 1002,
                          maxWidth: "400px",
                          width: "90%",
                        }}
                        className="bg-white rounded-lg shadow-xl p-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-base font-semibold mb-3">
                          行間・カーニング
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              行間:{" "}
                              {selectedText.lineHeight
                                ? (selectedText.lineHeight * 100).toFixed(0) +
                                  "%"
                                : "120%"}
                            </label>
                            <input
                              type="range"
                              min="0.5"
                              max="3"
                              step="0.1"
                              value={selectedText.lineHeight || 1.2}
                              onChange={(e) => {
                                setTextElements((prev) =>
                                  prev.map((t) =>
                                    t.id === selectedTextId
                                      ? {
                                          ...t,
                                          lineHeight: parseFloat(
                                            e.target.value
                                          ),
                                        }
                                      : t
                                  )
                                );
                              }}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              カーニング: {selectedText.letterSpacing || 0}px
                            </label>
                            <input
                              type="range"
                              min="-5"
                              max="10"
                              step="0.5"
                              value={selectedText.letterSpacing || 0}
                              onChange={(e) => {
                                setTextElements((prev) =>
                                  prev.map((t) =>
                                    t.id === selectedTextId
                                      ? {
                                          ...t,
                                          letterSpacing: parseFloat(
                                            e.target.value
                                          ),
                                        }
                                      : t
                                  )
                                );
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Slot labels overlay */}
                {demoRects.map((rect, index) => {
                  const image = demoImages[index];
                  if (image?.image) return null;

                  return (
                    <div
                      key={`label-${index}`}
                      style={{
                        position: "absolute",
                        left: `${rect.x}px`,
                        top: `${rect.y}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                      className="pointer-events-none"
                    >
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        ここに写真を配置
                      </span>
                    </div>
                  );
                })}

                {/* Custom menu bar below transformer */}
                {selectedImageIndex !== null &&
                  demoImages[selectedImageIndex]?.isSelected &&
                  transformerBox && (
                    <div
                      style={{
                        position: "fixed",
                        left: `${
                          transformerBox.x + transformerBox.width / 2
                        }px`,
                        top: `${
                          transformerBox.y + transformerBox.height + 10
                        }px`,
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                      }}
                      className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-6"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {/* Menu items */}
                      {[
                        { label: "分類", icon: "○", id: "category" },
                        { label: "トリミング", icon: "○", id: "trim" },
                        { label: "スタイル", icon: "○", id: "style" },
                        {
                          label: "整列",
                          icon: "○",
                          id: "align",
                          active: activeMenu === null,
                        },
                        { label: "重ね版", icon: "○", id: "layer" },
                        { label: "写真削除", icon: "○", id: "delete" },
                        { label: "ロック", icon: "○", id: "lock" },
                        { label: "その他", icon: "○", id: "other" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (item.id === "delete") {
                              handleDeletePhoto();
                            } else if (item.id === "lock") {
                              handleLock('photo');
                            } else if (item.id === "layer") {
                              // Bring to front
                              handleLayerOrder('front', 'photo');
                            } else if (item.id === "align") {
                              // Show alignment menu
                              const newActiveMenu = activeMenu === "align" ? null : "align";
                              setActiveMenu(newActiveMenu);
                              setShowOtherMenu({ type: null, position: null });
                            } else if (item.id === "style") {
                              const newActiveMenu =
                                activeMenu === "style" ? null : "style";
                              setActiveMenu(newActiveMenu);
                              setShowOtherMenu({ type: null, position: null });
                            } else if (item.id === "category" || item.id === "trim") {
                              // Show info or placeholder
                              alert(`${item.label}機能は準備中です`);
                            } else if (item.id === "other") {
                              // Show other menu for photos
                              if (showOtherMenu.type === 'photo') {
                                setShowOtherMenu({ type: null, position: null });
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setShowOtherMenu({ 
                                  type: 'photo', 
                                  position: { x: rect.left, y: rect.bottom + 5 } 
                                });
                              }
                              setActiveMenu(null);
                            } else {
                              setActiveMenu(null);
                              setShowOtherMenu({ type: null, position: null });
                            }
                          }}
                          className={`flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity ${
                            activeMenu === item.id ? "opacity-100" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs ${
                              activeMenu === item.id || item.active
                                ? "bg-gray-300"
                                : ""
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="text-xs text-gray-700 whitespace-nowrap">
                            {item.label}
                          </span>
                          {(activeMenu === item.id || item.active) && (
                            <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {/* Photo Alignment Panel */}
                {activeMenu === "align" &&
                  selectedImageIndex !== null &&
                  transformerBox && (
                    <div
                      style={{
                        position: "fixed",
                        left: `${
                          transformerBox.x + transformerBox.width / 2
                        }px`,
                        top: `${
                          transformerBox.y + transformerBox.height + 150
                        }px`,
                        transform: "translateX(-50%)",
                        zIndex: 1002,
                        maxWidth: "300px",
                        width: "90%",
                      }}
                      className="bg-white rounded-lg shadow-xl p-4"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="text-sm font-medium text-gray-700 mb-3">整列</div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "左", align: "left" as const },
                          { label: "中央", align: "center" as const },
                          { label: "右", align: "right" as const },
                          { label: "上", align: "top" as const },
                          { label: "中央", align: "middle" as const },
                          { label: "下", align: "bottom" as const },
                        ].map((align) => (
                          <button
                            key={align.align}
                            onClick={() => {
                              handleAlign(align.align, 'photo');
                              setActiveMenu(null);
                            }}
                            className="px-3 py-2 text-xs rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            {align.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Text Style Panel */}
                {textActiveMenu === "style" &&
                  selectedTextId &&
                  textTransformerBox &&
                  (() => {
                    const selectedText = textElements.find(
                      (t) => t.id === selectedTextId
                    );
                    if (!selectedText) return null;

                    return (
                      <div
                        style={{
                          position: "fixed",
                          left: `${
                            textTransformerBox.x + textTransformerBox.width / 2
                          }px`,
                          top: `${
                            textTransformerBox.y +
                            textTransformerBox.height +
                            80
                          }px`,
                          transform: "translateX(-50%)",
                          zIndex: 1001,
                          maxWidth: "500px",
                          width: "90%",
                        }}
                        className="bg-white rounded-lg shadow-xl p-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-base font-semibold mb-3">
                          スタイル設定
                        </h3>

                        {/* Color Pickers */}
                        <div className="mb-4">
                          <label className="block text-xs font-medium mb-2 text-gray-700">
                            文字色
                          </label>
                          <div className="flex items-center gap-2">
                            {["#000000", "#FF0000", "#0000FF"].map(
                              (color, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setTextElements((prev) =>
                                      prev.map((t) =>
                                        t.id === selectedTextId
                                          ? { ...t, fill: color }
                                          : t
                                      )
                                    );
                                  }}
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    selectedText.fill === color
                                      ? "border-gray-600 scale-110"
                                      : "border-gray-300"
                                  }`}
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              )
                            )}
                            <input
                              type="color"
                              value={selectedText.fill}
                              onChange={(e) => {
                                setTextElements((prev) =>
                                  prev.map((t) =>
                                    t.id === selectedTextId
                                      ? { ...t, fill: e.target.value }
                                      : t
                                  )
                                );
                              }}
                              className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                              title="Custom color"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Style Panel */}
                {activeMenu === "style" &&
                  selectedImageIndex !== null &&
                  transformerBox && (
                    <div
                      style={{
                        position: "fixed",
                        left: `${
                          transformerBox.x + transformerBox.width / 2
                        }px`,
                        top: `${
                          transformerBox.y + transformerBox.height + 80
                        }px`,
                        transform: "translateX(-50%)",
                        zIndex: 1001,
                        maxWidth: "500px",
                        width: "90%",
                      }}
                      className="bg-white rounded-lg shadow-xl p-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Style panel clicked");
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-base font-semibold mb-3">
                        スタイル設定
                      </h3>

                      {/* Frame Shape */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium mb-2">
                          フレーム形状
                        </label>
                        <div className="flex gap-2">
                          {[
                            { value: "none", label: "なし" },
                            { value: "rounded", label: "角丸" },
                            { value: "circle", label: "円" },
                          ].map((shape) => (
                            <button
                              key={shape.value}
                              onClick={() => {
                                const newImages = [...demoImages];
                                if (newImages[selectedImageIndex].style) {
                                  newImages[
                                    selectedImageIndex
                                  ].style!.frameShape = shape.value as
                                    | "none"
                                    | "rounded"
                                    | "circle";
                                } else {
                                  // Initialize style if it doesn't exist
                                  newImages[selectedImageIndex].style = {
                                    frameShape: shape.value as
                                      | "none"
                                      | "rounded"
                                      | "circle",
                                    borderRadius: 10,
                                    border: {
                                      enabled: false,
                                      width: 2,
                                      color: "#000000",
                                    },
                                    shadow: {
                                      enabled: false,
                                      blur: 5,
                                      offsetX: 2,
                                      offsetY: 2,
                                      color: "#000000",
                                      opacity: 0.5,
                                    },
                                    opacity: 1,
                                  };
                                }
                                setDemoImages(newImages);
                              }}
                              className={`px-3 py-1.5 text-xs rounded border ${
                                demoImages[selectedImageIndex].style
                                  ?.frameShape === shape.value
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {shape.label}
                            </button>
                          ))}
                        </div>
                        {demoImages[selectedImageIndex].style?.frameShape ===
                          "rounded" && (
                          <div className="mt-2">
                            <label className="block text-xs text-gray-600 mb-1">
                              角丸:{" "}
                              {demoImages[selectedImageIndex].style
                                ?.borderRadius || 10}
                              px
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={
                                demoImages[selectedImageIndex].style
                                  ?.borderRadius || 10
                              }
                              onChange={(e) => {
                                const newImages = [...demoImages];
                                if (newImages[selectedImageIndex].style) {
                                  newImages[
                                    selectedImageIndex
                                  ].style!.borderRadius = parseInt(
                                    e.target.value
                                  );
                                }
                                setDemoImages(newImages);
                              }}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>

                      {/* Border */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium">
                            外枠
                          </label>
                          <input
                            type="checkbox"
                            checked={
                              demoImages[selectedImageIndex].style?.border
                                .enabled || false
                            }
                            onChange={(e) => {
                              const newImages = [...demoImages];
                              if (newImages[selectedImageIndex].style) {
                                newImages[
                                  selectedImageIndex
                                ].style!.border.enabled = e.target.checked;
                              }
                              setDemoImages(newImages);
                            }}
                            className="w-4 h-4"
                          />
                        </div>
                        {demoImages[selectedImageIndex].style?.border
                          .enabled && (
                          <div className="ml-4 space-y-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                太さ:{" "}
                                {demoImages[selectedImageIndex].style?.border
                                  .width || 2}
                                px
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="20"
                                value={
                                  demoImages[selectedImageIndex].style?.border
                                    .width || 2
                                }
                                onChange={(e) => {
                                  const newImages = [...demoImages];
                                  if (newImages[selectedImageIndex].style) {
                                    newImages[
                                      selectedImageIndex
                                    ].style!.border.width = parseInt(
                                      e.target.value
                                    );
                                  }
                                  setDemoImages(newImages);
                                }}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                色
                              </label>
                              <input
                                type="color"
                                value={
                                  demoImages[selectedImageIndex].style?.border
                                    .color || "#000000"
                                }
                                onChange={(e) => {
                                  const newImages = [...demoImages];
                                  if (newImages[selectedImageIndex].style) {
                                    newImages[
                                      selectedImageIndex
                                    ].style!.border.color = e.target.value;
                                  }
                                  setDemoImages(newImages);
                                }}
                                className="w-full h-8 rounded border border-gray-300"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Shadow */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium">
                            シャドウ
                          </label>
                          <input
                            type="checkbox"
                            checked={
                              demoImages[selectedImageIndex].style?.shadow
                                .enabled || false
                            }
                            onChange={(e) => {
                              console.log(
                                "[Shadow Debug] Shadow checkbox changed:",
                                e.target.checked
                              );
                              console.log(
                                "[Shadow Debug] Current style before update:",
                                demoImages[selectedImageIndex].style
                              );
                              const newImages = [...demoImages];
                              if (newImages[selectedImageIndex].style) {
                                newImages[
                                  selectedImageIndex
                                ].style!.shadow.enabled = e.target.checked;
                                console.log(
                                  "[Shadow Debug] Updated shadow enabled to:",
                                  e.target.checked
                                );
                                console.log(
                                  "[Shadow Debug] Updated style:",
                                  newImages[selectedImageIndex].style
                                );
                              } else {
                                // Initialize style if it doesn't exist
                                newImages[selectedImageIndex].style = {
                                  frameShape: "none",
                                  borderRadius: 10,
                                  border: {
                                    enabled: false,
                                    width: 2,
                                    color: "#000000",
                                  },
                                  shadow: {
                                    enabled: e.target.checked,
                                    blur: 5,
                                    offsetX: 2,
                                    offsetY: 2,
                                    color: "#000000",
                                    opacity: 0.5,
                                  },
                                  opacity: 1,
                                };
                                console.log(
                                  "[Shadow Debug] Initialized new style with shadow:",
                                  newImages[selectedImageIndex].style
                                );
                              }
                              setDemoImages(newImages);
                              console.log(
                                "[Shadow Debug] New images array:",
                                newImages
                              );
                            }}
                            className="w-4 h-4"
                          />
                        </div>
                        {demoImages[selectedImageIndex].style?.shadow
                          .enabled && (
                          <div className="ml-4 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  ブラー:{" "}
                                  {demoImages[selectedImageIndex].style?.shadow
                                    .blur || 5}
                                  px
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  value={
                                    demoImages[selectedImageIndex].style?.shadow
                                      .blur || 5
                                  }
                                  onChange={(e) => {
                                    const blurValue = parseInt(e.target.value);
                                    console.log(
                                      "[Shadow Debug] Shadow blur changed to:",
                                      blurValue
                                    );
                                    const newImages = [...demoImages];
                                    if (newImages[selectedImageIndex].style) {
                                      newImages[
                                        selectedImageIndex
                                      ].style!.shadow.blur = blurValue;
                                      console.log(
                                        "[Shadow Debug] Updated shadow blur:",
                                        newImages[selectedImageIndex].style
                                          ?.shadow
                                      );
                                    }
                                    setDemoImages(newImages);
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  不透明度:{" "}
                                  {Math.round(
                                    (demoImages[selectedImageIndex].style
                                      ?.shadow.opacity || 0.5) * 100
                                  )}
                                  %
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={
                                    (demoImages[selectedImageIndex].style
                                      ?.shadow.opacity || 0.5) * 100
                                  }
                                  onChange={(e) => {
                                    const opacityValue =
                                      parseInt(e.target.value) / 100;
                                    console.log(
                                      "[Shadow Debug] Shadow opacity changed to:",
                                      opacityValue
                                    );
                                    const newImages = [...demoImages];
                                    if (newImages[selectedImageIndex].style) {
                                      newImages[
                                        selectedImageIndex
                                      ].style!.shadow.opacity = opacityValue;
                                      console.log(
                                        "[Shadow Debug] Updated shadow opacity:",
                                        newImages[selectedImageIndex].style
                                          ?.shadow
                                      );
                                    }
                                    setDemoImages(newImages);
                                  }}
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  X:{" "}
                                  {demoImages[selectedImageIndex].style?.shadow
                                    .offsetX || 2}
                                  px
                                </label>
                                <input
                                  type="range"
                                  min="-20"
                                  max="20"
                                  value={
                                    demoImages[selectedImageIndex].style?.shadow
                                      .offsetX || 2
                                  }
                                  onChange={(e) => {
                                    const offsetXValue = parseInt(
                                      e.target.value
                                    );
                                    console.log(
                                      "[Shadow Debug] Shadow offsetX changed to:",
                                      offsetXValue
                                    );
                                    const newImages = [...demoImages];
                                    if (newImages[selectedImageIndex].style) {
                                      newImages[
                                        selectedImageIndex
                                      ].style!.shadow.offsetX = offsetXValue;
                                      console.log(
                                        "[Shadow Debug] Updated shadow offsetX:",
                                        newImages[selectedImageIndex].style
                                          ?.shadow
                                      );
                                    }
                                    setDemoImages(newImages);
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Y:{" "}
                                  {demoImages[selectedImageIndex].style?.shadow
                                    .offsetY || 2}
                                  px
                                </label>
                                <input
                                  type="range"
                                  min="-20"
                                  max="20"
                                  value={
                                    demoImages[selectedImageIndex].style?.shadow
                                      .offsetY || 2
                                  }
                                  onChange={(e) => {
                                    const offsetYValue = parseInt(
                                      e.target.value
                                    );
                                    console.log(
                                      "[Shadow Debug] Shadow offsetY changed to:",
                                      offsetYValue
                                    );
                                    const newImages = [...demoImages];
                                    if (newImages[selectedImageIndex].style) {
                                      newImages[
                                        selectedImageIndex
                                      ].style!.shadow.offsetY = offsetYValue;
                                      console.log(
                                        "[Shadow Debug] Updated shadow offsetY:",
                                        newImages[selectedImageIndex].style
                                          ?.shadow
                                      );
                                    }
                                    setDemoImages(newImages);
                                  }}
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                色
                              </label>
                              <input
                                type="color"
                                value={
                                  demoImages[selectedImageIndex].style?.shadow
                                    .color || "#000000"
                                }
                                onChange={(e) => {
                                  const colorValue = e.target.value;
                                  console.log(
                                    "[Shadow Debug] Shadow color changed to:",
                                    colorValue
                                  );
                                  const newImages = [...demoImages];
                                  if (newImages[selectedImageIndex].style) {
                                    newImages[
                                      selectedImageIndex
                                    ].style!.shadow.color = colorValue;
                                    console.log(
                                      "[Shadow Debug] Updated shadow color:",
                                      newImages[selectedImageIndex].style
                                        ?.shadow
                                    );
                                  }
                                  setDemoImages(newImages);
                                }}
                                className="w-full h-8 rounded border border-gray-300"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Opacity */}
                      <div>
                        <label className="block text-xs font-medium mb-2">
                          不透明度
                        </label>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            {Math.round(
                              (demoImages[selectedImageIndex].style?.opacity ||
                                1) * 100
                            )}
                            %
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={
                              (demoImages[selectedImageIndex].style?.opacity ||
                                1) * 100
                            }
                            onChange={(e) => {
                              const newImages = [...demoImages];
                              if (newImages[selectedImageIndex].style) {
                                newImages[selectedImageIndex].style!.opacity =
                                  parseInt(e.target.value) / 100;
                              } else {
                                // Initialize style if it doesn't exist
                                newImages[selectedImageIndex].style = {
                                  frameShape: "none",
                                  borderRadius: 10,
                                  border: {
                                    enabled: false,
                                    width: 2,
                                    color: "#000000",
                                  },
                                  shadow: {
                                    enabled: false,
                                    blur: 5,
                                    offsetX: 2,
                                    offsetY: 2,
                                    color: "#000000",
                                    opacity: 0.5,
                                  },
                                  opacity: parseInt(e.target.value) / 100,
                                };
                              }
                              console.log(
                                "Opacity changed to:",
                                parseInt(e.target.value) / 100
                              );
                              console.log(
                                "New style:",
                                newImages[selectedImageIndex].style
                              );
                              setDemoImages(newImages);
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Panel - Tabs */}
        <div className="w-64 bg-background-secondary border-l border-border flex flex-col overflow-hidden max-h-[calc(100vh-64px)] scroll-y-auto">
          {activeTab === null ? (
            /* Tab Headers - Vertical (shown when no tab is selected) */
            <div className="flex flex-col w-full bg-background overflow-y-auto h-full">
              <button
                onClick={() => setActiveTab("background")}
                className="px-4 py-3 text-xs font-medium transition-colors text-text-secondary hover:text-text-primary hover:bg-background-secondary border-b border-border flex-shrink-0"
              >
                背景
              </button>
              <button
                onClick={() => setActiveTab("template")}
                className="px-4 py-3 text-xs font-medium transition-colors text-text-secondary hover:text-text-primary hover:bg-background-secondary border-b border-border flex-shrink-0"
              >
                テンプレート
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className="px-4 py-3 text-xs font-medium transition-colors text-text-secondary hover:text-text-primary hover:bg-background-secondary border-b border-border flex-shrink-0"
              >
                テキスト
              </button>
              <button
                onClick={() => setActiveTab("decoration")}
                className="px-4 py-3 text-xs font-medium transition-colors text-text-secondary hover:text-text-primary hover:bg-background-secondary border-b border-border flex-shrink-0"
              >
                装飾
              </button>
            </div>
          ) : (
            /* Tab Content (shown when a tab is selected) */
            <div className="flex flex-col flex-1 overflow-hidden h-full">
              {/* Back Button */}
              <div className="flex items-center gap-2 bg-background-secondary border-b border-border">
                <button
                  onClick={() => setActiveTab(null)}
                  className="px-4 py-3 text-xs font-medium transition-colors text-text-secondary hover:text-text-primary  items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary"
                  >
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-xs font-medium text-text-primary">
                  {activeTab === "background" && "背景"}
                  {activeTab === "template" && "テンプレート"}
                  {activeTab === "text" && "テキスト・画像フレーム"}
                  {activeTab === "decoration" && "デコレーション"}
                </span>
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {/* Background Tab */}
                {activeTab === "background" && (
                  <div className="p-4">

                    {/* Upload Button */}
                    <div className="relative">
                      <input
                        ref={backgroundFileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleBackgroundUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => backgroundFileInputRef.current?.click()}
                        className="w-full mb-4 px-4 py-2 bg-primary text-text-light rounded hover:bg-primary-dark transition-colors text-sm font-medium"
                      >
                        アップロード
                      </button>
                    </div>

                    {/* Filter and Sort Buttons */}
                    <div className="flex gap-2 mb-4">
                      <button className="flex-1 px-3 py-1.5 text-xs border border-border rounded hover:bg-background-tertiary transition-colors">
                        絞り込み
                      </button>
                      <button className="flex-1 px-3 py-1.5 text-xs border border-border rounded hover:bg-background-tertiary transition-colors">
                        並び替え
                      </button>
                    </div>

                    {/* Background Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Predefined backgrounds */}
                      {backgrounds.map((bg) => (
                        <div
                          key={bg.id}
                          className={`relative aspect-square border rounded cursor-pointer hover:border-primary transition-colors overflow-hidden bg-gray-200 ${
                            selectedBackgroundId === bg.id
                              ? "border-primary border-2"
                              : "border-gray-300"
                          }`}
                          onClick={() => handleBackgroundSelect(bg)}
                        >
                          {/* Background Image */}
                          <img
                            src={bg.imageUrl}
                            alt={bg.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />

                          {/* In Use Tag */}
                          {(bg.isInUse || selectedBackgroundId === bg.id) && (
                            <div className="absolute bottom-1 right-1 bg-primary text-text-light text-xs px-1.5 py-0.5 rounded z-10">
                              {selectedBackgroundId === bg.id
                                ? "選択中"
                                : "使用中"}
                            </div>
                          )}
                        </div>
                      ))}
                      {/* Uploaded backgrounds */}
                      {uploadedBackgrounds.map((bg) => (
                        <div
                          key={bg.id}
                          className={`relative aspect-square border rounded cursor-pointer hover:border-primary transition-colors overflow-hidden bg-gray-200 ${
                            selectedBackgroundId === bg.id
                              ? "border-primary border-2"
                              : "border-gray-300"
                          }`}
                          onClick={() => handleBackgroundSelect(bg)}
                        >
                          {/* Background Image */}
                          <img
                            src={bg.imageUrl}
                            alt={bg.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />

                          {/* Selected Tag */}
                          {selectedBackgroundId === bg.id && (
                            <div className="absolute bottom-1 right-1 bg-primary text-text-light text-xs px-1.5 py-0.5 rounded z-10">
                              選択中
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Template Tab */}
                {activeTab === "template" && (
                  <div className="p-4">
                                        {/* Template List */}
                    <div className="space-y-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className="border border-gray-300 rounded bg-white p-3 cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="text-sm font-medium text-text-primary mb-2">
                            {template.name}
                          </div>

                          {/* Template Preview - Two Page Spread */}
                          <div className="flex gap-2 border border-gray-300 rounded p-2 bg-gray-50">
                            {/* Left Page */}
                            <div className="flex-1 border-r border-gray-300 pr-2">
                              {template.layout.left.map((item, idx) => {
                                if (item.type === "square") {
                                  return (
                                    <div
                                      key={idx}
                                      className="h-16 bg-gray-200 border border-gray-300 rounded mb-1"
                                    />
                                  );
                                } else if (item.type === "rectangle") {
                                  return (
                                    <div
                                      key={idx}
                                      className="h-20 bg-gray-200 border border-gray-300 rounded mb-1"
                                    />
                                  );
                                } else if (
                                  item.type === "grid" &&
                                  "cols" in item &&
                                  "rows" in item &&
                                  item.cols &&
                                  item.rows
                                ) {
                                  const gridCols =
                                    item.cols === 2
                                      ? "grid-cols-2"
                                      : "grid-cols-1";
                                  return (
                                    <div
                                      key={idx}
                                      className={`grid ${gridCols} gap-1 ${
                                        idx > 0 ? "mt-1" : ""
                                      }`}
                                    >
                                      {Array.from({
                                        length: item.cols * item.rows,
                                      }).map((_, i) => (
                                        <div
                                          key={i}
                                          className="aspect-square bg-gray-200 border border-gray-300 rounded"
                                        />
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>

                            {/* Right Page */}
                            <div className="flex-1 pl-2">
                              {template.layout.right.map((item, idx) => {
                                if (item.type === "square") {
                                  return (
                                    <div
                                      key={idx}
                                      className="h-16 bg-gray-200 border border-gray-300 rounded mb-1"
                                    />
                                  );
                                } else if (item.type === "rectangle") {
                                  return (
                                    <div
                                      key={idx}
                                      className="h-20 bg-gray-200 border border-gray-300 rounded mb-1"
                                    />
                                  );
                                } else if (
                                  item.type === "grid" &&
                                  "cols" in item &&
                                  "rows" in item &&
                                  item.cols &&
                                  item.rows
                                ) {
                                  const gridCols =
                                    item.cols === 2
                                      ? "grid-cols-2"
                                      : "grid-cols-1";
                                  return (
                                    <div
                                      key={idx}
                                      className={`grid ${gridCols} gap-1 ${
                                        idx > 0 ? "mt-1" : ""
                                      }`}
                                    >
                                      {Array.from({
                                        length: item.cols * item.rows,
                                      }).map((_, i) => (
                                        <div
                                          key={i}
                                          className="aspect-square bg-gray-200 border border-gray-300 rounded"
                                        />
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>

                          {template.isInUse && (
                            <div className="mt-2 text-right">
                              <span className="inline-block bg-primary text-text-light text-xs px-1.5 py-0.5 rounded">
                                使用中
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text Tab */}
                {activeTab === "text" && (
                  <div className="p-4">
                    {/* Add Text Button */}
                    <button
                      onClick={handleAddText}
                      className="w-full mb-3 px-4 py-3 border border-border rounded bg-white hover:bg-background-secondary transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg font-light text-text-primary">
                        +
                      </span>
                      <span className="text-sm text-text-primary">
                        テキスト追加
                      </span>
                    </button>

                    {/* Add Image Frame Button */}
                    <button
                      onClick={handleAddImageFrame}
                      className="w-full px-4 py-3 border border-border rounded bg-white hover:bg-background-secondary transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg font-light text-text-primary">
                        +
                      </span>
                      <span className="text-sm text-text-primary">
                        画像フレーム追加
                      </span>
                    </button>
                  </div>
                )}

                {/* Decoration Tab */}
                {activeTab === "decoration" && (
                  <div className="p-4">
                    {/* Dropdown Menu */}
                    <div className="mb-4">
                      <select
                        value={decorationCategory}
                        onChange={(e) => setDecorationCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded bg-white text-sm text-text-primary cursor-pointer hover:bg-background-secondary transition-colors"
                      >
                        <option value="stamp">スタンプ</option>
                        <option value="icon">アイコン</option>
                        <option value="pattern">パターン</option>
                        <option value="upload">アップロード</option>
                      </select>
                    </div>

                    {/* Upload Section */}
                    {decorationCategory === "upload" && (
                      <div className="mb-4">
                        <div className="relative">
                          <input
                            ref={decorationFileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleDecorationUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => decorationFileInputRef.current?.click()}
                            className="w-full mb-4 px-4 py-2 bg-primary text-text-light rounded hover:bg-primary-dark transition-colors text-sm font-medium"
                          >
                            アップロード
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Material Image Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {decorationCategory === "upload" ? (
                        // Show uploaded decorations
                        uploadedDecorations.map((decoration) => (
                          <div
                            key={decoration.id}
                            className="relative aspect-square bg-gray-200 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors overflow-hidden"
                            onClick={() => handleDecorationSelect(decoration)}
                          >
                            {/* Decoration Image */}
                            <img
                              src={decoration.imageUrl}
                              alt={decoration.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        // Show predefined decorations
                        decorations.map((decoration) => (
                          <div
                            key={decoration.id}
                            className="relative aspect-square bg-gray-200 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors overflow-hidden"
                            onClick={() => handleDecorationSelect(decoration)}
                          >
                            {/* Decoration Image */}
                            <img
                              src={decoration.imageUrl}
                              alt={decoration.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for displaying random images */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
            >
              ×
            </button>

            {/* Modal Title */}
            <h2 className="text-xl font-semibold mb-4">画像プレビュー</h2>

            {/* Single Random Image */}
            {modalImages.length > 0 && (
              <div className="flex justify-center">
                <img
                  src={`/${modalImages[0]}`}
                  alt="Random Preview"
                  className="max-w-full max-h-[70vh] rounded border border-gray-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LayoutEditor;
