import { DNA } from '../theme/types';

type Margins = Pick<DNA, 'm' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr'>;

export const extractMargins = (
  props: DNA
): [Margins, Exclude<DNA, keyof Margins>] => {
  const { m, mx, my, ml, mt, mr, mb, ...rest } = props;

  const margins: {
    [key in keyof Required<Margins>]: Margins[key];
  } = {
    m,
    mx,
    my,
    ml,
    mt,
    mr,
    mb,
  };

  return [margins, rest];
};
