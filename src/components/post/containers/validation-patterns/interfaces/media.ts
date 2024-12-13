export interface MediaFormat {
  max: number;
  maxSize: number;
  formats: readonly string[];
}

export interface MediaDimensions {
  minWidth?: number;
  maxWidth: number;
  minHeight?: number;
  maxHeight: number;
  aspectRatio?: number;
}

export interface MediaValidation {
  formats: readonly string[];
  maxSize: number;
  dimensions?: MediaDimensions;
}

export interface MediaConfig extends MediaValidation {
  max: number;
  thumbnailSize?: {
    width: number;
    height: number;
  };
  maxDuration?: number;
} 