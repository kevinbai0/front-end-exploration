import { StyleTree, StyleTreeValueTuple } from '../../build';
import { DnaPropNames, SelectorPropNames } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { MediaSelector, ThemeMedia } from '../../spec/media';
import { ValueAndMergeTransformPair } from '../merge/base';

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
  return (tree: StyleTree<Media, Fact>) => {
    type Tuple = StyleTreeValueTuple<Media, Fact, DnaPropNames<Media, Fact>>;
    const final = Object.keys(tree).reduce<StyleTree<Media, Fact>>(
      (acc, key) => {
        type Key = Exclude<keyof typeof tree, SelectorPropNames<Media, Fact>>;
        if (Array.isArray(tree[key as Key])) {
          const values = tree[key as Key] as Tuple;
          if (!transforms[key as Key]) {
            return acc;
          }

          const others = values.map(([value, mediaType]) => {
            return [
              // cast to any since too many possible values of value
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              transforms[key as Key].value(value as any, mediaFn, factory),
              mediaType,
            ];
          });
          return { ...acc, [key]: others };
        }
        return acc;
      },
      {} as StyleTree<Media, Fact>
    );
    return final;
  };
};
