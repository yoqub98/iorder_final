import React, { useState, useEffect } from 'react';
import './index.css';
import { Form, Input,Modal, Button, Select, Row, Col, InputNumber , Spin} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Product_types from './ProductTypes';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { collection, getDocs, 
} from "firebase/firestore";

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
const product_types  =[
    {
      label: 'Стик',
      key: '1',
    },
    {
      label: 'Сашет',
      key: '2',
    },
   

  ];

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function AddProduct() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    type : "",
   
  });

  const [saved_products, setSavedProducts] = useState([]); 

  
  const handleChange = event => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

 
  function successModal() {
    Modal.success({
      content: (
        <div style={{ textAlign: 'center' }}>
        
          <p style={{ fontSize: '18px', marginTop: '20px' }}>Товар добален в базу данных!</p>
        </div>
      ),
      
    });
  }
  
   async function handleSubmit ()  {
   
    console.log("worked")
    
    const res = await db.collection('products').add(product, {merge:true}).then(() => {
        successModal() 
    fetchInfo();     })
      .catch((error) => {
        console.log(error);
      });;
  };

  async function fetchInfo ()  {
    await getDocs(collection(db, "products")).then((querySnapshot) => {
      setLoading(false)
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
     
      console.log(newData)
      setSavedProducts(newData); // update saved_products with newData
    });
  }
  

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    fetchInfo();
 
  }, []);
  return (
   <div>
    <Form>
    <Form.Item >
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Name">
        <Input
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label="Price">
        <Input
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
        />
      </Form.Item>
    </Col>
  </Row>
</Form.Item>
      <Form.Item label="Тип продукта">
  <Row gutter={16}>
    <Col span={8}>
      <Select
       onChange={(value) => setProduct({ ...product, type: value })}
      >
        {product_types.map(type => (
          <Select.Option  name="type"   key={type.key} value={type.label}>{type.label}</Select.Option>
        ))}
      </Select>
    </Col>
    <Col span={8}>
      <Button type="primary" onClick={handleSubmit}>Add Product</Button>
    </Col>
  </Row>
</Form.Item>
     
    </Form>
     <Spin size="large" spinning={loading}>
    <Product_types data = {saved_products} />
    </Spin>
</div>
  );

}
export default AddProduct;
