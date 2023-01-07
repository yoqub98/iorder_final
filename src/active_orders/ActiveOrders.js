import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { Form, Radio, Button, Switch, Table, Badge, Space, Typography } from 'antd';
import firebase from 'firebase/compat/app';
import { collection, getDocs,getDoc, deleteDoc, doc } from "firebase/firestore";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const { Text } = Typography;

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
const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
const db = getFirestore(app);



const defaultExpandable = {
  expandedRowRender: (record) => <p>{record.description}</p>,
};
const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footeer';




function ActiveOrders () {

  const [orderstatus, setOrderStatus] = useState("")
  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
    },
    {
      title: 'Заказчик',
      dataIndex: 'client',
      sorter: (a, b) => a.title - b.title,
    },
    {
      title: 'Продукт',
      dataIndex: 'product',
      filters: [
        {
          text: 'Соль',
          value: 'Соль',
        },
        {
          text: 'Сахар',
          value: 'Сахар',
        },
      ],
      onFilter: (value, record) => record.product.indexOf(value) === 0,
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      
    },
    {
      title: 'Итого',
      dataIndex: 'total',
      
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (text, row, index) => <span><Badge status={ row.status==="delivered" ? "success": "warning"}/>  <Space size="large"/>
      <Text type= { row.status==="delivered" ? "success": "warning"}>{row.status}</Text></span>
    },
      {
      title: 'Action',
      key: 'action',
      sorter: true,
      render: (text, row, ) => (
        <Space size="middle">
           <Button onClick={handleDelete.bind(this,row.id)} icon={<DeleteOutlined style={{ fontSize: '16px', color: 'red' }} />} type="text">Удалить</Button>
        
            <Space>
            <Button onClick={handleDelete.bind(this,row.id)} icon={<DeleteOutlined style={{ fontSize: '16px', color: 'red' }} />} type="text">Edit</Button>
             
            </Space>
       
        </Space>
      ),
    },
  ];

  const handleDelete = (id)=>  {
    console.log(id)
   deleteData(id)
  
   
  }

  const deleteData = async (id) => {
    const db = getFirestore(); const docRef = doc(db, "orders", id); 
    deleteDoc(docRef) .then(() => { 
      
      alert("Order has been deleted!")
      console.log("Entire Document has been deleted successfully.")
      fetchPost()
  window.location.reload();
  }) .catch(error => { console.log(error); })
  
  }
  
  const fetchPost = async () => {
   
    await getDocs(collection(db, "orders"))
        .then((querySnapshot)=>{               
            const newData = querySnapshot.docs
                .map((doc) => ({...doc.data(), id:doc.id }));
            setOrders(newData);  
            setLengh(orders.length)            
            console.log(orders.length);
        })
   
}

  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState('large');
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showfooter, setShowFooter] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [top, setTop] = useState('none');
  const [bottom, setBottom] = useState('bottomRight');
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState(undefined);
  const [orders, setOrders] = useState([]);
  const [datalenght, setLengh] = useState(0)
  useEffect(()=>{
    
    fetchPost();
    setLengh(orders.length)
}, [])

  const scroll = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = '100vw';
  }
  const tableColumns = columns.map((item) => ({
    ...item,
    ellipsis,
  }));
  
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }
  const tableProps = {
    bordered,
    loading,
    size,
    expandable,
    title: showTitle ? defaultTitle : undefined,
    showHeader,
    footer: showfooter ? defaultFooter : undefined,
    rowSelection,
    scroll,
    tableLayout,
  };


  const data = orders; // orders => data from firebase ( data == local data )

  for (let i = 0; i < datalenght; i++) {
  
  data.push({
  key: i,
  
     
    });
  }
  return (
    <>
     
      <Table
        {...tableProps}
        pagination={{
          position: [top, bottom],
        }}
        columns={tableColumns}
        dataSource={hasData ? data : []}
        scroll={scroll}
      />
    </>
  );
      }

 

export default ActiveOrders;