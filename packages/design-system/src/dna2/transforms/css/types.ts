import { BaseFactory } from '../../spec/factory';
import { ThemeMedia } from '../../spec/media';
import { StringKey } from '../../types';

export type Transformer<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>,
  T
> = (
  type: T,
  fact: Fact
) => {
  start: string;
  end: string;
};

export type MediaTransformer<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = (
  type: StringKey<keyof Fact['media']['breakpoints']> | '_base',
  fact: Fact
) => {
  start: string;
  end: string;
};
