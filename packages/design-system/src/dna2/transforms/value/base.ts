import { DnaPropNames, ThemeDnaProps } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { MediaSelector, ThemeMedia } from '../../spec/media';

export const createValueTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() => <T extends DnaPropNames<Media, Fact>[], Return>(
  ...props: [
    ...T,
    (
      value: ThemeDnaProps<Media, Fact>[T[number]],
      mediaFn: <T>() => MediaSelector<T, Media>,
      factory: Fact
    ) => Return
  ]
) => {
  const keys = props.slice(0, props.length - 1) as T;
  const callback = props.slice(-1)[0] as (
    value: ThemeDnaProps<Media, Fact>[T[number]],
    mediaFn: <T>() => MediaSelector<T, Media>,
    factory: Fact
  ) => Return;

  const set = new Set(keys);
  return Array.from(set).reduce(
    (acc, prop) => ({
      ...acc,
      [prop as T[number]]: callback,
    }),
    {} as Record<
      T[number],
      (
        value: ThemeDnaProps<Media, Fact>[T[number]],
        mediaFn: <T>() => MediaSelector<T, Media>,
        factory: Fact
      ) => [Return, string][]
    >
  );
};
