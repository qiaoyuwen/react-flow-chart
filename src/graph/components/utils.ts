import { NodeDataType } from './enums';

const DataTypeProperty = 'data-type';

export const getDataType = (el: HTMLElement) => {
  if (el.getAttribute(DataTypeProperty)) {
    return el.getAttribute(DataTypeProperty) as NodeDataType;
  }
  return undefined;
};

export const getNodeSize = (type?: NodeDataType) => {
  if (type === NodeDataType.StartEvent || type === NodeDataType.EndEvent) {
    return {
      width: 60,
      height: 60,
    };
  }

  if (type === NodeDataType.ConditionTask) {
    return {
      width: 80,
      height: 80,
    }
  }

  if (type === NodeDataType.CouponTask) {
    return {
      width: 100,
      height: 60,
    }
  }
  return undefined;
};
