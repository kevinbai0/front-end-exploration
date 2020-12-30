import { BaseFactory } from '../spec/factory';
import { MediaSelector, ThemeMedia } from '../spec/media';
import { StringKey } from '../types';
import { DnaPropNames, ThemeDnaProps } from './types';

type Value<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  Key extends DnaPropNames<Media, Fact>
> = [
  ThemeDnaProps<Media, Fact>[Key] | StyleTree<Media, Fact>,
  StringKey<keyof Fact['media']['breakpoints']> | '_base'
];

export type StyleTreeValueTuple<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  Key extends DnaPropNames<Media, Fact>
> = Value<Media, Fact, Key>[];

export type StyleTree<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = {
  [Key in DnaPropNames<Media, Fact>]?: StyleTreeValueTuple<Media, Fact, Key>;
};

export const applyGenerator = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  mediaFn: <T>() => MediaSelector<T, Media>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  factory: Fact
) => {
  const applier = (
    props: ThemeDnaProps<Media, Fact>
  ): StyleTree<Media, Fact> => {
    return Object.keys(props).reduce<StyleTree<Media, Fact>>((acc, key) => {
      const value = props[key as DnaPropNames<Media, Fact>];

      if (typeof value === 'function') {
        const [first, ...rest] = value(mediaFn());
        acc[key as DnaPropNames<Media, Fact>] = [[first, '_base'], ...rest];
      } else if (typeof value === 'object') {
        acc[key as DnaPropNames<Media, Fact>] = [
          [applier(value as ThemeDnaProps<Media, Fact>), '_base'],
        ];
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acc[key as DnaPropNames<Media, Fact>] = [[value, '_base']] as any;
      }
      return acc;
    }, {});
  };

  return applier;
};
