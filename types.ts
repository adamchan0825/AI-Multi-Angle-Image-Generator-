export enum ViewType {
  NO_BACKGROUND = '去背主圖',
  TOP = '俯視圖',
  BOTTOM = '仰視圖',
  FRONT = '主視圖',
  BACK = '後視圖',
  LEFT = '左視圖',
  RIGHT = '右視圖',
}

export interface GeneratedImage {
  view: ViewType;
  src: string;
}