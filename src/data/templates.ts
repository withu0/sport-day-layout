export interface PhotoTemplate {
  id: string;
  title: string;
  description: string;
  photoCount: number;
  layout: PhotoSlot[];
  imagePath: string;
}

export interface PhotoSlot {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  orientation: 'horizontal' | 'vertical' | 'square';
  aspectRatio: number;
}


export const templates: PhotoTemplate[] = [
  // 1 Photo Templates
  {
    id: '1-horizontal',
    title: '1 Photo: Horizontal',
    description: 'Fits a 6x4 image',
    photoCount: 1,
    imagePath: '/layout (1).webp',
    layout: [
      {
        id: 'slot-1',
        width: 6,
        height: 4,
        x: 1.25,  // Centered: (8.5 - 6) / 2 = 1.25
        y: 6,   // 6 inch top margin + 0.5 inch spacing
        orientation: 'horizontal',
        aspectRatio: 1.5
      }
    ]
  },
  {
    id: '1-square',
    title: '1 Photo: Square',
    description: 'Fits a 4x4 photo',
    photoCount: 1,
    imagePath: '/layout (2).webp',
    layout: [
      {
        id: 'slot-1',
        width: 4,
        height: 4,
        x: 2.25,  // Centered: (8.5 - 4) / 2 = 2.25
        y: 5.5,   // 6 inch top margin - 0.5 inch = 5.5
        orientation: 'square',
        aspectRatio: 1.0
      }
    ]
  },
  {
    id: '1-vertical',
    title: '1 Photo: Vertical',
    description: 'Fits a 3x4.5 image',
    photoCount: 1,
    imagePath: '/layout (3).webp',
    layout: [
      {
        id: 'slot-1',
        width: 3,
        height: 4.5,
        x: 2.75,   // Centered: (8.5 - 3) / 2 = 2.75
        y: 6,   // 6 inch top margin - 1.5 inch = 4.5
        orientation: 'vertical',
        aspectRatio: 0.67
      }
    ]
  },
  // 2 Photo Templates
  {
    id: '2-horizontal',
    title: '2 Photos: Horizontal',
    description: 'Two 3.65x2.4 images',
    photoCount: 2,
    imagePath: '/layout (4).webp',
    layout: [
      {
        id: 'slot-1',
        width: 3.65,
        height: 2.4,
        x: 0.5,  
        y: 6, 
        orientation: 'horizontal',
        aspectRatio: 2.42
      },
      {
        id: 'slot-2',
        width: 3.65,
        height: 2.4,
        x: 4.35,  // Right side: 8.5 - 0.43 - 2.13 = 5.94
        y: 8,  // Bottom aligned: 11 - 0.44 - 3.3 = 7.26
        orientation: 'vertical',
        aspectRatio: 0.65
      }
    ]
  },
  {
    id: '2-vertical',
    title: '2 Photos: Vertical',
    description: 'Two 3x4.5 images',
    photoCount: 2,
    imagePath: '/layout (5).webp',
    layout: [
      {
        id: 'slot-1',
        width: 3,
        height: 4.5,
        x: 0.833,  
        y: 6,   
        orientation: 'vertical',
        aspectRatio: 0.67
      },
      {
        id: 'slot-2',
        width: 3,
        height: 4.5,
        x: 4.667, 
        y: 6,  
        orientation: 'vertical',
        aspectRatio: 0.67
      }
    ]
  },
  {
    id: '2-square',
    title: '2 Photos: Square',
    description: 'Two 3.65x3.65 images',
    photoCount: 2,
    imagePath: '/layout (6).webp',
    layout: [
      {
        id: 'slot-1',
        width: 3.65,
        height: 3.65,
        x: 0.5,  
        y: 6.5,   
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-2',
        width: 3.65,
        height: 3.65,
        x: 4.35, 
        y: 6.5,  
        orientation: 'square',
        aspectRatio: 1.0
      }
    ]
  },
  {
    id: '2-mixed',
    title: '2 Photos: Mixed Orientation',
    description: '4x3 and 2.75x4.13',
    photoCount: 2,
    imagePath: '/layout (7).webp',
    layout: [
      {
        id: 'slot-1',
        width: 4.5,
        height: 3,
        x: 0.5,  
        y: 6.565, 
        orientation: 'horizontal',
        aspectRatio: 1.5
      },
      {
        id: 'slot-2',
        width: 2.75,
        height: 4.13,
        x: 5.25, 
        y: 6, 
        orientation: 'vertical',
        aspectRatio: 0.67
      }
    ]
  },
  // 3 Photo Templates
  {
    id: '3-mixed',
    title: '3 Photos: Mixed Layout',
    description: '3x4.5 and two 2.2x2.2',
    photoCount: 3,
    imagePath: '/layout (8).webp',
    layout: [
      {
        id: 'slot-1',
        width: 3,
        height: 4.5,
        x: 1.65,   
        y: 6,  
        orientation: 'vertical',
        aspectRatio: 0.67
      },
      {
        id: 'slot-2',
        width: 2.2,
        height: 2.2,
        x: 4.75,  
        y: 6,  
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-3',
        width: 2.2,
        height: 2.2,
        x: 4.75,  
        y: 8.3,  
        orientation: 'square',
        aspectRatio: 1.0
      }
    ]
  },
  {
    id: '3-mixed-horizontal',
    title: '3 Photos: Mixed Orientation',
    description: '5x3.3 and two 2.2x2.2',
    photoCount: 3,
    imagePath: '/layout (9).webp',
    layout: [
      {
        id: 'slot-1',
        width: 5,
        height: 3.3,
        x: 0.65,  
        y: 6.6,  
        orientation: 'horizontal',
        aspectRatio: 1.9
      },
      {
        id: 'slot-2',
        width: 2.2,
        height: 2.2,
        x: 5.75,  
        y: 6.0,  
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-3',
        width: 2.2,
        height: 2.2,
        x: 5.75,  
        y: 8.3,  
        orientation: 'square',
        aspectRatio: 1.0
      }
    ]
  },
  // 4 Photo Templates
  {
    id: '4-square',
    title: '4 Photos: Square Grid',
    description: 'Four 2.2x2.2',
    photoCount: 4,
    imagePath: '/layout (10).webp',
    layout: [
      {
        id: 'slot-1',
        width: 2.2,
        height: 2.2,
        x: 2,  
        y: 6,  
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-2',
        width: 2.2,
        height: 2.2,
        x: 4.3,  
        y: 6,   // Same Y position
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-3',
        width: 2.2,
        height: 2.2,
        x: 2,  
        y: 8.3,  
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-4',
        width: 2.2,
        height: 2.2,
        x: 4.3,  
        y: 8.3,  
        orientation: 'square',
        aspectRatio: 1.0
      }
    ]
  },
  // 5 Photo Templates
  {
    id: '5-mixed',
    title: '5 Photos: Mixed Layout',
    description: 'Four 2.1x2.1 and 2.85x4.3',
    photoCount: 5,
    imagePath: '/layout (11).webp',
    layout: [
      {
        id: 'slot-1',
        width: 2.1,
        height: 2.1,
        x: 0.625,  
        y: 6,  
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-2',
        width: 2.1,
        height: 2.1,
        x: 2.825,  
        y: 6.0,  
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-3',
        width: 2.1,
        height: 2.1,
        x: 0.625,   
        y: 8.2,  
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-4',
        width: 2.1,
        height: 2.1,
        x: 2.825,  
        y: 8.2,  
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-5',
        width: 2.85,
        height: 4.3,
        x: 5.025, 
        y: 6,  
        orientation: 'vertical',
        aspectRatio: 0.66
      }
    ]
  },
  // 6 Photo Templates
  {
    id: '6-square',
    title: '6 Photos: Square Grid',
    description: 'Six 2.2x2.2',
    photoCount: 6,
    imagePath: '/layout (12).webp',
    layout: [
      {
        id: 'slot-1',
        width: 2.2,
        height: 2.2,
        x: 0.85,   
        y: 6,   // 6 inch top margin
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-2',
        width: 2.2,
        height: 2.2,
        x: 3.15,   
        y: 6,   
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-3',
        width: 2.2,
        height: 2.2,
        x: 5.45,   
        y: 6,   
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-4',
        width: 2.2,
        height: 2.2,
        x: 0.85,   
        y: 8.3,   
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-5',
        width: 2.2,
        height: 2.2,
        x: 3.15,   
        y: 8.3,   
        orientation: 'square',
        aspectRatio: 1.0
      },
      {
        id: 'slot-6',
        width: 2.2,
        height: 2.2,
        x: 5.45,   
        y: 8.3,   
        orientation: 'square',
        aspectRatio: 1.0
      }
    ]
  }
];