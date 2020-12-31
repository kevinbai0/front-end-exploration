import { MediaIterable, ThemeMedia } from '../../spec/media';

export function normalizeResponsiveArray<T>([first, ...rest]: [
  T,
  ...[T, MediaIterable<ThemeMedia>][]
]): [T, MediaIterable<ThemeMedia> | '_base'][] {
  return [[first, '_base'], ...rest];
}
