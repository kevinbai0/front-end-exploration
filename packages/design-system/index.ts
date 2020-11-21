import { createTheme } from "./src/theme/index";
import styled, { ThemeProvider, ThemeContext } from "styled-components";
import { extractDNAProps } from "./src/helpers/extractDna";
import { withDNAProps } from "./src/helpers/withDNAProps";
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
  FontWeight
} from './src/theme/types'

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
  FontWeight
}
