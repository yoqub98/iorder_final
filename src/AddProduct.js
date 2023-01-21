import React, { useState, useEffect } from 'react';
import './index.css';
import { Form, Input,Modal, Button, Select, Row, Divider, Space, Col, Spin} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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


firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function AddProduct() {
  const [loading, setLoading] = useState(true);
  const [productTypes, setProductTypes] = useState([]); // tip upakovki

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    type : "",
   
  });

  const [saved_products, setSavedProducts] = useState([]); 
  const [newCategory, setNewCategory] = useState('');
  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
  }
  
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

  const addNewCategory = (e) => {
    e.preventDefault();
    setProductTypes([...productTypes, {label: newCategory, key: newCategory}]);
    setNewCategory('');
    addNewCategoryToFirestore(newCategory);
  };

  const addNewCategoryToFirestore = async (newCategory) => {
    await db.collection("product_categories").add({name: newCategory});
  };
  
  
   async function handleSubmit ()  {
   
    console.log("worked")
    
    await db.collection('products').add(product, {merge:true}).then(() => {
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
    fetchInfo(); // Fetch saved products
    db.collection("product_categories").get()
    .then(querySnapshot => {
      let productTypesData = []
      querySnapshot.forEach(doc => {
        productTypesData.push({
          label: doc.data().name,
          key: doc.id,
        });
      });
      setProductTypes(productTypesData);
    });
  }, []); 

  return (
   <div>
 <Form>
  <Form.Item>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Наименование продукта">
          <Input
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Цена">
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
  <Form.Item label="Категория">
    <Row gutter={16}>
      <Col span={8}>
        <Select
          style={{ width: 400 }}
          placeholder="Выбрать категорию"
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider
                style={{
                  margin: '8px 0',
                }}
              />
              <Space
                style={{
                  padding: '0 8px 4px',
                }}
              >
                <Input
                  placeholder="Наименование категории"
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                />
                <Button color='primary' type="text" icon={<PlusOutlined />} onClick={addNewCategory}>
                  Добавить категорию
                </Button>
              </Space>
            </>
          )}
          options={productTypes.map((item) => ({
            label: item.label,
            value: item.key,
          }))}
        />
      </Col>
    </Row>
  </Form.Item>
  <Form.Item>
    <Button style={{marginLeft: 16}} type="primary" onClick={handleSubmit}>
      Добавить Продукт
    </Button>
  </Form.Item>
</Form>

     <Spin size="large" spinning={loading}>
    <Product_types data = {saved_products} />
    </Spin>
</div>
  );

}
export default AddProduct;
