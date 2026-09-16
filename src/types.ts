export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:3';

export interface CharacterPose {
  armL: number;
  armR: number;
  legL: number;
  legR: number;
  bodyLean?: number;
  headTilt?: number;
}

export interface AnimationSettings {
  in?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInTop' | 'slideInBottom' | 'zoomIn' | 'bounceIn';
  out?: 'fadeOut' | 'slideOutLeft' | 'slideOutRight' | 'slideOutTop' | 'slideOutBottom' | 'zoomOut' | 'bounceOut';
  inDuration?: number;
  outDuration?: number;
}

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  startTime: number;
  duration: number;
  volume: number;
}

export interface Keyframe {
  id: string;
  time: number;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  flipX?: boolean;
  pose?: CharacterPose;
}

export type PropType = 'emoji' | 'image' | 'text' | 'math' | 'chart' | 'table';

export interface MathConfig {
  formula: string;
  displayMode?: boolean;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  textColor?: string;
  cardStyle?: 'dark' | 'glass' | 'none' | 'chalkboard';
  title?: string;
}

export interface ChartConfig {
  chartType?: 'function' | 'bar';
  fn?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTangent?: boolean;
  showExtrema?: boolean;
  color?: string;
  label?: string;
  dynamicTrace?: boolean;
  data?: Array<{ label: string; value: number; color?: string }>;
}

export interface VariationTableConfig {
  xRow: string[];
  yPrimeRow: string[];
  yRow: Array<{ val: string; dir?: 'up' | 'down' | 'flat' | 'none' }>;
}

export interface TableConfig {
  tableType?: 'variation' | 'data';
  title?: string;
  headers?: string[];
  rows?: string[][];
  variation?: VariationTableConfig;
}

export interface PropItem {
  id: string;
  type: PropType;
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  startTime: number;
  duration: number;
  keyframes?: Keyframe[];
  animation?: AnimationSettings;
  mathConfig?: MathConfig;
  chartConfig?: ChartConfig;
  tableConfig?: TableConfig;
}

export interface CharacterAppearance {
  skinColor: string;
  hairColor: string;
  hairStyle: 'none' | 'short' | 'long' | 'spiky' | 'curly' | 'bun';
  shirtColor: string;
  pantsColor: string;
  accessory: 'none' | 'glasses' | 'hat' | 'cap' | 'custom';
  customAccessoryUrl?: string;
  outfitStyle?: 'formal' | 'casual' | 'vest' | 'polo';
  hasTie?: boolean;
  tieColor?: string;
  hasBelt?: boolean;
  beltColor?: string;
  hasPocketPen?: boolean;
  shoeColor?: string;
}

export interface Character {
  id: string;
  name?: string;
  showName?: boolean;
  type: string;
  imageUrl?: string;
  x: number;
  y: number;
  scale: number;
  rotation?: number;
  flipX: boolean;
  pose: CharacterPose;
  color?: string;
  appearance?: CharacterAppearance;
  startTime: number;
  duration: number;
  keyframes?: Keyframe[];
  animation?: AnimationSettings;
}

export type DialogueStyle = 'pedagogical' | 'witty' | 'dramatic' | 'storytelling' | 'conversational';

export type DialogueBoxStyle = 'bubble' | 'card' | 'cinema' | 'manga';

export interface DialogBlock {
  id: string;
  characterId: string;
  text: string;
  startTime: number;
  duration: number;
  emotion: 'neutral' | 'questioning' | 'explaining' | 'angry' | 'happy' | 'sad' | 'surprised' | 'laughing' | 'crying';
  bubbleType: 'normal' | 'thought' | 'shout' | 'manga';
  roleIcon?: string;
  boxStyle?: DialogueBoxStyle;
}

export interface ProjectFilters {
  brightness: number;
  contrast: number;
  grayscale: number;
  sepia: number;
  blur: number;
}

export interface ProjectState {
  title?: string;
  aspectRatio: AspectRatio;
  background: string;
  characters: Character[];
  props: PropItem[];
  dialogBlocks: DialogBlock[];
  audios: AudioTrack[];
  filters: ProjectFilters;
  duration: number;
  dialogueStyle?: DialogueStyle;
  dialogueBoxStyle?: DialogueBoxStyle;
}
