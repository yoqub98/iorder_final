import React, { useState } from 'react';
import './index.css';
import { Form, Input,Modal, Button } from 'antd';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


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

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: 0
  });

  const handleChange = event => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };


  function successModal() {
    Modal.success({
      content: (
        <div style={{ textAlign: 'center' }}>
        
          <p style={{ fontSize: '18px', marginTop: '20px' }}>Item added successfully</p>
        </div>
      ),
      
    });
  }
  

   async function handleSubmit ()  {
   
    console.log("worked")
    
    const res = await db.collection('products').add(product, {merge:true}).then(() => {
        successModal()      })
      .catch((error) => {
        console.log(error);
      });;
  };
  return (
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
      <Form.Item>
        <Button onClick={handleSubmit} type="primary" htmlType="submit">
          Add Product
        </Button>
      </Form.Item>
    </Form>
  );

}
export default AddProduct;
