import { BaseFactory } from '../base/factory';
import { ThemeMedia } from '../base/media';
import { StringKey } from '../types';
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
  initialValue: OutputType;
  merger: {
    [key in Exclude<
      DnaPropNames<Media, Fact>,
      SelectorPropNames<Media, Fact>
    >]: ValueAndMergeTransformPair<Media, Fact, any, any, ReturnType>;
  };
  joinSet: (types: ReturnType[]) => JoinType;
  handleSelector: (
    media: Media['selectors'][number],
    body: JoinType
  ) => ReturnType;
  handleMedia: (
    media: StringKey<keyof Media['breakpoints']> | '_base',
    breakpoints: Media['breakpoints'],
    body: JoinType
  ) => OutputType;
  joinAll: (acc: OutputType, set: OutputType) => OutputType;
};

export const serializer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  TransformReturnType,
  JoinType extends unknown,
  OutputType extends unknown
>(
  normalized: MediaTree<Media, Fact>,
  factory: Fact,
  transformer: DnaTransformer<
    Media,
    Fact,
    TransformReturnType,
    JoinType,
    OutputType
  >
) => {
  type MediaKey = keyof typeof normalized;

  const transformBodyToArray = (
    properties: MediaTree<Media, Fact>[MediaKey]
  ) => {
    type PropKey = keyof typeof properties;

    const res = Object.keys(properties ?? {}).reduce<TransformReturnType[]>(
      (newAcc, prop) => {
        const find = factory.media.selectors.find(val => val === prop.slice(1));
        if (find) {
          return [
            ...newAcc,
            transformer.handleSelector(
              find,
              transformBodyToArray(properties[prop])
            ),
          ];
        }
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
    return transformer.joinSet(res);
  };

  return Object.keys(normalized).reduce((acc, key) => {
    const properties = normalized[key as MediaKey];
    const finalValue = transformBodyToArray(properties);

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
