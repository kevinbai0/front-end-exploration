import { MediaIterable, ThemeMedia } from '../spec/media';
import { StyleTree } from './index';

type MediaRecord<Media extends ThemeMedia> = {
  [key in MediaIterable<Media> | '_base']?: Record<
    string,
    unknown | MediaRecord<Media>[keyof MediaRecord<Media>]
  >;
};

export const toCSS = <Media extends ThemeMedia>(
  tree: StyleTree<Media>,
  media: Media
) => {
  const newTree: MediaRecord<Media> = {};

  Object.entries(tree).forEach(([key, properties]) => {
    properties?.forEach(([mediaType, value], index) => {
      if (media.selectors.find((selector) => selector === mediaType)) {
        const newMediaType = index === 0 ? '_base' : properties[index - 1][0];
        console.log(mediaType, index, newMediaType, value);
        if (typeof value === 'string') {
          addToTree(newTree, newMediaType, mediaType, {
            [key]: value,
          });
        } else {
          const newValue = toCSS(value, media);
          Object.entries(newValue).forEach(([m, values]) => {
            addToTree(newTree, m as MediaIterable<Media>, key, values);
          });
        }
        return;
      }
      if (typeof value === 'string') {
        return addToTree(newTree, mediaType, key, value);
      }
      const newValue = toCSS(value, media);
      Object.entries(newValue).forEach(([m, values]) => {
        addToTree(newTree, m as MediaIterable<Media>, key, values);
      });

      // merge key with the new media values
    });
  });
  console.log(JSON.stringify(tree, undefined, 2));
  console.log(JSON.stringify(newTree, undefined, 2));
  return newTree;
};

function addToTree<Media extends ThemeMedia>(
  tree: MediaRecord<Media>,
  media: MediaIterable<Media> | '_base',
  key: string,
  values: unknown | MediaRecord<Media>[keyof MediaRecord<Media>]
) {
  const obj = tree[media];
  if (obj?.[key]) {
    obj[key] = Array.isArray(obj[key])
      ? (obj[key] as unknown[]).concat(values)
      : obj[key];
  } else if (obj) {
    obj[key] = values;
  } else {
    tree[media] = {
      [key]: values,
    };
  }
}
