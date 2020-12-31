import { BaseFactory } from '../spec/factory';
import { ThemeMedia } from '../spec/media';
import { StringKey } from '../types';
import { DnaTransformer } from '../transforms/merge/css';
import { ValueAndMergeTransformPair } from '../transforms/merge/base';
import { MediaTree } from './normalize';
import { DnaPropNames, SelectorPropNames } from './types';

export type DnaTransformer<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  ReturnType,
  JoinType,
  OutputType
> = {
  initialValue: FinalType;
  merger: {
    [key in Exclude<
      DnaPropNames<Media, Fact>,
      SelectorPropNames<Media, Fact>
    >]: ValueAndMergeTransformPair<Media, Fact, any, any, ReturnType>;
  };
  joinSet: (types: ReturnType[]) => JoinType;
  handleMedia: (
    media: StringKey<keyof Media['breakpoints']> | '_base',
    breakpoints: Media['breakpoints'],
    body: JoinType
  ) => OutputType;
  handleSelector: (media: Media['selectors'][number]) => OutputType;
  joinAll: (acc: OutputType, set: OutputType) => OutputType;
};

export const serializer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  FinalReturnType,
  JoinType extends unknown,
  OutputType extends unknown
>(
  normalized: MediaTree<Media, Fact>,
  factory: Fact,
  transformer: DnaTransformer<
    Media,
    Fact,
    FinalReturnType,
    JoinType,
    OutputType
  >
) => {
  type MediaKey = keyof typeof normalized;
  return Object.keys(normalized).reduce((acc, key) => {
    const properties = normalized[key as MediaKey];
    type PropKey = keyof typeof properties;
    const arrayValues = Object.keys(properties ?? {}).reduce<FinalReturnType[]>(
      (newAcc, prop) => {
        return [
          ...newAcc,
          transformer.merger[prop as keyof typeof transformer.merger].merge(
            prop,
            properties![prop as PropKey]
          ),
        ];
      },
      []
    );

    const finalValue = transformer.joinSet(arrayValues);

    if (factory.media.breakpoints[key] || key === '_base') {
      const nextTreatment = transformer.handleMedia(
        key as '_base' | StringKey<keyof Media['breakpoints']>,
        factory.media.breakpoints,
        finalValue
      );

      return transformer.joinAll(acc, nextTreatment);
    }

    const nextTreatment = transformer.handleSelector(
      key as Media['selectors'][number],
      factory.media.breakpoints,
      finalValue
    );

    return transformer.joinAll(acc, nextTreatment);
  }, transformer.initialValue);
};
