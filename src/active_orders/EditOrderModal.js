import React, { useState, useEffect } from 'react';
import {} from 'antd';
import { Radio,  Modal, Cascader, InputNumber, Form, Input, Button,  Select } from "antd";

function EditOrderModal({ order, visible, onCancel, onUpdate }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (order) {
      // Populate the form with order data when the modal is shown
      form.setFieldsValue({
        date: order.date,
        client: order.client,
        product: order.product,
        quantity: order.quantity,
        total: order.total,
        status: order.status,
        pay_status: order.pay_status,

        // ... other fields ...
      });
    }
  }, [order]);

  const handleUpdate = () => {
    // Get updated data from the form
    const updatedData = form.getFieldsValue();
    // Perform the update operation and call onUpdate
    onUpdate(updatedData);
  };

  return (
    <Modal
      title="Edit Order"
      visible={visible}
      onCancel={onCancel}
      onOk={handleUpdate}
      destroyOnClose={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="date" label="Date">
          <Input />
        </Form.Item>
        <Form.Item name="client" label="Client">
          <Input />
        </Form.Item>
        {/* ... other form fields ... */}
      </Form>
      <Button type="primary" onClick={handleUpdate}>
        Update
      </Button>

      
    </Modal>
  );
}

export default EditOrderModal;