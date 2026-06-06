import type { Editor } from "@tiptap/core";
import { mergeAttributes, Node } from "@tiptap/core";
import type { Node as PMNode } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

declare module "@tiptap/core" {
  interface Storage {
    paper: PaperStorage;
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    paper: {
      toggleDrawing: () => ReturnType;
      clearAllPaper: () => ReturnType;
      setDrawOptions: (options: {
        color?: string;
        weight?: number;
      }) => ReturnType;
    };
  }
}

export interface PaperStorage {
  drawingActive: boolean;
  color: string;
  weight: number;
}

export const Paper = Node.create({
  name: "paper",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      html: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="paper"]',
        getAttrs: (dom: Element) => {
          const svg = dom.querySelector("svg.paper-svg");
          return { html: svg ? svg.innerHTML : "" };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "paper" }),
      [
        "svg",
        {
          class: "paper-svg",
          width: "100%",
          height: "100%",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 562 1000",
        },
        HTMLAttributes.html || "",
      ],
    ];
  },

  addNodeView() {
    return (props) => {
      let { node, view, getPos } = props as {
        node: PMNode;
        view: EditorView;
        getPos: (() => number | undefined) | number;
      };

      const dom = document.createElement("div");
      dom.className = "paper-node";
      dom.style.pointerEvents = "none";

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "paper-svg");
      svg.setAttribute("viewBox", "0 0 562 1000");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.innerHTML = node.attrs.html || "";
      dom.appendChild(svg);

      let active = false;
      let currentPath: SVGPathElement | null = null;

      const getPoint = (e: PointerEvent) => {
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;

        const svgMatrix = svg.getScreenCTM()?.inverse();
        if (svgMatrix) {
          const transformedPoint = point.matrixTransform(svgMatrix);
          return { x: transformedPoint.x, y: transformedPoint.y };
        }

        const rect = svg.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };

      const onPointerDown = (e: PointerEvent) => {
        if (!active) return;
        e.preventDefault();
        try {
          svg.setPointerCapture?.(e.pointerId);
        } catch {}

        const pt = getPoint(e);
        currentPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        currentPath.setAttribute("d", `M ${pt.x} ${pt.y}`);
        currentPath.setAttribute("stroke", this.editor.storage.paper.color);
        currentPath.setAttribute(
          "stroke-width",
          String(this.editor.storage.paper.weight),
        );
        currentPath.setAttribute("fill", "none");
        currentPath.setAttribute("stroke-linecap", "round");
        currentPath.setAttribute("stroke-linejoin", "round");

        svg.appendChild(currentPath);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!currentPath) return;
        e.preventDefault();
        const pt = getPoint(e);
        const d = currentPath.getAttribute("d") || "";
        currentPath.setAttribute("d", `${d} L ${pt.x} ${pt.y}`);
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!currentPath) return;
        e.preventDefault();

        const pos = typeof getPos === "function" ? getPos() : getPos;
        if (typeof pos === "number") {
          // Instantly persist the entire clean SVG string structure
          view.dispatch(
            view.state.tr.setNodeMarkup(pos, undefined, {
              html: svg.innerHTML,
            }),
          );
        }

        currentPath = null;
        try {
          svg.releasePointerCapture?.(e.pointerId);
        } catch {}
      };

      svg.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);

      const editor = (this.editor as Editor | null) ?? null;
      const updateFromStorage = () => {
        try {
          const drawing = editor?.storage?.paper?.drawingActive ?? false;
          active = Boolean(drawing);
          dom.style.pointerEvents = active ? "auto" : "none";
          dom.style.cursor = active ? "crosshair" : "default";
        } catch {}
      };

      if (editor) {
        editor.on("update", updateFromStorage);
        updateFromStorage();
      }

      return {
        dom,
        update(updatedNode: PMNode) {
          if (updatedNode.type.name !== node.type.name) return false;
          node = updatedNode;

          if (svg.innerHTML !== (node.attrs.html || "")) {
            svg.innerHTML = node.attrs.html || "";
          }
          return true;
        },
        stopEvent: (event: Event) => {
          return active && event.type.startsWith("pointer");
        },
        destroy() {
          svg.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);
          if (editor) editor.off("update", updateFromStorage);
        },
      };
    };
  },

  addStorage() {
    return {
      drawingActive: false,
      color: "#A975FF",
      weight: 4,
    };
  },

  addCommands() {
    return {
      toggleDrawing: () => () => {
        const editor = this.editor as Editor | null;
        if (!editor) return false;
        const next = !editor.storage.paper.drawingActive;
        editor.storage.paper.drawingActive = next;
        editor.setEditable(!next);
        return true;
      },
      setDrawOptions: (options: { color?: string; weight?: number }) => () => {
        const editor = this.editor as Editor | null;
        if (!editor) return false;
        if (options.color !== undefined) {
          editor.storage.paper.color = options.color;
        }
        if (options.weight !== undefined) {
          editor.storage.paper.weight = options.weight;
        }
        return true;
      },
      clearAllPaper:
        () =>
        ({ tr, dispatch }) => {
          try {
            const positions: number[] = [];
            tr.doc.descendants((n, pos) => {
              if (n.type.name === "paper") positions.push(pos);
            });

            if (!positions.length) return false;

            if (dispatch) {
              for (const pos of positions) {
                tr.setNodeMarkup(pos, undefined, {
                  html: "",
                });
              }
              dispatch(tr);
            }
            return true;
          } catch {
            return false;
          }
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        view(view: EditorView) {
          const ensurePaper = () => {
            try {
              let found = false;
              view.state.doc.descendants((n) => {
                if (n.type.name === "paper") {
                  found = true;
                  return false;
                }
              });

              if (!found) {
                view.dispatch(
                  view.state.tr.insert(
                    view.state.doc.content.size,
                    view.state.schema.nodes.paper.create({ html: "" }),
                  ),
                );
              }
            } catch {}
          };

          ensurePaper();
          return { destroy() {} };
        },
      }),
    ];
  },
});

export default Paper;
