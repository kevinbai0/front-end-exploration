export type RGBA = `rgba(${number},${number},${number})`;
export type Hex = `#${string}`;

export type Color<T extends (RGBA | Hex)[] = (RGBA | Hex)[]> =
  | RGBA
  | Hex
  | [...T];
export type ThemeColors = Record<string, Color>;
type NumberKeys<T> = T extends `${number}` ? T : never;

export const generateColors = <T extends ThemeColors>(colors: T) => {
  return colors;
};

export const colorArray = <T extends Color[]>(...colors: T) => {
  return colors;
};

export type ColorKeys<C extends ThemeColors> = {
  [Key in keyof C]: Key extends string
    ? C[Key] extends string
      ? Key
      : `${Key}.${NumberKeys<keyof C[Key]>}`
    : never;
}[keyof C];
