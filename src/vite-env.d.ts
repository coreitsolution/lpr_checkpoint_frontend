/// <reference types="vite/client" />
declare module '*/jsmpeg.min.js' {
  interface JSMpegOptions {
    canvas: HTMLCanvasElement;
    audio?: boolean;
    loop?: boolean;
    autoplay?: boolean;
    progressive?: boolean;
    seekable?: boolean;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onStalled?: () => void;
    onSourceEstablished?: () => void;
    onSourceCompleted?: () => void;
  }

  class Player {
    constructor(url: string | WebSocket, options: JSMpegOptions);
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;
    volume: number;
    currentTime: number;
    readonly duration: number;
    readonly frameWidth: number;
    readonly frameHeight: number;
    readonly paused: boolean;
  }

  interface JSMpegStatic {
    Player: typeof Player;
  }

  const JSMpeg: JSMpegStatic;
  export = JSMpeg;
}