import { DnaTransformer } from '../../../build/serializer';
import { BaseFactory } from '../../../spec/factory';
import { ThemeMedia } from '../../../spec/media';
import { layoutMergeTransform } from './layout';
import { colorMergeTransform } from './color';
import { fontMergeTransform } from './fonts';
import { spaceMergeTransform } from './space';

export const createCSSTransformer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(): DnaTransformer<Media, Fact, string, string, string> => {
  const fonts = fontMergeTransform<Media, Fact>();
  const colors = colorMergeTransform<Media, Fact>();
  const space = spaceMergeTransform<Media, Fact>();
  const layout = layoutMergeTransform<Media, Fact>();

  return {
    initialValue: '',
    merger: {
      ...fonts,
      ...colors,
      ...space,
      ...layout,
    },
    joinSet: types => {
      return types.join('');
    },
    handleMedia: (media, breakpoints, joined) => {
      if (media === '_base') {
        return joined;
      }
      return `@media only screen and (min-width: ${breakpoints[media]}) {${joined}}`;
    },
    handleSelector: (selector, body) => {
      return `:${selector} {${body}}`;
    },
    joinAll: (curr, next) => `${curr}${next}`,
  };
};
