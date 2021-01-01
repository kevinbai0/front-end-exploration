import { BaseFactory } from '../../base/factory';

import { ThemeMedia } from '../../base/media';
import { StringKey } from '../../types';
import { createValueTransform } from './base';

export const layoutTransform = <
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
>() =>
  createValueTransform<Media, Fact>()(
    ['layout'],
    (value, mediaType, media, factory) => {
      type Props = Fact['layout']['properties'];
      if (typeof value === 'string') {
        const components = value.split(':') as string[];
        if (components.length === 1) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const alias = factory.layout.aliases[value as string];
          throw new Error('Layout aliases are not handled yet');
        }
        if (components.length === 3) {
          const [display, align, justify] = components as [
            StringKey<keyof Props['display']>,
            StringKey<keyof Props['align']>,
            StringKey<keyof Props['justify']>
          ];

          return {
            display: factory.layout.properties.display[display],
            align: factory.layout.properties.align[align],
            justify: factory.layout.properties.justify[justify],
          };
        } else if (components.length === 2) {
          const [display, align] = components as [
            StringKey<keyof Props['display']>,
            StringKey<keyof Props['align']>
          ];
          return {
            display: factory.layout.properties.display[display],
            align: factory.layout.properties.align[align],
          };
        }
      }
      return [];
    }
  );
