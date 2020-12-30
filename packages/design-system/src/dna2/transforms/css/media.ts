import { BaseFactory } from '../../spec/factory';
import { ThemeMedia } from '../../spec/media';
import { MediaTransformer } from './types';

export const mediaTransformer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(): MediaTransformer<Media, Fact> => (type, f) => ({
  start: (() => {
    switch (type) {
      case '_base':
        return '{\n';
      default:
        return `media only screen and (min-width: ${f.media.breakpoints[type]}) {\n`;
    }
  })(),
  end: type === '_base' ? '' : '}',
});
