import type { BooleanEdge } from '@/graph/edges/boolean-edge';
import ProForm, { ProFormSwitch } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

interface BooleanEdgeFormProps {
  edge: BooleanEdge;
}

const BooleanEdgeForm: FunctionComponent<BooleanEdgeFormProps> = ({ edge }) => {
  const formRef = useRef<ProFormInstance>();

  const initForm = useCallback(() => {
    if (!formRef.current) {
      return;
    }
    formRef.current.setFieldsValue({
      value: edge.value,
    });
  }, [edge]);

  useEffect(() => {
    initForm();
  }, [initForm]);

  return (
    <ProForm
      formRef={formRef}
      onValuesChange={(values) => edge.changeValue(values.value)}
      submitter={false}
    >
      <ProFormSwitch
        name="value"
        label="条件是否成立"
        initialValue={edge.value}
      />
    </ProForm>
  );
};

export default BooleanEdgeForm;
