import * as vscode from "vscode";
import { zIndex, zInfer, zRange, zMirDecl } from "./api/schemas";
import { rangeToRange } from "./range";

type Range = zInfer<typeof zRange>;

export type Color = {
  h: number;
  s: number;
  l: number;
};

/*
const generateColor = (generated: Color[]) => {
  for (let i = 4; i < 9; i++) {
    for (let j = 4; j < 9; j++) {
      for (let k = 4; k < 9; k++) {
        if (i === j && j === k) {
          continue;
        }
        if (
          Math.abs(i - j) <= 3 ||
          Math.abs(j - k) <= 3 ||
          Math.abs(k - i) <= 3
        ) {
          continue;
        }
        const r = 25 * i;
        const g = 25 * j;
        const b = 25 * k;
        if (
          0 <
          generated.filter((v) => v.r === r && v.g === g && v.b === b).length
        ) {
          continue;
        }
        return { r, g, b };
      }
    }
  }
};
*/

let generatedHue = 0;
const generateHue = () => {
  generatedHue += 70;
  //return generatedHue % 360;
  return Math.floor(Math.random() * 360);
};

// Lifetime decoration types
const decoTypesForLifetime: vscode.TextEditorDecorationType[] = [
  vscode.window.createTextEditorDecorationType({
    light: {
      textDecoration: "underline dotted 4px darkgreen",
    },
    dark: {
      textDecoration: "underline dotted 4px lightgreen",
    },
  }),
  vscode.window.createTextEditorDecorationType({
    light: {
      textDecoration: "underline dotted 4px purple",
    },
    dark: {
      textDecoration: "underline dotted 4px purple",
    },
  }),
  vscode.window.createTextEditorDecorationType({
    light: {
      textDecoration: "underline dotted 4px yellow",
    },
    dark: {
      textDecoration: "underline dotted 4px yellow",
    },
  }),
  vscode.window.createTextEditorDecorationType({
    light: {
      textDecoration: "underline dotted 4px pink",
    },
    dark: {
      textDecoration: "underline dotted 4px pink",
    },
  }),
  vscode.window.createTextEditorDecorationType({
    light: {
      textDecoration: "underline dotted 4px orange",
    },
    dark: {
      textDecoration: "underline dotted 4px orange",
    },
  }),
];
// record[TypeIndex] = Local
const lifetimeDecoTypeRecord: zInfer<typeof zIndex>[] = [];
// [TypeIndex, Options]
let lifetimeDecos: [number, vscode.DecorationOptions][] = [];
export const localDecoration = (
  doc: vscode.TextDocument,
  local: zInfer<typeof zIndex>,
  range: zInfer<typeof zRange>
) => {
  let ty: number | undefined = undefined;
  for (let i = 0; i < lifetimeDecoTypeRecord.length; i++) {
    if (local === i) {
      ty = i;
    }
  }
  if (ty === undefined) {
    ty = lifetimeDecoTypeRecord.length;
    lifetimeDecoTypeRecord.push(local);
  }
  lifetimeDecos.push([ty, { range: rangeToRange(doc, range) }]);
};
export const applyLifetimeDecoration = (editor: vscode.TextEditor) => {
  for (let i = 0; i < decoTypesForLifetime.length; i++) {
    editor.setDecorations(
      decoTypesForLifetime[i],
      lifetimeDecos.filter(([ty, opt]) => ty === i).map(([_ty, opt]) => opt)
    );
  }
  lifetimeDecos = [];
};

// Decide what color to use for ID
let generatedColors: Color[] = [];
export const resetColor = () => {
  //generatedColors = [];
  generatedHue = 0;
};
export const decideHue = (numbers: number[]): Record<number, number> => {
  const colorMap: Record<number, number> = {};
  for (const id of numbers) {
    const color = generateHue()!;
    //generatedColors.push(color);
    colorMap[id] = color;
  }
  return colorMap;
};

let decorationTypes: vscode.TextEditorDecorationType[] = [];
export const registerDecorationType = (
  t: vscode.TextEditorDecorationType
): number => {
  decorationTypes.push(t);
  return decorationTypes.length - 1;
};
export const applyDecoration = (
  editor: vscode.TextEditor,
  tyId: number,
  opts: vscode.DecorationOptions[]
) => {
  editor.setDecorations(decorationTypes[tyId], opts);
};
export const clearDecoration = (editor: vscode.TextEditor) => {
  for (const tyId in decorationTypes) {
    editor.setDecorations(decorationTypes[tyId], []);
  }
};
export const resetDecorationType = (editor: vscode.TextEditor) => {
  clearDecoration(editor);
  decorationTypes = [];
};
