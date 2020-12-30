import { BaseFactory } from '../../spec/factory';
import { Transformer } from './types';

export const colorTransformer = <Fact extends BaseFactory>(): Transformer<
  Fact,
  'bg'
> => () => {
  return {
    start: '',
    end: '',
  };
};
