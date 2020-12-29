import styled, { ThemeProvider, ThemeContext } from 'styled-components';
import { createTheme } from './theme/index';
import { extractDNAProps } from './helpers/extractDna';
import { withDNAProps } from './helpers/withDNAProps';
import { injectDNA } from './dna/index';
import {
  DNA,
  Theme,
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

export {
  createTheme,
  styled,
  ThemeProvider,
  ThemeContext,
  extractDNAProps,
  withDNAProps,
  DNA,
  Theme,
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
};
