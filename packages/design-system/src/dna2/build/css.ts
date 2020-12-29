import { BaseFactory } from '../spec/factory';
import { MediaIterable } from '../spec/media';
import { DnaPropNames, SelectorPropNames, ThemeDnaProps } from './types';
import { StyleTree, StyleTreeValueTuple } from './index';

type BasePropertyTree<Fact extends BaseFactory> = {
  [Key in DnaPropNames<Fact>]?: ThemeDnaProps<Fact>[Key];
};

type MediaTree<Fact extends BaseFactory> = {
  [Key in MediaIterable<Fact['media']> | '_base']?: BasePropertyTree<Fact>;
};

// helper to create tree with type BasePropertyTree
const createBasePropertyTree = <
  Fact extends BaseFactory,
  Key extends DnaPropNames<Fact>
>(
  key: Key,
  value: ThemeDnaProps<Fact>[Key]
): BasePropertyTree<Fact> => {
  const tree: BasePropertyTree<Fact> = {};
  tree[key] = value;
  return tree;
};

export const toCSS = <Fact extends BaseFactory>(
  tree: StyleTree<Fact>,
  media: Fact['media']
) => {
  type CurrStyleTree = typeof tree;
  const newTree: MediaTree<Fact> = {};

  iterateTree(tree, (key, properties) => {
    properties.forEach(([mediaType, value], index) => {
      // if we find a .$selector tag, then it goes with the first breakpoints tag before that
      if (media.selectors.find((selector) => selector === mediaType)) {
        // TODO: instead of prev index, look through all indices until found
        const newMediaType = index === 0 ? '_base' : properties[index - 1][0];
        const val = value as any;
        if (typeof value === 'string') {
          addToTree(
            newTree,
            newMediaType,
            mediaType as SelectorPropNames<Fact>,
            createBasePropertyTree(key, val)
          );
        } else {
          const newValue = toCSS(value as CurrStyleTree, media);
          Object.entries(newValue).forEach(([m, values]) => {
            addToTree(
              newTree,
              m as MediaIterable<Fact['media']>,
              key as any,
              values
            );
          });
        }
        return;
      }

      // decast value since there's too many union options
      const decasted = value as any;
      if (typeof value === 'string') {
        return addToTree(newTree, mediaType, key, decasted);
      }
      const newValue = toCSS(value as CurrStyleTree, media);
      Object.entries(newValue).forEach(([m, values]) => {
        addToTree(
          newTree,
          m as MediaIterable<Fact['media']>,
          key as any,
          values
        );
      });
    });
    return null;
  });

  return newTree;
};

function addToTree<Fact extends BaseFactory, Key extends DnaPropNames<Fact>>(
  tree: MediaTree<Fact>,
  media: MediaIterable<Fact['media']> | '_base',
  key: Key,
  value: ThemeDnaProps<Fact>[Key] | BasePropertyTree<Fact>
): void {
  const obj: BasePropertyTree<Fact> | undefined = tree[media];
  if (obj?.[key]) {
    obj[key] = { ...obj[key], ...(value as ThemeDnaProps<Fact>[Key]) };
  } else if (obj) {
    obj[key] = value as ThemeDnaProps<Fact>[Key];
  } else {
    tree[media] = createBasePropertyTree(
      key,
      value as ThemeDnaProps<Fact>[Key]
    );
  }
}

function iterateTree<Fact extends BaseFactory, T>(
  tree: StyleTree<Fact>,
  mapFn: (
    key: DnaPropNames<Fact>,
    values: StyleTreeValueTuple<Fact, typeof key>,
    index: number
  ) => T
) {
  return Object.entries(tree).map((pair, index) => {
    const key = pair[0] as DnaPropNames<Fact>;
    const values = pair[1] as StyleTreeValueTuple<Fact, typeof key>;
    return mapFn(key, values, index);
  });
}
