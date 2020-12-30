import { MediaTree } from '../../build/normalize';
import { DnaPropNames } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { MediaSelector, ThemeMedia } from '../../spec/media';
import { StringKey } from '../../types';
import { colorTransformer } from './color';
import { fontTransformer } from './font';
import { mediaTransformer } from './media';
import { spaceTransformers } from './space';
import { MediaTransformer, Transformer } from './types';

export const cssTransformer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  mediaFn: <T>() => MediaSelector<T, Media>,
  fact: Fact,
  tree: MediaTree<Media, Fact>,
  options?: {
    media?: MediaTransformer<Media, Fact>;
  }
) => {
  type Prop = DnaPropNames<Media, Fact>;
  const transformers: {
    [key in Prop]?: Transformer<Media, Fact, any>;
  } = {
    bg: colorTransformer('bg', mediaFn),
    fg: colorTransformer('fg', mediaFn),
    ...spaceTransformers(mediaFn),
    font: fontTransformer('font', mediaFn),
  };
  const mediaTransform = options?.media ?? mediaTransformer<Media, Fact>();

  return Object.keys(tree).reduce((acc, key) => {
    const strings = mediaTransform(
      key as StringKey<keyof Fact['media']['breakpoints']>,
      fact
    );
    const middle = Object.keys(tree[key] ?? {}).reduce((acc, currKey) => {
      const newValue = tree[key]![currKey as Prop];
      const transformFn = transformers[currKey as Prop];
      if (!transformFn) {
        console.log(`Transformer for ${currKey} is not defined`);
      }
      const finalValue = transformFn
        ? (transformFn as Transformer<Media, Fact, any>)(newValue, fact)
        : undefined;

      if (finalValue) {
        return acc + `${finalValue.start}${finalValue.end}\n`;
      }
      return acc;
    }, '');

    return acc + strings.start + middle + strings.end + '\n';
  }, '');
};
