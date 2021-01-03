import { DNA } from '../theme/types';

const dnaKeys: {
  [key in keyof Required<DNA>]: 1;
} = {
  fg: 1,
  bg: 1,
  border: 1,
  radius: 1,
  shadow: 1,
  opacity: 1,
  m: 1,
  p: 1,
  mx: 1,
  my: 1,
  px: 1,
  py: 1,
  mt: 1,
  mb: 1,
  ml: 1,
  mr: 1,
  pt: 1,
  pr: 1,
  pb: 1,
  pl: 1,
  font: 1,
  weight: 1,
  display: 1,
  rowLayout: 1,
  colLayout: 1,
  alignItems: 1,
  justifyItems: 1,
  alignContent: 1,
  justifyContent: 1,
  gap: 1,
  align: 1,
  justify: 1,
  position: 1,
  left: 1,
  right: 1,
  top: 1,
  bottom: 1,
  width: 1,
  height: 1,
  maxWidth: 1,
  maxHeight: 1,
  minWidth: 1,
  minHeight: 1,
  flex: 1,
};

export const extractDNAProps = <T extends Record<string, unknown> & DNA>(
  props: T
): [DNA, Omit<T, keyof DNA>] => {
  const dna: DNA = {};
  const newProps = {} as Omit<T, keyof DNA>;
  Object.keys(props).forEach(key => {
    if (dnaKeys[key as keyof DNA]) {
      dna[key as keyof DNA] = props[key] as any;
    } else {
      newProps[key as keyof Omit<T, keyof DNA>] = props[key] as any;
    }
  });

  return [dna, newProps];
};
