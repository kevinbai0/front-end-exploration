type IGroup<Keys extends string, Values, ReturnType> = {
  keys: Keys[];
  mapTo: (values: Values) => ReturnType;
  isMediable: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BaseGroup = IGroup<string, any, any>;

const group = <Keys extends string>(keys: Keys[]) => <Values, ReturnType>(
  mapTo: (value: Values) => ReturnType,
  isMediable = true
): IGroup<Keys, Values, ReturnType> => {
  return {
    keys,
    mapTo,
    isMediable,
  };
};

type MapGroup<Group extends BaseGroup> = {
  [Key in Group['keys'][number]]: ReturnType<Group['mapTo']>;
};

const res = group(['m', 'ml', 'mt', 'mr'])((values: number) => {
  return 5 as const;
});

type T = MapGroup<typeof res>;
