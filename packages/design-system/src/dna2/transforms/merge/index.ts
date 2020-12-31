import { StyleTree, StyleTreeValueTuple } from '../../build';
import { DnaPropNames, SelectorPropNames } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { MediaSelector, ThemeMedia } from '../../spec/media';
import { ValueAndMergeTransformPair } from '../merge/base';

const selectorTransform = <T extends string>(value: T) => `$${value}` as const;

export const createTransforms = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  mediaFn: <T>() => MediaSelector<T, Media>,
  factory: Fact,
  transforms: Record<
    Exclude<DnaPropNames<Media, Fact>, SelectorPropNames<Media, Fact>>,
    // both key and return can be anything
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ValueAndMergeTransformPair<Media, Fact, any, any, unknown>
  >
) => {
  type Key = Exclude<
    keyof StyleTree<Media, Fact>,
    SelectorPropNames<Media, Fact>
  >;
  type Tuple = StyleTreeValueTuple<Media, Fact, DnaPropNames<Media, Fact>>;
  const selectorKeys = new Set(factory.media.selectors.map(selectorTransform));

  // map tuple value with transforms
  const mapTuple = (tree: StyleTree<Media, Fact>, key: Key) => {
    const values = tree[key] as Tuple;
    if (!transforms[key as Key]) {
      throw new Error(`No transform create for ${key}`);
    }

    const others = values.map(([value, mediaType]) => {
      return [
        // cast to any since too many possible values of value
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transforms[key as Key].value(value as any, mediaType, mediaFn, factory),
        mediaType,
      ];
    });
    return others;
  };

  const apply = (tree: StyleTree<Media, Fact>): StyleTree<Media, Fact> => {
    const final = Object.keys(tree).reduce<StyleTree<Media, Fact>>(
      (acc, key) => {
        if (selectorKeys.has(key as `$${string}`)) {
          //
          return {
            ...acc,
            [key]: (tree[key as Key] as Tuple).map(([value, mediaType]) => [
              apply(value as StyleTree<Media, Fact>),
              mediaType,
            ]),
          };
        }

        if (Array.isArray(tree[key as Key])) {
          const others = mapTuple(tree, key as Key);
          return { ...acc, [key]: others };
        }
        throw new Error(
          `Unknown value encountered\n ${JSON.stringify(
            tree[key as Key]
          )} for key ${key}`
        );
      },
      {} as StyleTree<Media, Fact>
    );
    return final;
  };
  return apply;
};
