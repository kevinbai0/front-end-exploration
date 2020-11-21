import React from 'react';
import { DNA } from '../theme/types';
import { extractDNAProps } from './extractDna';

export function withDNAProps<T extends { dna: DNA }>(Comp: React.ComponentType<T>) {
  return (props: Omit<T, 'dna'> & DNA & { style?: object }) => {
    const [dnaProps, otherProps] = extractDNAProps(props);
    return (
      <Comp {...otherProps as any} dna={dnaProps} />
    )
  }
}
