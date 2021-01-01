import { BaseFactory } from '../../../base/factory';
import { ThemeMedia } from '../../../base/media';
import { layoutTransform } from '../../value/layout';
import { createMergeTransform } from '../base';

export const layoutMergeTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createMergeTransform<Media, Fact>()(layoutTransform(), (key, value) => {
    return `display:${value.display};align-items:${value.align};${
      value.justify ? `justify:${value.justify};` : ''
    }`;
  });
