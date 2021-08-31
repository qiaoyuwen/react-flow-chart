export enum ConditionValueType {
  AmountOfConsumption = 'AmountOfConsumption', // 消费金额
  CountOfStores = 'CountOfStores', // 进入店铺数
  CountOfOrdersConsumed = 'CountOfOrdersConsumed', // 消费的订单笔数
}

export const ConditionValueText = {
  [ConditionValueType.AmountOfConsumption]: '消费金额',
  [ConditionValueType.CountOfStores]: '进入店铺数',
  [ConditionValueType.CountOfOrdersConsumed]: '消费的订单笔数',
};

export const ConditionValueTypeOptions = Object.keys(ConditionValueText).map(
  (key) => {
    return {
      label: ConditionValueText[key as keyof typeof ConditionValueText],
      value: key,
    };
  },
);

export enum CompareType {
  LT = '<',
  LE = '<=',
  EQ = '=',
  NE = '!=',
  GE = '>=',
  GT = '>',
}

export const CompareTypeText = {
  [CompareType.LT]: '小于',
  [CompareType.LE]: '小于等于',
  [CompareType.EQ]: '等于',
  [CompareType.NE]: '不等于',
  [CompareType.GE]: '大于等于',
  [CompareType.GT]: '大于',
};

export const CompareTypeOptions = Object.keys(CompareTypeText).map((key) => {
  return {
    label: CompareTypeText[key as keyof typeof CompareTypeText],
    value: key,
  };
});
