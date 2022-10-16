import styled, { ThemeProvider, ThemeContext } from '@emotion/react';
import { createTheme } from './theme/index';
import { extractDNAProps } from './helpers/extractDna';
import { injectDNA, injectDNAProps } from './dna/index';

import {
  DNA,
  ITheme,
  ThemeColor,
  ThemeBorder,
  ThemeBorderRadius,
  ThemeExtension,
  ThemeFont,
  ThemeFontFamily,
  ThemeFontSize,
  ThemeLayout,
  ThemeObject,
  ThemeProperties,
  ThemeShadow,
  ThemeSpace,
  LayoutContent,
  LayoutItems,
  FontWeight,
} from './theme/types';

export * as dna from './helpers/withDNAProps';
export {
  createTheme,
  styled,
  ThemeProvider,
  ThemeContext,
  extractDNAProps,
  DNA,
  ITheme,
  ThemeColor,
  ThemeBorder,
  ThemeBorderRadius,
  ThemeExtension,
  ThemeFont,
  ThemeFontFamily,
  ThemeFontSize,
  ThemeLayout,
  ThemeObject,
  ThemeProperties,
  ThemeShadow,
  ThemeSpace,
  LayoutContent,
  LayoutItems,
  FontWeight,
  injectDNA,
  injectDNAProps,
};
