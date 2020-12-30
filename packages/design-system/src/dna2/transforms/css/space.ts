import { SpacePropNames } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { MediaSelector, ThemeMedia } from '../../spec/media';
import { SpaceKeys } from '../../spec/spacing';
import { Transformer } from './types';

const spaceKeys: { [key in SpacePropNames]: 0 } = {
  m: 0,
  mb: 0,
  ml: 0,
  mr: 0,
  mt: 0,
  mx: 0,
  my: 0,
  p: 0,
  pb: 0,
  pt: 0,
  pl: 0,
  pr: 0,
  px: 0,
  py: 0,
};

export const spaceTransformers = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  mediaFn: <T>() => MediaSelector<T, Media>
) => {
  return Object.keys(spaceKeys).reduce((acc, key) => {
    return {
      ...acc,
      [key as SpacePropNames]: spaceTransformer(key as SpacePropNames),
    };
  }, {} as Record<SpacePropNames, Transformer<Media, Fact, SpaceKeys<Fact['spacing']>>>);
};

const spaceTransformer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  key: SpacePropNames
): Transformer<Media, Fact, SpaceKeys<Fact['spacing']>> => (value, fact) => {
  return {
    start: getStart(key, value, fact as any),
    end: ';',
  };
};

const getStart = <Media extends ThemeMedia, Fact extends BaseFactory<Media>>(
  key: SpacePropNames,
  value: SpaceKeys<Fact['spacing']>,
  fact: Fact
) => {
  const baseValue = parseInt(fact.spacing.baseMultiplier);
  const multiplier = parseInt(value);
  const ext = fact.spacing.baseMultiplier.replace(`${baseValue}`, '');
  const newValue = `${baseValue * multiplier}${ext}`;
  switch (key) {
    case 'm':
      return `margin: ${newValue}`;
    case 'mb':
      return `margin-bottom: ${newValue}`;
    case 'mt':
      return `margin-top: ${newValue}`;
    case 'ml':
      return `margin-left: ${newValue}`;
    case 'mr':
      return `margin-right: ${newValue}`;
    case 'mx':
      return `margin-left: ${newValue};margin-right: ${newValue}`;
    case 'my':
      return `margin-top: ${newValue};margin-bottom: ${newValue}`;
    case 'p':
      return `padding: ${newValue}`;
    case 'pb':
      return `padding-bottom: ${newValue}`;
    case 'pt':
      return `padding-top: ${newValue}`;
    case 'pl':
      return `padding-left: ${newValue}`;
    case 'pr':
      return `padding-right: ${newValue}`;
    case 'px':
      return `padding-left: ${newValue};padding-right: ${newValue}`;
    case 'py':
      return `padding-top: ${newValue};padding-bottom: ${newValue}`;
  }
};
