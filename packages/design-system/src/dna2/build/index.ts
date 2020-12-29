import { BaseFactory } from '../spec/factory';
import { MediaProperty } from '../spec/media';
import { StringKey } from '../types';
import { DnaPropNames, ThemeDnaProps } from './types';

type Value<Fact extends BaseFactory, Key extends DnaPropNames<Fact>> = [
  StringKey<keyof Fact['media']['breakpoints']>,
  ThemeDnaProps<Fact>[Key] | StyleTree<Fact>
];

export type StyleTreeValueTuple<
  Fact extends BaseFactory,
  Key extends DnaPropNames<Fact>
> = [
  ['_base', ThemeDnaProps<Fact>[Key] | StyleTree<Fact>],
  ...Value<Fact, Key>[]
];

export type StyleTree<Fact extends BaseFactory> = {
  [Key in DnaPropNames<Fact>]?: StyleTreeValueTuple<Fact, Key>;
};

export const applyGenerator = <Fact extends BaseFactory>(
  mediaFn: <T>(val: T) => MediaProperty<T, Fact['media']>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  factory: Fact
) => {
  const applier = (props: ThemeDnaProps<Fact>): StyleTree<Fact> => {
    return Object.keys(props).reduce<StyleTree<Fact>>((acc, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (props as any)[key];

      if (typeof value === 'function') {
        const res = value(mediaFn)();
        acc[key as DnaPropNames<Fact>] = res;
      } else if (typeof value === 'object') {
        acc[key as DnaPropNames<Fact>] = [['_base', applier(value)]];
      } else {
        acc[key as DnaPropNames<Fact>] = [['_base', value]];
      }
      return acc;
    }, {});
  };

  return applier;
};
