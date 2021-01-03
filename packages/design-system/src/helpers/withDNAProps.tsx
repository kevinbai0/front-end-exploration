import React from 'react';
import { DNA } from '../theme/types';
import { extractDNAProps } from './extractDna';

const pickKeys = <T extends keyof DNA>(keys: T[]) => keys;

const OuterProps = pickKeys([
  'bg',
  'border',
  'bottom',
  'top',
  'left',
  'right',
  'position',
  'height',
  'width',
  'minHeight',
  'maxHeight',
  'minWidth',
  'maxWidth',
  'justify',
  'align',
  'shadow',
  'radius',
  'opacity',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
]);

const Types = {
  OuterProps,
  DNA: [] as (keyof DNA)[],
};
type Types = typeof Types;

export const pickDNAProps = <T extends keyof DNA>(props: T[]) => (dna: DNA) => {
  const set = new Set(props);
  const selected: { [key in T]?: DNA[key] } = {};
  const omitted: { [key in Exclude<keyof DNA, T>]?: DNA[key] } = {};
  Object.entries(dna).forEach(([key, value]) => {
    if (set.has(key as T)) {
      selected[key as T] = value;
    } else {
      omitted[key as Exclude<keyof DNA, T>] = value;
    }
  });

  return [selected, omitted] as const;
};

export const withDNAPropsBase = <Type extends keyof typeof Types = 'DNA'>(
  type?: Type
) => {
  type NewDNA = Pick<DNA, Types[Type][number]>;
  return <T extends {}, Ref extends {}>(
    Comp: React.ComponentType<T & { dna: NewDNA }>
  ) => {
    return React.forwardRef<
      Ref,
      Omit<T, 'dna'> & NewDNA & { style?: object; className?: string }
    >((props, ref) => {
      const [dnaProps, otherProps] = extractDNAProps(props);
      if (type && type !== 'DNA') {
        const [selected] = pickDNAProps(Types[type])(dnaProps);
        return <Comp {...(otherProps as any)} dna={selected} />;
      }
      return <Comp ref={ref} {...(otherProps as any)} dna={dnaProps} />;
    });
  };
};

export const withDNAProps = withDNAPropsBase();
export const withDNAPositioningProps = withDNAPropsBase('OuterProps');
