import {
  ThemeObject,
  Layout,
  DNA,
  ThemeLayout,
  LayoutContent,
  LayoutItems,
  ThemeExtension,
} from '../theme/types';
import { splitStyle } from './helpers';
import { matchSpaceToTheme } from './spacing';
import { InjectProperties } from './index';

export const matchLayoutToTheme = (
  { theme }: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  prop: ThemeLayout<ThemeExtension> | ThemeLayout<ThemeExtension>[]
) => {
  if (!theme.layout) return [];
  if (Array.isArray(prop)) {
    return prop.map(value => {
      return theme.layout[value];
    });
  }
  const layout = (theme.layout[prop] || []) as string | string[];
  // if color wasn't found, empty array to denote no colors
  if (typeof layout === 'string') return [layout];
  return layout;
};

export const matchLayoutAlignment = (
  _: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  prop: LayoutContent | LayoutItems
) => [prop];

export const injectLayout: InjectProperties<Layout<ThemeExtension>> = (
  props,
  defaultProps
) => {
  return [
    splitStyle(
      'display',
      [],
      (
        allProps,
        prop: ThemeLayout<ThemeExtension> | ThemeLayout<ThemeExtension>[]
      ) => matchLayoutToTheme(allProps, prop),
      props,
      defaultProps
    ),
    splitStyle(
      'rowLayout',
      ['grid-template-columns'],
      (_, prop: string) => [prop],
      props,
      defaultProps
    ),
    splitStyle(
      'colLayout',
      ['grid-template-rows'],
      (_, prop: string) => [prop],
      props,
      defaultProps
    ),
    splitStyle(
      'alignContent',
      ['align-content'],
      matchLayoutAlignment,
      props,
      defaultProps
    ),
    splitStyle(
      'justifyContent',
      ['justify-content'],
      matchLayoutAlignment,
      props,
      defaultProps
    ),
    splitStyle(
      'alignItems',
      ['align-items'],
      matchLayoutAlignment,
      props,
      defaultProps
    ),
    splitStyle(
      'justifyItems',
      ['justify-items'],
      matchLayoutAlignment,
      props,
      defaultProps
    ),
    splitStyle('gap', ['grid-gap'], matchSpaceToTheme, props, defaultProps),
    splitStyle(
      'justify',
      ['justify-self'],
      matchLayoutAlignment,
      props,
      defaultProps
    ),
    splitStyle(
      'align',
      ['align-self'],
      matchLayoutAlignment,
      props,
      defaultProps
    ),
    splitStyle('flex', ['flex'], matchLayoutAlignment, props, defaultProps),
  ];
};
