import React, { useState, useEffect} from 'react';
import './Customerpage_stlying.css'
import { Form, Input, Button, Table, message, Modal, Divider } from 'antd';
import Icon, { EnvironmentOutlined,PhoneOutlined, MailOutlined, UserOutlined, PlusCircleOutlined } from '@ant-design/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Typography } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

const IconSet = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3867263_dgojwc1pnnm.js',

});


const { Text, Link } = Typography;

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
  const [visible, setVisible] = useState(false); // for modal pop up

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
        [e.target.name]: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') // Remove unwanted characters
      }
    });
  }

  const handleSubmit = (e) => {
    console.log(formData)
   
   
    db.collection("customers").add(formData, {merge:true}).then(() => {
      message.success('Клиент успешно добавлен в базу данных!');
      setVisible(false)
    })
    .catch((error) => {
     message.error (error.message);
    });;;
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

const columns = [    {  title: 'Company Name',
   dataIndex: 'companyName',  key: 'companyName', render: (text, record) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>,   },    
{   title: 'Address',     dataIndex: 'address',      key: 'address',    },    
{   title: 'Email',      dataIndex: 'email',      key: 'email',    },    
{
  title: 'Contact Person',
  dataIndex: 'contactPerson',
  key: 'contactPerson',
  render: (contactPerson) => (
    <>
      <p style={{ margin: "0px 5px" }}>
        <UserOutlined style={{ marginRight: "2px" }} /> {" " + contactPerson.name}
      </p>
      <Divider style={{ margin: "8px " }} type="horizontal" />
      <a
        href={`https://t.me/${contactPerson.telegramUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconSet style={{ marginRight: 6 }} type="icon-telegram" /> {`https://t.me/${contactPerson.telegramUrl}`}
      </a>
      <Divider style={{ margin: "8px " }} type="horizontal" />
      <p><PhoneOutlined /> {contactPerson.phoneNumber}</p>
    </>
  ),
}, ];

  return (
    <div>
      <Button icon={<PlusCircleOutlined/>} style={{margin : 15}} type="primary" onClick={() => setVisible(true)}>
  Добавить
</Button>
      <Modal
  title="Add New Customer"
  open={visible}
  onOk={handleSubmit}
  onCancel={() => setVisible(false)}
  className="custom-modal"

>
      <Form onFinish={handleSubmit}>
        <Form.Item label="Company Name">
          <Input prefix={<IconSet  type="icon-company" />} name="companyName" value={formData.companyName} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Address">
          <Input  name="address" prefix={<EnvironmentOutlined style={{color:"#8c8c8c"}}/>} value={formData.address} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Email">
          <Input name="email"prefix={<MailOutlined style={{color:"#8c8c8c"}}/>} value={formData.email} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Contact Person Name">
          <Input prefix={<UserOutlined style={{color:"#8c8c8c"}}/>} name="name" value={formData.contactPerson.name} onChange={handleContactInputChange} />
        </Form.Item>
        <Form.Item label="Contact Person Telegram">
          <Input name="telegramUrl" style={{color:"#8c8c8c"}} prefix={<IconSet type="icon-telegram1" />} value={formData.contactPerson.telegramUrl} onChange={handleContactInputChange}  addonBefore="https://t.me/" />
          </Form.Item>
          <Form.Item label="Contact Person Phone">
            <Input prefix={<PhoneOutlined style={{color:"#8c8c8c"}}/>} name="phoneNumber" value={formData.contactPerson.phoneNumber} addonBefore="+998" onChange={handleContactInputChange} />
          </Form.Item>
          <Form.Item>
          
          </Form.Item>
        </Form>
       
        </Modal>
        <Table  className="bordered-table" dataSource={customers}     columns={columns} />
      </div>
    );
  }
  
  export default AddCustomer;
