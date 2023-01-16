import React, { useState, useEffect} from 'react';
import { Form, Input, Button, Table, message  } from 'antd';
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

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    email: '',
    contactPerson: {
      name: '',
      telegramUrl: '',
      phoneNumber: ''
    }
  });
  const [customers, setCustomers] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleContactInputChange = (e) => {
    setFormData({
      ...formData,
      contactPerson: {
        ...formData.contactPerson,
        [e.target.name]: e.target.value
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      companyName: '',
      address: '',
      email: '',
      contactPerson: {
        name: '',
        telegramUrl: '',
        phoneNumber: ''
      }
    });
    db.collection("customers").add(formData, {merge:true}).then(() => {
      message.success('Клиент успешно добавлен в базу данных!');
    })
    .catch((error) => {
     message.error (error.message);
    });;;
   
  }

  useEffect(() => {
    db.collection("customers").onSnapshot((querySnapshot) => {
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push({...doc.data(), id: doc.id});
        });
        setCustomers(data);
    });
}, []);

const columns = [    {      title: 'Company Name',      dataIndex: 'companyName',      key: 'companyName',    },    
{   title: 'Address',     dataIndex: 'address',      key: 'address',    },    
{   title: 'Email',      dataIndex: 'email',      key: 'email',    },    
{   title: 'Contact Person',      dataIndex: 'contactPerson',      key: 'contactPerson',
 render: (contactPerson) => (
  <>  <p>Name: {contactPerson.name}</p>  <p>Telegram: {contactPerson.telegramUrl}</p>  
        <p>Phone: {contactPerson.phoneNumber}</p>  
        </> 
         )  }, ];

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Item label="Company Name">
          <Input name="companyName" value={formData.companyName} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Address">
          <Input name="address" value={formData.address} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Email">
          <Input name="email" value={formData.email} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Contact Person Name">
          <Input name="name" value={formData.contactPerson.name} onChange={handleContactInputChange} />
        </Form.Item>
        <Form.Item label="Contact Person Telegram">
          <Input name="telegramUrl" value={formData.contactPerson.telegramUrl} onChange={handleContactInputChange} />
          </Form.Item>
          <Form.Item label="Contact Person Phone">
            <Input name="phoneNumber" value={formData.contactPerson.phoneNumber} onChange={handleContactInputChange} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add Customer</Button>
          </Form.Item>
        </Form>
        <Table dataSource={customers} columns={columns} />

      </div>
    );
  }
  
  export default AddCustomer;
