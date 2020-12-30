import { BaseFactory } from '../spec/factory';
import { MediaSelector } from '../spec/media';
import { StringKey } from '../types';
import { DnaPropNames, ThemeDnaProps } from './types';

type Value<Fact extends BaseFactory, Key extends DnaPropNames<Fact>> = [
  ThemeDnaProps<Fact>[Key] | StyleTree<Fact>,
  StringKey<keyof Fact['media']['breakpoints']>
];

export type StyleTreeValueTuple<
  Fact extends BaseFactory,
  Key extends DnaPropNames<Fact>
> = [ThemeDnaProps<Fact>[Key] | StyleTree<Fact>, ...Value<Fact, Key>[]];

export type StyleTree<Fact extends BaseFactory> = {
  [Key in DnaPropNames<Fact>]?: StyleTreeValueTuple<Fact, Key>;
};

export const applyGenerator = <Fact extends BaseFactory>(
  mediaFn: <T>() => MediaSelector<T, Fact['media']>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  factory: Fact
) => {
  const applier = (props: ThemeDnaProps<Fact>): StyleTree<Fact> => {
    return Object.keys(props).reduce<StyleTree<Fact>>((acc, key) => {
      const value = props[key as DnaPropNames<Fact>];

      if (typeof value === 'function') {
        const res = value(mediaFn());
        acc[key as DnaPropNames<Fact>] = res;
      } else if (typeof value === 'object') {
        acc[key as DnaPropNames<Fact>] = [
          applier(value as ThemeDnaProps<Fact>),
        ];
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acc[key as DnaPropNames<Fact>] = [value] as any;
      }
      return acc;
    }, {});
  };

  return applier;
};
