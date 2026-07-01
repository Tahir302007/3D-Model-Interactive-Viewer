export interface SceneSettings {
  modelId: string;
  customModelUrl: string | null;
  customModelName: string | null;
  autoRotate: boolean;
  rotationSpeed: number;
  ambientIntensity: number;
  directionalIntensity: number;
  lightColor: string;
  backgroundColor: string;
  showGrid: boolean;
  showAxes: boolean;
  modelScale: number;
  colorOverride: string;
  useColorOverride: boolean;
  selectedPartName: string | null;
}

export interface ModelOption {
  id: string;
  name: string;
  url: string;
  scale: number;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const PRESET_MODELS: ModelOption[] = [
  {
    id: 'duck',
    name: 'Rubber Duck',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    scale: 1.5,
    description: 'A classic, simple Rubber Duck model. Ideal for learning basic mesh structures and textures.',
    difficulty: 'Beginner'
  },
  {
    id: 'avocado',
    name: 'Avocado',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
    scale: 12,
    description: 'A high-detail organic Avocado model. Good for examining photorealistic texture maps.',
    difficulty: 'Beginner'
  },
  {
    id: 'helmet',
    name: 'Damaged Sci-Fi Helmet',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    scale: 1.8,
    description: 'An advanced sci-fi helmet showcasing complex normal maps, ambient occlusion, and metallic-roughness materials.',
    difficulty: 'Advanced'
  },
  {
    id: 'boombox',
    name: 'BoomBox Retro Stereo',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb',
    scale: 65,
    description: 'A retro retro style BoomBox. High density mesh featuring intricate material divisions.',
    difficulty: 'Intermediate'
  }
];
