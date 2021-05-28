import {
  DNA,
  ThemeObject,
  PrimitiveInjection,
  ThemeExtension,
} from '../theme/types';
import { PlatformType } from '../crossPlatform';
import { injectSpace } from './spacing';
import { injectStyle } from './styling';
import { injectFonts } from './fonts';
import { injectLayout } from './layout';
import { injectDimensions } from './dimensions';
import { injectPosition } from './position';

export type InjectProperties<T> = (
  props: T & ThemeObject<ThemeExtension>,
  defaultProps?: Partial<DNA<ThemeExtension>>,
  platform?: PlatformType
) => (
  | {
      property: string[];
      value: string[];
    }
  | undefined
)[];

const injectStyles = (
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  defaultProps: Partial<DNA<ThemeExtension>>,
  platform: PlatformType,
  ...methods: InjectProperties<PrimitiveInjection>[]
) => {
  return methods
    .map(method => {
      const styles = method(props, defaultProps, platform);
      // for each breakpoint, return the right styles
      const reduced = props.theme.breakpoints.map((_, i) => ({
        ...styles.reduce((accum, style) => {
          if (style?.value[i]) {
            if (typeof style.property === 'string')
              accum[style.property] = style.value[i];
            else
              style.property.map(
                property => (accum[property] = style.value[i])
              );
            if (style.property.length === 0) {
              if (style.value[i])
                style.value[i]
                  .trim()
                  .split(';')
                  .forEach(propGroup => {
                    if (!propGroup.length) return;
                    const split = propGroup.split(':').map(val => val.trim());
                    if (split.length !== 2)
                      throw new Error(
                        'Invalid CSS for value of: ' + style.value[i]
                      );
                    accum[split[0]] = split[1];
                  });
            }
          }
          return accum;
        }, {} as { [key: string]: string }),
      }));
      return reduced
        .map((style, i) => {
          const entries = Object.entries(style);
          if (!entries.length) return '';
          if (i === 0) {
            return ` ${entries
              .map(entry => `${entry[0]}: ${entry[1]}; `)
              .join('')}`;
          }
          // no media queries on react native
          if (platform === 'react-native') {
            return '';
          }
          return `@media only screen and (min-width: ${
            props.theme.breakpoints[i]
          }px) {
            ${entries.map(entry => `${entry[0]}: ${entry[1]}; `).join('')}
          };`;
        })
        .join('')
        .replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    })
    .join('');
};

export const injectDNA = (
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  defaultProps?: Partial<DNA<ThemeExtension>>
) => {
  const dna = `
        ${injectStyles(
          props,
          defaultProps || {},
          'react',
          injectSpace,
          injectStyle,
          injectFonts,
          injectLayout,
          injectDimensions,
          injectPosition
        )}
    `.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
  return dna;
};

export const injectDNAProps = (defaultProps?: Partial<DNA<ThemeExtension>>) => (
  props: DNA & ThemeObject<ThemeExtension>
) => {
  return injectDNA(props, defaultProps);
};
