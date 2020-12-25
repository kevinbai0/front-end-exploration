type RGBA = `rgba(${number},${number},${number})`;
type Hex = `#${string}`;
type Color = RGBA | Hex;

type VariantLevels = -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Variant<Name extends string> = `${Name}.${VariantLevels}`

const buildColorGroup = <Name extends string>(name: Name, value: Color, variantLevels: {
  [keyof variantLevels]
}) => {

}


const generateColors = <Colors extends Record<string, Color>>(colors: Colors) => {
  return colors
}

const color: RGBA = 'rgba(5, 10, 120)'
const color2: Hex = '#a0f9a8j'

const colors = generateColors({
  blue: '#0000ff',
  red: '#ff0000',
  white: '#ffffff',
  black: '#131313'
} as const);
