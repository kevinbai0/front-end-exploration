import { BaseFactory } from '../../spec/factory';
import { ThemeMedia } from '../../spec/media';
import { createValueTransform } from './base';

export const spaceTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createValueTransform<Media, Fact>()(
    [
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
    ],
    (value, mediaFn, factory) => {
      const baseValue = parseInt(factory.spacing.baseMultiplier);
      const multiplier =
        typeof value === 'string' ? parseInt(value as string) : 1;
      const ext = factory.spacing.baseMultiplier.replace(`${baseValue}`, '');
      const newValue = `${baseValue * multiplier}${ext}`;
      return [[newValue, '_base']];
    }
  );
