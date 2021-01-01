import { BaseFactory } from '../../../base/factory';
import { ThemeMedia } from '../../../base/media';
import { fontTransform } from '../../value/font';
import { createMergeTransform } from '../base';

export const fontMergeTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createMergeTransform<Media, Fact>()(fontTransform(), (key, value) => {
    return `${key}:${value.weight} ${value.sizeClass[0]}/${value.sizeClass[1]} ${value.family};letter-spacing:${value.sizeClass[2]};`;
  });
