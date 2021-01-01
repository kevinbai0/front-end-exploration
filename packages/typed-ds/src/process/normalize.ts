import { BaseFactory } from '../base/factory';
import { MediaIterable, ThemeMedia } from '../base/media';
import { StringKey } from '../types';
import { DnaPropNames, SelectorPropNames, ThemeDnaProps } from './types';
import { StyleTree, StyleTreeValueTuple } from './index';

type BasePropertyTree<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = {
  [Key in DnaPropNames<Media, Fact>]?: ThemeDnaProps<Media, Fact>[Key];
};

export type MediaTree<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = {
  [Key in MediaIterable<Fact['media']> | '_base']?: BasePropertyTree<
    Media,
    Fact
  >;
};

// helper to create tree with type BasePropertyTree
const createBasePropertyTree = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  Key extends DnaPropNames<Media, Fact>
>(
  key: Key,
  value: ThemeDnaProps<Media, Fact>[Key]
): BasePropertyTree<Media, Fact> => {
  const tree: BasePropertyTree<Media, Fact> = {};
  tree[key] = value;
  return tree;
};

export const normalizeTree = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  factory: Fact,
  tree: StyleTree<Media, Fact>
): MediaTree<Media, Fact> => {
  type CurrStyleTree = StyleTree<Media, Fact>;
  const newTree: MediaTree<Media, Fact> = {};

  iterateTree(tree, (key, properties) => {
    type Props = ThemeDnaProps<Media, Fact>;

    let lastBreakpointValue:
      | StringKey<keyof Fact['media']['breakpoints']>
      | '_base' = '_base';
    properties.forEach(([value, mediaType]) => {
      // if we find a .$selector tag, then it goes with the first breakpoints tag before that
      if (factory.media.selectors.find(selector => selector === mediaType)) {
        const newMediaType = lastBreakpointValue;
        if (typeof value === 'string') {
          addToTree(
            newTree,
            newMediaType,
            mediaType as SelectorPropNames<Media, Fact>,
            createBasePropertyTree(key, value as Props[typeof key])
          );
        } else if (Array.isArray(value!)) {
          const newStyleTree: StyleTree<Media, Fact> = {};
          newStyleTree[key] = value as any;
          const values = normalizeTree<Media, Fact>(factory, newStyleTree);
          Object.entries(values).forEach(([m, values]) => {
            mergeSelectorToTree(
              newTree,
              `$${mediaType}`,
              m as MediaIterable<Fact['media']>,
              values!
            );
          });
        }
      } else if (
        factory.media.selectors.find(selector => selector === key.slice(1))
      ) {
        const newValue = normalizeTree<Media, Fact>(
          factory,
          value as CurrStyleTree
        );
        Object.entries(newValue).forEach(([m, values]) => {
          addToTree(newTree, m as MediaIterable<Fact['media']>, key, values!);
        });
      } else {
        if (Array.isArray(value!)) {
          const newStyleTree: StyleTree<Media, Fact> = {};
          newStyleTree[key] = value as any;
          const values = normalizeTree<Media, Fact>(factory, newStyleTree);
          Object.entries(values).forEach(([m, values]) => {
            mergeToTree(newTree, m as MediaIterable<Fact['media']>, values!);
          });
          return;
        }
        addToTree(
          newTree,
          mediaType,
          key,
          value as NonNullable<Props[typeof key]>
        );
      }
      lastBreakpointValue = mediaType;
    });
  });

  return newTree;
};

function mergeSelectorToTree<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  tree: MediaTree<Media, Fact>,
  selector: Fact['media']['selectors'][number],
  media: MediaIterable<Fact['media']> | '_base',
  value: BasePropertyTree<Media, Fact>
) {
  const baseProperties = tree[media] as any;
  if (baseProperties[selector]) {
    baseProperties[selector] = {
      ...baseProperties,
      ...value,
    };
  } else {
    tree[media] = {
      ...tree[media],
      [selector]: value,
    };
  }
}

function mergeToTree<Media extends ThemeMedia, Fact extends BaseFactory<Media>>(
  tree: MediaTree<Media, Fact>,
  media: MediaIterable<Fact['media']> | '_base',
  value: BasePropertyTree<Media, Fact>
) {
  tree[media] = {
    ...tree[media],
    ...value,
  };
}

function addToTree<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  Key extends DnaPropNames<Media, Fact>
>(
  tree: MediaTree<Media, Fact>,
  media: MediaIterable<Fact['media']> | '_base',
  key: Key,
  value: ThemeDnaProps<Media, Fact>[Key] | BasePropertyTree<Media, Fact>
): void {
  const obj: BasePropertyTree<Media, Fact> | undefined = tree[media];
  if (obj?.[key]) {
    obj[key] = { ...obj[key], ...(value as ThemeDnaProps<Media, Fact>[Key]) };
  } else if (obj) {
    obj[key] = value as ThemeDnaProps<Media, Fact>[Key];
  } else {
    tree[media] = createBasePropertyTree(
      key,
      value as ThemeDnaProps<Media, Fact>[Key]
    );
  }
}

function iterateTree<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  T
>(
  tree: StyleTree<Media, Fact>,
  mapFn: (
    key: DnaPropNames<Media, Fact>,
    values: StyleTreeValueTuple<Media, Fact, typeof key>,
    index: number
  ) => T
) {
  return Object.entries(tree).map((pair, index) => {
    const key = pair[0] as DnaPropNames<Media, Fact>;
    const values = pair[1] as StyleTreeValueTuple<Media, Fact, typeof key>;
    return mapFn(key, values, index);
  });
}
