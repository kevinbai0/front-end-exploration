import {
  ThemeProperties,
  DNA,
  ThemeObject,
  ThemeExtension,
} from '../theme/types';

export type MatchFunction<T, K> = <S extends K & ThemeObject<ThemeExtension>>(
  props: S,
  prop: T
) => string[];

export const splitStyle = <T extends ThemeProperties<ThemeExtension>>(
  key: keyof DNA<ThemeExtension>,
  cssName: string[],
  method: (
    props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
    prop: any
  ) => string[],
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  defaultProps?: Partial<DNA<ThemeExtension>>
):
  | {
      property: string[];
      value: string[];
    }
  | undefined => {
  const value = props[key] ?? (defaultProps && defaultProps[key]);
  if (typeof value !== 'undefined')
    return {
      property: cssName,
      value: method(props, value as T),
    };
};

export const splitStyleFlexible = <T extends ThemeProperties<ThemeExtension>>(
  key: keyof DNA<ThemeExtension>,
  cssName: string[],
  method: (
    props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
    prop: any
  ) => string[],
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  defaultProps?: Partial<DNA<ThemeExtension>>
):
  | {
      property: string[];
      value: string[];
    }
  | undefined => {
  const value = props[key] ?? (defaultProps && defaultProps[key]);
  if (typeof value !== 'undefined')
    return {
      property: cssName,
      value: method(props, value as T),
    };
};
