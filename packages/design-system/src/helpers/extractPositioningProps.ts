import { Spacing, Dimension, Layout, Position } from '../theme/types';

export type OuterContainerPositioning = Spacing & Dimension & Layout & Position;

export const extractPositioningProps = <T extends Record<string, any>>(
  props: T & OuterContainerPositioning,
  merge?: OuterContainerPositioning
): [OuterContainerPositioning, T] => {
  const {
    m,
    p,
    mx,
    my,
    px,
    py,
    mt,
    mb,
    ml,
    mr,
    pt,
    pr,
    pb,
    pl,
    display,
    rowLayout,
    colLayout,
    alignItems,
    justifyItems,
    alignContent,
    justifyContent,
    gap,
    align,
    justify,
    position,
    left,
    right,
    top,
    bottom,
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    flex,
    ...rest
  } = props;

  const dna: {
    [key in keyof Required<OuterContainerPositioning>]:
      | OuterContainerPositioning[key]
      | undefined;
  } = {
    m,
    p,
    mx,
    my,
    px,
    py,
    mt,
    mb,
    ml,
    mr,
    pt,
    pr,
    pb,
    pl,
    display,
    rowLayout,
    colLayout,
    alignItems,
    justifyItems,
    alignContent,
    justifyContent,
    gap,
    align,
    justify,
    position,
    left,
    right,
    top,
    bottom,
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    flex,
    ...merge,
  };

  return [dna as Partial<OuterContainerPositioning>, rest as T];
};
