export interface ProcessedImage {
  originalUrl: string;
  colorizedUrl: string | null;
  mimeType: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
