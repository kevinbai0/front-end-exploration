import { ThemeColors } from '../spec/colors';
import { IFactory } from '../spec/factory';
import { ThemeFont, ThemeFontAttributes } from '../spec/fonts';
import { ThemeMedia, MediaProperty, MediaIterable } from '../spec/media';
import { ThemeSpacing } from '../spec/spacing';
import { DnaPropNames, DNAProps } from './types';

type Value<Media extends ThemeMedia> = [
  MediaIterable<Media>,
  string | StyleTree<Media>
];

export type StyleTree<Media extends ThemeMedia> = {
  [key in DnaPropNames<Media>]?: [
    ['_base', string | StyleTree<Media>],
    ...Value<Media>[]
  ];
};

export const applyGenerator = <
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes<Media>,
  Fonts extends ThemeFont<Media, FontAttributes>,
  Space extends ThemeSpacing,
  Fact extends IFactory<Media, Colors, FontAttributes, Fonts, Space>
>(
  mediaFn: <T>(val: T) => MediaProperty<T, Media>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  factory: Fact
) => {
  const applier = (
    props: DNAProps<Media, Colors, FontAttributes, Fonts, Space, Fact>
  ): StyleTree<Media> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blindProps = props as any;
    return Object.keys(blindProps).reduce<StyleTree<Media>>((acc, key) => {
      const value = blindProps[key];
      if (typeof value === 'function') {
        const res = value(mediaFn)();
        (acc as any)[key] = res;
      } else if (typeof value === 'object') {
        (acc as any)[key] = [['_base', applier(value)]];
      } else {
        (acc as any)[key] = [['_base', value]];
      }
      return acc;
    }, {});
  };

  return applier;
};
