import { BaseFactory } from '../../spec/factory';
import { FontSizeClass, FontWeightPrimitive, IFont } from '../../spec/fonts';
import { MediaIterable, MediaSelector, ThemeMedia } from '../../spec/media';
import { createValueTransform } from './base';

const mapFontProp = <Media extends ThemeMedia, T>(
  prop: T | (readonly [T, string])[],
  isLiteral: boolean
): { [key in '_base' | keyof Media['breakpoints']]?: T } => {
  return isLiteral
    ? {
        _base: prop as T,
      }
    : (prop as [T, string][]).reduce((acc, pair) => {
        return { ...acc, [pair[1]]: pair[0] };
      }, {} as Record<'_base' | keyof Media['breakpoints'], T>);
};

export const fontTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createValueTransform<Media, Fact>()('font', (value, media, factory) => {
    if (typeof value === 'string') {
      const font = factory.fonts.fonts[value as string];

      const family = transformFamily(media, factory, font);
      const sizeClass = transformSizeClasses(media, factory, font);
      const weight = transformWeight(media, factory, font);
      const familyReduce = mapFontProp<Media, string>(
        family,
        typeof family === 'string'
      );
      const sizeClassReduce = mapFontProp<Media, FontSizeClass>(
        sizeClass,
        !Array.isArray(sizeClass[0])
      );
      const weightReduce = mapFontProp<Media, FontWeightPrimitive>(
        weight,
        typeof weight === 'number'
      );

      type Font = {
        family: string;
        sizeClass: FontSizeClass;
        weight: FontWeightPrimitive;
      };
      const families = factory.rank.reduce(
        (acc, rank) => {
          if (
            !familyReduce[rank] &&
            !weightReduce[rank] &&
            !sizeClassReduce[rank]
          ) {
            return acc;
          }
          const next = {
            family: familyReduce[rank] ?? acc.prev.family,
            weight: weightReduce[rank] ?? acc.prev.weight,
            sizeClass: sizeClassReduce[rank] ?? acc.prev.sizeClass,
          };
          return {
            prev: next,
            acc: acc.acc.concat([[next, rank]]),
          };
        },
        {
          prev: {} as Font,
          acc: [],
        } as {
          prev: Font;
          acc: [Font, '_base' | keyof Media['breakpoints']][];
        }
      );
      if (families.acc.length === 1) {
        return families.acc[0][0];
      }
      return families.acc;
    }
  });

function normalize<T>([first, ...rest]: [
  T,
  ...[T, MediaIterable<ThemeMedia>][]
]): [T, MediaIterable<ThemeMedia> | '_base'][] {
  return [[first, '_base'], ...rest];
}

const transformFamily = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  media: <T>() => MediaSelector<T, Media>,
  factory: Fact,
  font: IFont<Media, Fact['fonts']['base']>
) => {
  if (typeof font.family === 'string') {
    return factory.fonts.base.families[font.family];
  }
  const values = normalize(font.family(media()));
  return values.map(
    val => [factory.fonts.base.families[val[0]], val[1]] as const
  );
};

const transformSizeClasses = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  media: <T>() => MediaSelector<T, Media>,
  factory: Fact,
  font: IFont<Media, Fact['fonts']['base']>
) => {
  if (typeof font.sizeClass === 'string') {
    return factory.fonts.base.sizeClasses[font.sizeClass];
  }
  const values = normalize(font.sizeClass(media()));
  return values.map(
    val => [factory.fonts.base.sizeClasses[val[0]], val[1]] as const
  );
};

const transformWeight = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  media: <T>() => MediaSelector<T, Media>,
  factory: Fact,
  font: IFont<Media, Fact['fonts']['base']>
) => {
  if (typeof font.weight === 'string') {
    return factory.fonts.base.weights[font.weight];
  }
  const values = normalize(font.weight(media()));
  return values.map(
    val => [factory.fonts.base.weights[val[0]], val[1]] as const
  );
};
