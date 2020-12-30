import { BaseFactory } from '../../spec/factory';
import { MediaTransformer } from './types';

export const mediaTransformer = <
  Fact extends BaseFactory
>(): MediaTransformer<Fact> => (type, f) => ({
  start: (() => {
    switch (type) {
      case '_base':
        return '';
      default:
        return `media only screen and (min-width: ${f.media.breakpoints[type]}) {`;
    }
  })(),
  end: type === '_base' ? '' : '}',
});
