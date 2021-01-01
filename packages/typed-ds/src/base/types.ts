type Pixel = 'px';
type Percent = '%';
type Em = 'em';
type Rem = 'rem';
type ViewportWidth = 'vw';
type ViewportHeight = 'vh';
type ViewportDim = 'vs';

type CSSExtension =
  | Pixel
  | Percent
  | Em
  | Rem
  | ViewportWidth
  | ViewportHeight
  | ViewportDim;

export type CSSValue<T extends CSSExtension> = `${number}${T}`;
export type Size = CSSValue<Pixel | Em | ViewportWidth | Rem>;
export type LineHeight = Size | `${number}`;
