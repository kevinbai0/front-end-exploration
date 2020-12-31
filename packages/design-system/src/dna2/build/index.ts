import { BaseFactory } from '../spec/factory';
import { MediaSelectorFn, ThemeMedia } from '../spec/media';
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

const generateStyleTree = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  props: ThemeDnaProps<Media, Fact>,
  mediaFn: MediaSelectorFn<Media>
): StyleTree<Media, Fact> => {
  return Object.keys(props).reduce<StyleTree<Media, Fact>>((acc, key) => {
    const value = props[key as DnaPropNames<Media, Fact>];

    if (typeof value === 'function') {
      const [first, ...rest] = value(mediaFn());
      acc[key as DnaPropNames<Media, Fact>] = [[first, '_base'], ...rest];
    } else if (typeof value === 'object') {
      acc[key as DnaPropNames<Media, Fact>] = [
        [
          generateStyleTree(value as ThemeDnaProps<Media, Fact>, mediaFn),
          '_base',
        ],
      ];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      acc[key as DnaPropNames<Media, Fact>] = [[value, '_base']] as any;
    }
    return acc;
  }, {});
};

export const applyGenerator = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  media: Media,
  factory: Fact
) => <Return>(
  transformer: (
    tree: StyleTree<Media, Fact>,
    mediaFn: MediaSelectorFn<Media>,
    factory: Fact
  ) => Return
) => {
  type Props = ThemeDnaProps<Media, Fact>;
  const applier = (props: Props) => {
    const tree = generateStyleTree(props, factory.mediaFn);
    return transformer(tree, factory.mediaFn, factory);
  };

  return applier;
};
