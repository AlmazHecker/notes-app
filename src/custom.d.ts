declare const __BUILD_TIMESTAMP__: string;

interface VirtualKeyboard extends EventTarget {
  readonly boundingRect: DOMRect;
  overlaysContent: boolean;
  show(): void;
  hide(): void;
  ongeometrychange: ((this: VirtualKeyboard, ev: Event) => void) | null;
  addEventListener(
    type: "geometrychange",
    listener: (this: VirtualKeyboard, ev: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
}

interface Navigator {
  readonly virtualKeyboard?: VirtualKeyboard;
}
