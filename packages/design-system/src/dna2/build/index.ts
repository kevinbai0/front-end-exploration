import { Colors } from '../spec/colors';
import { IFactory } from '../spec/factory';
import {
  ThemeFont,
  ThemeFontFamily,
  ThemeFontSizeClass,
  ThemeFontWeight,
} from '../spec/fonts';
import { AppBps, MediaProperty } from '../spec/media';
import { SpaceMultiplier } from '../spec/spacing';
import { ColorProps, FontProps, SpaceProps } from './types';

export const applyGenerator = <
  Bps extends AppBps,
  C extends Colors,
  Families extends ThemeFontFamily<Bps>,
  FontWeights extends ThemeFontWeight<Bps>,
  SizeClasses extends ThemeFontSizeClass<Bps>,
  Fonts extends ThemeFont<Bps, Families, FontWeights, SizeClasses>,
  Space extends Record<string, SpaceMultiplier>,
  Fact extends IFactory<
    Bps,
    C,
    Families,
    FontWeights,
    SizeClasses,
    Fonts,
    Space
  >
>(
  mediaFn: <T>(val: T) => MediaProperty<T, Bps>,
  breakpoints: Bps,
  factory: Fact
) => (
  props: ColorProps<Fact['colors'], Bps> &
    SpaceProps<Fact['spacing'], Bps> &
    FontProps<Bps, Families, FontWeights, SizeClasses, Fonts, Fact['fonts']>
) => {
  //
  const blindProps = props as any;
  return Object.keys(blindProps).map((key) => {
    const value = blindProps[key];
    const isFunction = {}.toString.call(value) === '[object Function]';
    if (isFunction) {
      const res = value(mediaFn)();
      return { key, value: res };
    }
    return { key, value };
  });
};
