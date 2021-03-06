import { Color } from '../../base/colors';
import { BaseFactory } from '../../base/factory';
import { ThemeMedia } from '../../base/media';
import { createValueTransform } from './base';

export const colorTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createValueTransform<Media, Fact>()(
    ['fg', 'bg'],
    (value, mediaType, mediaFn, factory) => {
      if (typeof value === 'string') {
        const split = value.split('.');
        if (split.length === 1) {
          return factory.colors[value as string] as Color<never>;
        }

        const [arr, index] = [factory.colors[split[0]], Number(split[1])];
        return arr[index];
      }
      return [];
    }
  );
