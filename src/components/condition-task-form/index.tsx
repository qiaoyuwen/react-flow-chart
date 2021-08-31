import ProForm, {
  ProFormDigit,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import type {
  ConditionTaskShape,
  ConditionTaskShapeFormData,
} from '@/graph/shapes/condition-task';
import {
  CompareTypeOptions,
  ConditionValueType,
  ConditionValueTypeOptions,
} from './constant';

interface ConditionTaskFormProps {
  node: ConditionTaskShape;
}

const ConditionTaskForm: FunctionComponent<ConditionTaskFormProps> = ({
  node,
}) => {
  const formRef = useRef<ProFormInstance>();

  const initForm = useCallback(() => {
    if (!formRef.current) {
      return;
    }
    formRef.current.setFieldsValue(node.values);
  }, [node]);

  useEffect(() => {
    initForm();
  }, [initForm]);

  return (
    <ProForm<ConditionTaskShapeFormData>
      formRef={formRef}
      onValuesChange={(values) => {
        node.changeValues({
          ...formRef.current?.getFieldsValue(),
          ...values,
        });
      }}
      submitter={false}
    >
      <ProFormSelect
        name="valueType"
        label="条件类型"
        options={ConditionValueTypeOptions}
      />
      <ProFormDependency name={['valueType']}>
        {({ valueType }) => {
          if (valueType === ConditionValueType.AmountOfConsumption) {
            return <ProFormDigit label="条件值" name="value" min={0} />;
          }
          if (valueType === ConditionValueType.CountOfStores) {
            return <ProFormDigit label="条件值" name="value" min={0} />;
          }
          if (valueType === ConditionValueType.CountOfOrdersConsumed) {
            return <ProFormDigit label="条件值" name="value" min={0} />;
          }
          return null;
        }}
      </ProFormDependency>

      <ProFormSelect
        name="compareType"
        label="比较类型"
        options={CompareTypeOptions}
      />
    </ProForm>
  );
};

export default ConditionTaskForm;
