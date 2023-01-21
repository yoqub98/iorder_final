import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";

const firebaseConfig = {
  apiKey: "AIzaSyCEsm2uX4Ott4vxlH-K_p25xnYPShXv6FI",
  authDomain: "biflow-efa49.firebaseapp.com",
  databaseURL: "https://biflow-efa49-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "biflow-efa49",
  storageBucket: "biflow-efa49.appspot.com",
  messagingSenderId: "257343919180",
  appId: "1:257343919180:web:ffaa88ed28958ff04c90e9",
  measurementId: "G-89DK3S524X"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const { Column } = Table;

function Inventory() {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalTitle, setModalTitle] = useState("Добавить инвентарь");

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('inventory')
      .onSnapshot((snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(items);
      });
    return unsubscribe;
  }, []);

  const showModal = (item) => {
    setVisible(true);
  if (item) {
    setSelectedItem(item);
    form.setFieldsValue({
      name: item.name,
      price : item.price,
      quantity: item.quantity,
      category: item.category,
    });
    setModalTitle("Изменить");
  } else {
    setModalTitle("Добавить инвентарь");
  }
  };

  const handleCancel = () => {
    setVisible(false);
  };


  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        // convert quantity to a number before posting to Firestore
        values.quantity = parseFloat(values.quantity);
        firebase
          .firestore()
          .collection('inventory')
          .add(values);
        setVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleEdit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        // convert quantity to a number before posting to Firestore
        values.quantity = parseFloat(values.quantity);
        firebase
          .firestore()
          .collection('inventory')
          .doc(selectedItem.id)
          .set(values, { merge: true });
        setVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (id) => {
    firebase
      .firestore()
      .collection('inventory')
      .doc(id)
      .delete();
  };
  const showDeleteConfirm = (id, name) => {
  
  
    Modal.confirm({
      title: 'Удалить',
      content: <div dangerouslySetInnerHTML={{__html: `Удалить данный инвентарь <b>${name}</b> с базы данных?`}} />,
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk() {
       handleDelete(id);
      },
    });
  };



  return (
    <div>
      <Button icon={<PlusCircleOutlined/>} style={{ marginBottom: '20px' }} type="primary" onClick={showModal}>
        Добавить инвентарь
      </Button>
      <Table dataSource={items} rowKey="id">
        <Column title="Наименование" dataIndex="name" key="name" />
        <Column title="Количество" dataIndex="quantity" key="quantity" />
        <Column title="Прайс" dataIndex="price" key="price" />
        <Column title="Категория" dataIndex="category" key="category" />

        <Column
          title="Действия"
          key="action"
          render={(text, record) => (
            <Space size="middle">
            <Button icon={<EditOutlined/>} onClick={() => showModal(record)}>Изменить</Button>
          
            <Button  onClick={() => showDeleteConfirm(record.id, record.name)}
              icon={<DeleteOutlined style={{ fontSize: "16px", color: "#ff4d4f" }} />}
              type="text"
            >Удалить</Button>  
             
              </Space>
          )}
        />
      
        
      </Table>
      <Modal
         title={modalTitle}
        visible={visible}
        onCancel={handleCancel}
        onOk={selectedItem ? handleEdit : handleCreate}
      >
     <Form form={form} initialValues={selectedItem}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Количество" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="category" label="Категория" rules={[{ required: true }]}>
            <Select>
            <Select.Option value="Сырье">Сырье</Select.Option>
            <Select.Option value="Бумага">Бумага</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Inventory;
