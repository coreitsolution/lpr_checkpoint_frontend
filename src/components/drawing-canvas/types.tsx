export interface CustomShape {
  coordinate: Point[]
  fWidth: number
  fHeight: number
}

export interface DetectionArea {
  frame: {
    width: number;
    height: number;
  };
  points: Point[];
}

export interface Point {
  x: number;
  y: number;
}