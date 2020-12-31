import { BaseFactory } from '../../../spec/factory';
import { ThemeMedia } from '../../../spec/media';
import { layoutTransform } from '../../value/layout';
import { createMergeTransform } from '../base';

export const layoutMergeTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createMergeTransform<Media, Fact>()(layoutTransform(), (key, value) => {
    return {
      display: value.display,
      alignItems: value.align,
      ...(value.justify ? { justifyContent: value.justify } : {}),
    };
  });
