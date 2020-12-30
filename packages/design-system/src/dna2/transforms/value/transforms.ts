import { BaseFactory } from '../../spec/factory';
import { ThemeMedia } from '../../spec/media';
import { createValueTransform } from './base';
import { fontTransform } from './font';

const colorTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createValueTransform<Media, Fact>()('fg', 'bg', (value, mediaFn, factory) => {
    if (typeof value === 'string') {
      const split = value.split('.');
      if (split.length === 1) {
        return factory.colors[value as string];
      }

      const [arr, index] = [factory.colors[split[0]], Number(split[1])];
      return arr[index];
    }
  });

const spaceTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createValueTransform<Media, Fact>()(
    'm',
    'mx',
    'my',
    'ml',
    'mr',
    'mt',
    'mb',
    'p',
    'pl',
    'pt',
    'pr',
    'pb',
    'px',
    'py',
    (value, mediaFn, factory) => {
      const baseValue = parseInt(factory.spacing.baseMultiplier);
      const multiplier =
        typeof value === 'string' ? parseInt(value as string) : 1;
      const ext = factory.spacing.baseMultiplier.replace(`${baseValue}`, '');
      const newValue = `${baseValue * multiplier}${ext}`;
      return newValue;
    }
  );

export const createTransforms = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() => {
  return {
    ...spaceTransform<Media, Fact>(),
    ...fontTransform<Media, Fact>(),
    ...colorTransform<Media, Fact>(),
  };
};
