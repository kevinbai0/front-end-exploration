import { MediaTree } from '../../build/normalize';
import { DnaPropNames } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { StringKey } from '../../types';
import { mediaTransformer } from './media';
import { MediaTransformer, Transformer } from './types';

export const cssTransformer = <Fact extends BaseFactory>(
  fact: Fact,
  tree: MediaTree<Fact>,
  options?: {
    media?: MediaTransformer<Fact>;
  }
) => {
  type Prop = DnaPropNames<Fact>;
  const transformers: {
    [key in Prop]?: Transformer<Fact, key>;
  } = {};
  const mediaTransform = options?.media ?? mediaTransformer<Fact>();

  return Object.keys(tree).reduce((acc, key) => {
    const strings = mediaTransform(
      key as StringKey<keyof Fact['media']['breakpoints']>,
      fact
    );
    const middle = Object.keys(tree[key] ?? {}).reduce((acc, currKey) => {
      const newValue = tree[key]![currKey as Prop];
      const transformFn = transformers[currKey as Prop];
      if (!transformFn) {
        console.log(`Transformer for ${currKey} is not defined`);
      }

      const finalValue = transformFn
        ? (transformFn as any)(newValue, fact)
        : undefined;
      return acc + `${typeof finalValue === 'string' ? finalValue : ''}`;
    }, '');

    return acc + strings.start + middle + strings.end;
  }, '');
};
