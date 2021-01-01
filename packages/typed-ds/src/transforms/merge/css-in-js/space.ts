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
    return getIdentifier(key).reduce<Record<string, string>>(
      (acc, id) => ({
        ...acc,
        [id]: value,
      }),
      {}
    );
  });

const getIdentifier = (key: SpacePropNames) => {
  switch (key) {
    case 'm':
      return [`margin`];
    case 'mb':
      return [`marginBottom`];
    case 'mt':
      return [`marginTop`];
    case 'ml':
      return [`marginLeft`];
    case 'mr':
      return [`marginRight`];
    case 'mx':
      return [`marginLeft`, `marginRight`];
    case 'my':
      return [`marginTop`, `marginBottom`];
    case 'p':
      return [`padding`];
    case 'pb':
      return [`paddingBottom`];
    case 'pt':
      return [`paddingTop`];
    case 'pl':
      return [`paddingLeft`];
    case 'pr':
      return [`paddingRight`];
    case 'px':
      return [`paddingLeft`, `paddingRight`];
    case 'py':
      return [`paddingTop`, `paddingBottom`];
  }
};
