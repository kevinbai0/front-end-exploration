import { Colors } from './colors';
import {
  ThemeFontWeight,
  ThemeFontFamily,
  ThemeFontSizeClass,
  ThemeFont,
  ThemeFontDefinition,
} from './fonts';
import { AppBps } from './media';
import { SpaceMultiplier } from './spacing';

export interface IFactory<
  Bps extends AppBps,
  C extends Colors,
  Families extends ThemeFontFamily<Bps>,
  FontWeights extends ThemeFontWeight<Bps>,
  SizeClasses extends ThemeFontSizeClass<Bps>,
  Fonts extends ThemeFont<Bps, Families, FontWeights, SizeClasses>,
  Space extends Record<string, SpaceMultiplier>
> {
  breakpoints: Bps;
  fonts: ThemeFontDefinition<Bps, Families, FontWeights, SizeClasses, Fonts>;
  colors: C;
  spacing: Space;
}

export const createFactory = <
  Bps extends AppBps,
  C extends Colors,
  Families extends ThemeFontFamily<Bps>,
  FontWeights extends ThemeFontWeight<Bps>,
  SizeClasses extends ThemeFontSizeClass<Bps>,
  Fonts extends ThemeFont<Bps, Families, FontWeights, SizeClasses>,
  Space extends Record<string, SpaceMultiplier>
>(options: {
  breakpoints: Bps;
  fonts: ThemeFontDefinition<Bps, Families, FontWeights, SizeClasses, Fonts>;
  colors: C;
  spacing: Space;
}) => {
  return options;
};
