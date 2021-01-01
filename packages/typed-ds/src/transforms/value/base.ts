import { DnaPropNames, ThemeDnaProps } from '../../process/types';
import { BaseFactory } from '../../base/factory';
import { MediaSelectorFn, ThemeMedia } from '../../base/media';
import { StringKey } from '../../types';

export type ValueTransformFn<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  Keys extends DnaPropNames<Media, Fact>,
  Return
> = (
  value: ThemeDnaProps<Media, Fact>[Keys],
  mediaType: '_base' | StringKey<keyof Media['breakpoints']>,
  mediaFn: MediaSelectorFn<Media>,
  factory: Fact
) => [Return, string][] | Return;

export type ValueTransformSet<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  Keys extends DnaPropNames<Media, Fact>,
  Return
> = Record<Keys, ValueTransformFn<Media, Fact, Keys, Return>>;

export const createValueTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() => <Keys extends DnaPropNames<Media, Fact>, Return>(
  keys: Keys[],
  callback: ValueTransformFn<Media, Fact, Keys, Return>
): ValueTransformSet<Media, Fact, Keys, Return> => {
  //const keys = props.slice(0, props.length - 1) as T;
  // const callback = props.slice(-1)[0];

  const set = new Set(keys);
  return Array.from(set).reduce(
    (acc, prop) => ({
      ...acc,
      [prop as Keys]: callback,
    }),
    {} as Record<Keys, ValueTransformFn<Media, Fact, Keys, Return>>
  );
};
