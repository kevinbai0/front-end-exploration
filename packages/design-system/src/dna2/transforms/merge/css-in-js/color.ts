import { BaseFactory } from '../../../spec/factory';
import { ThemeMedia } from '../../../spec/media';
import { colorTransform } from '../../value/color';
import { createMergeTransform } from '../base';

export const colorMergeTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createMergeTransform<Media, Fact>()(colorTransform(), (key, value) => {
    return {
      [key === 'fg' ? 'color' : 'backgroundColor']: value,
    };
  });
