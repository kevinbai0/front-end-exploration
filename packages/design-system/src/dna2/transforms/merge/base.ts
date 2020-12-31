import { DnaPropNames } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { ThemeMedia } from '../../spec/media';
import { ValueTransformFn, ValueTransformSet } from '../value/base';

export type ValueAndMergeTransformSet<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  Keys extends DnaPropNames<Media, Fact>,
  Return,
  NewReturnType
> = {
  [Key in Keys]: ValueAndMergeTransformPair<
    Media,
    Fact,
    Keys,
    Return,
    NewReturnType
  >;
};

export type ValueAndMergeTransformPair<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  Keys extends DnaPropNames<Media, Fact>,
  Return,
  NewReturnType
> = {
  value: ValueTransformFn<Media, Fact, Keys, Return>;
  merge: (key: Keys, value: Return) => NewReturnType;
};

export const createMergeTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() => <Keys extends DnaPropNames<Media, Fact>, Return, NewReturnType>(
  valueTransform: ValueTransformSet<Media, Fact, Keys, Return>,
  mergeTransform: (key: Keys, value: Return) => NewReturnType
): ValueAndMergeTransformSet<Media, Fact, Keys, Return, NewReturnType> => {
  type ValueTransformRecord = typeof valueTransform;
  type Key = keyof ValueTransformRecord;
  return Object.keys(valueTransform).reduce(
    (acc, key) => {
      return {
        ...acc,
        [key as Key]: {
          value: valueTransform[key as Key],
          merge: mergeTransform,
        },
      };
    },
    {} as {
      [key in Key]: ValueAndMergeTransformPair<
        Media,
        Fact,
        Keys,
        Return,
        NewReturnType
      >;
    }
  );
};
