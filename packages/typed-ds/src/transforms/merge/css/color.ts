import { BaseFactory } from '../../../base/factory';
import { ThemeMedia } from '../../../base/media';
import { colorTransform } from '../../value/color';
import { createMergeTransform } from '../base';

export const colorMergeTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createMergeTransform<Media, Fact>()(colorTransform(), (key, value) => {
    return `${key === 'fg' ? 'color' : 'background-color'}: ${value};`;
  });
