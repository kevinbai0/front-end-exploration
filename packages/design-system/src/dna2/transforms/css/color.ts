import { ColorKeys } from '../../spec/colors';
import { BaseFactory } from '../../spec/factory';
import { MediaSelector, ThemeMedia } from '../../spec/media';
import { Transformer } from './types';

export const colorTransformer = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>(
  key: 'fg' | 'bg',
  mediaFn: <T>() => MediaSelector<T, Media>
): Transformer<Media, Fact, ColorKeys<Fact['colors']>> => (value, fact) => {
  const split = value.split('.');
  const identifier = key === 'fg' ? 'color' : 'background-color';
  if (split.length === 1) {
    return {
      start: `${identifier}: ${fact.colors[value]}`,
      end: ';',
    };
  }

  const [arr, index] = [fact.colors[split[0]], Number(split[1])];
  return {
    start: `${identifier}: ${arr[index]}`,
    end: ';',
  };
};
