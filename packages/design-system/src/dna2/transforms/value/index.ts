import { StyleTree } from '../../build';
import { MediaTree } from '../../build/normalize';
import { SelectorPropNames } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { MediaSelector, ThemeMedia } from '../../spec/media';
import { createTransforms } from './transforms';

export const createValueTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() => {
  const transformFns = createTransforms<Media, Fact>();
  return (
    mediaFn: <T>() => MediaSelector<T, Media>,
    factory: Fact,
    tree: StyleTree<Media, Fact>
  ) => {
    const final = Object.keys(tree).reduce<StyleTree<Media, Fact>>(
      (acc, key) => {
        type Key = Exclude<keyof typeof tree, SelectorPropNames<Media, Fact>>;
        if (Array.isArray(tree[key as Key])) {
          const values = tree[key as Key];
          if (!transformFns[key as Key]) {
            return acc;
          }
          const others = values?.map((pair: any) => {
            return [
              transformFns[key as Key](pair[0], mediaFn, factory),
              pair[1],
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
