import { DeleteOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { Card, Col, Row, Modal, message } from 'antd';
import { initializeApp } from "firebase/app";
import { Spin } from 'antd';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {deleteDoc, doc, getFirestore,} from "firebase/firestore";

const { Meta } = Card;
const Product_types = (props) => {
  const { data } = props;
  const [visible, setVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const showDeleteConfirm = (product) => {
    Modal.confirm({
      title: 'Удалить',
      content: 'Удалить данный товар с базы данных?',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk() {
        deleteProduct(product);
      },
    });
  };

  const deleteProduct = async (product) => {
    const db = getFirestore();
    const docRef = doc(db, "products", product.id);
    deleteDoc(docRef)
      .then(() => {
        message.success('Товар успешно удален с базы данных!');
             
      })
      .catch((error) => {
        message.error('Ошибка при удалении: ' + error.message);
      });
  };

  return (
    <Row gutter={16}>
      {data.map((item) => (
        <Col key={item.id} span={8} >
          <Card  style={{ marginBottom: '18px' }} bordered={false} headStyle={{ borderColor: '#1890ff' , borderWidth: 1.5, backgroundColor: '#fafafa'}} 
          type="inner" title={item.name} 
          actions={[
            <InfoCircleOutlined style={{ color: '#40a9ff' }}   key="setting" />,
            <EditOutlined key="edit" />,
            <DeleteOutlined style={{ color: '#ff4d4f' }} key="ellipsis" onClick={() => showDeleteConfirm(item)} />,
          ]}>
           Цена : {item.price} сум/шт
           <Meta style={{ marginTop: '12px' }} description={"Категория : " + " " + item.type}>
           
           </Meta></Card>
        </Col>
      ))}
    </Row>
  );
};

export default Product_types;
