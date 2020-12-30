import { FontPropNames } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { FontKeys } from '../../spec/fonts';
import { MediaSelector, ThemeMedia } from '../../spec/media';
import { Transformer } from './types';

export const fontTransformer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  key: FontPropNames,
  mediaFn: <T>() => MediaSelector<T, Media>
): Transformer<Media, Fact, FontKeys<Fact['media'], Fact['fonts']>> => (
  value,
  fact
) => {
  const val = fact.fonts.fonts[value].sizeClass;
  if (typeof val === 'function') {
    console.log(val(mediaFn()));
  }
  return {
    start: '',
    end: '',
  };
};
