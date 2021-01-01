import { SpacePropNames } from '../../../process/types';
import { BaseFactory } from '../../../base/factory';
import { ThemeMedia } from '../../../base/media';
import { spaceTransform } from '../../value/space';
import { createMergeTransform } from '../base';

export const spaceMergeTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createMergeTransform<Media, Fact>()(spaceTransform(), (key, value) => {
    return `${getIdentifier(key)}: ${value};`;
  });

const getIdentifier = (key: SpacePropNames) => {
  switch (key) {
    case 'm':
      return `margin`;
    case 'mb':
      return `margin-bottom`;
    case 'mt':
      return `margin-top`;
    case 'ml':
      return `margin-left`;
    case 'mr':
      return `margin-right`;
    case 'mx':
      return `margin-left;margin-right`;
    case 'my':
      return `margin-top;margin-bottom`;
    case 'p':
      return `padding`;
    case 'pb':
      return `padding-bottom`;
    case 'pt':
      return `padding-top`;
    case 'pl':
      return `padding-left`;
    case 'pr':
      return `padding-right`;
    case 'px':
      return `padding-left;padding-right`;
    case 'py':
      return `padding-top;padding-bottom`;
  }
};
