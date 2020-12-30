import { DnaPropNames, ThemeDnaProps } from '../../build/types';
import { BaseFactory } from '../../spec/factory';
import { StringKey } from '../../types';

export type Transformer<
  Fact extends BaseFactory,
  Key extends DnaPropNames<Fact>
> = (
  type: ThemeDnaProps<Fact>[Key],
  fact: Fact
) => {
  start: string;
  end: string;
};

export type MediaTransformer<Fact extends BaseFactory> = (
  type: StringKey<keyof Fact['media']['breakpoints']> | '_base',
  fact: Fact
) => {
  start: string;
  end: string;
};
