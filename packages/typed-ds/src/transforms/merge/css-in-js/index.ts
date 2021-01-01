import { DnaTransformer } from '../../../process/serializer';
import { BaseFactory } from '../../../base/factory';
import { ThemeMedia } from '../../../base/media';
import { colorMergeTransform } from './color';
import { fontMergeTransform } from './fonts';
import { layoutMergeTransform } from './layout';
import { spaceMergeTransform } from './space';

export const createCssInJsTransformer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(): DnaTransformer<
  Media,
  Fact,
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>
> => {
  const fonts = fontMergeTransform<Media, Fact>();
  const colors = colorMergeTransform<Media, Fact>();
  const space = spaceMergeTransform<Media, Fact>();
  const layout = layoutMergeTransform<Media, Fact>();

  return {
    initialValue: {},
    merger: {
      ...fonts,
      ...colors,
      ...space,
      ...layout,
    },
    joinSet: types => {
      return types.reduce((acc, curr) => ({
        ...acc,
        ...curr,
      }));
    },
    handleMedia: (media, breakpoints, joined) => {
      if (media === '_base') {
        return joined;
      }
      return {
        [`@media only screen and (min-width: ${breakpoints[media]})`]: joined,
      };
    },
    handleSelector: (selector, body) => {
      return {
        [`:${selector}`]: body,
      };
    },
    joinAll: (curr, next) => ({
      ...curr,
      ...next,
    }),
  };
};
