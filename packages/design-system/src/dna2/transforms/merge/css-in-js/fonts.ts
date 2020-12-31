import { BaseFactory } from '../../../spec/factory';
import { ThemeMedia } from '../../../spec/media';
import { fontTransform } from '../../value/font';
import { createMergeTransform } from '../base';

export const fontMergeTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createMergeTransform<Media, Fact>()(fontTransform(), (key, value) => {
    return {
      fontFamily: value.family,
      fontWeight: value.weight,
      fontSize: value.sizeClass[0],
      lineHeight: value.sizeClass[1],
      letterSpacing: value.sizeClass[2],
    };
  });
