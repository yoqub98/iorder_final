import React, { useState, useEffect } from 'react';
import './index.css';
import { Form, Input,Modal, Button, Select,  InputNumber } from 'antd';
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

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    status : "",
   
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
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(newData)
      setSavedProducts(newData); // update saved_products with newData
    });
  }
  

  useEffect(() => {
   
    fetchInfo();
 
  }, []);
  return (
    <div>
    <Form>
      <Form.Item label="Name">
        <Input
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item label="Price">
        <Input
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
        />
      </Form.Item>
    <Form.Item label="Тип продукта">
    <Input.Group compact>
      <Select defaultValue="Option1">
        <Select value="Стик">Стик</Select>
        <Select value="Сашет">Сашет</Select>
      </Select>
      <Input
        style={{
          width: '50%',
        }}
        defaultValue="input content"
      />
      <InputNumber />
    </Input.Group>
    </Form.Item>
      <Form.Item>
        <Button onClick={handleSubmit} type="primary" htmlType="submit">
          Add Product
        </Button>
      </Form.Item>
    </Form>
    <Product_types data = {saved_products} />
    </div>
  );

}
export default AddProduct;
