import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Badge, Button, Modal, message, Space, Table, Typography, Select } from "antd";
import { initializeApp } from "firebase/app";
import { Spin } from 'antd';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {collection, deleteDoc, doc, getDocs, updateDoc, getFirestore,} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import moment from "moment";
const { Text } = Typography;

const firebaseConfig = {
  apiKey: "AIzaSyCEsm2uX4Ott4vxlH-K_p25xnYPShXv6FI",
  authDomain: "biflow-efa49.firebaseapp.com",
  databaseURL:
    "https://biflow-efa49-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "biflow-efa49",
  storageBucket: "biflow-efa49.appspot.com",
  messagingSenderId: "257343919180",
  appId: "1:257343919180:web:ffaa88ed28958ff04c90e9",
  measurementId: "G-89DK3S524X",
};
const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
const db = getFirestore(app);

const defaultExpandable = {
  expandedRowRender: (record) => <p>{record.description}</p>,
};
const defaultTitle = () => "Here is title";
const defaultFooter = () => "Here is footeer";

function ActiveOrders() {
  const [orderstatus, setOrderStatus] = useState("");
  const [filters, setFilters] = useState([]); // for filtering by product type ( get types from firestore)
  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      render: (text, record) => {
        const date = moment(record.date).format("DD/MM/YYYY");
        return <Text>{date}</Text>;
      },
      sorter: (a, b) => {
        // Compare the timestamps and return a value that determines their order
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
    },
    defaultSortOrder: "descend",
      defaultSortOrder: "descend",
    },
        {
      title: "Заказчик",
      dataIndex: "client",
      sorter: (a, b) => a.title - b.title,
    },
    {
      title: "Продукт",
      dataIndex: "product",
      filters : filters,
      onFilter: (value, record) => record.product + record.product_type === value,
      render: (text, record) => {
        return <div><Text  >{record.product}</Text> <Text type="secondary"> ({record.product_type})</Text></div>
      },
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Итого",
      dataIndex: "total",
      sorter: (a, b) => a.quantity - b.quantity,
      render: (text, record) => {
        return <Text>{record.total.toLocaleString()} сум</Text>
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (text, row, index) => (
        <span>
          <Badge status={row.status === "доставлено" ? "success" : "warning"} />{" "}
          <Space size="large" />
          <Text type={row.status === "доставлено" ? "success" : "warning"}>
            {row.status}
          </Text>
       
        </span>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (text, row, index) => (
          <Select
              defaultValue={row.status}
              onChange={(value) => handleStatusChange(value, row.id)}
          >
              <Select.Option value="в процессе">в процессе</Select.Option>
              <Select.Option value="доставлено">доставлено</Select.Option>
              <Select.Option value="готов к отгрузке">готов к отгрузке</Select.Option>
          </Select>
      ),
  },
    {
      title: "Action",
      key: "action",
      sorter: true,
      render: (text, row) => (
        <Space size="small">
          <Button
            onClick={showDeleteConfirm.bind(this, row.id)}
            icon={<DeleteOutlined style={{ fontSize: "16px", color: "#ff4d4f" }} />}
            type="text"
          >
           
          </Button>

          <Space>
            <Button
              onClick={handleDelete.bind(this, row.id)}
              icon={
                <EditOutlined style={{ fontSize: "16px", color: "black" }} />
              }
              type="text"
            >
            
            </Button>
          </Space>
        </Space>
      ),
    },
  ];

  const handleDelete = (id) => {
    console.log(id);
    deleteData(id);
  };

  const handleStatusChange = async (value, id) => {
 


    const db = getFirestore();
    const docRef = doc(db, "orders", id);
    const update_data = {
      status: value
    };
    
    updateDoc(docRef, update_data)
      .then(() => {
        message.success('Статус заказа успешно изменен');
                      
      })
      .catch((error) => {
        message.error("Произошла ошибка при изменении статуса заказа");
        console.log(error);
      });


};






  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Удалить',
      content: 'Удалить данный заказ с базы данных?',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk() {
        deleteData(id);
      },
    });
  };





  const deleteData = async (id) => {
    const db = getFirestore();
    const docRef = doc(db, "orders", id);
    deleteDoc(docRef)
      .then(() => {
        message.success('Заказ успешно удален с базы данных!');
       
        fetchPost();
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchPost = async () => {
    await getDocs(collection(db, "orders")).then((querySnapshot) => {
      setLoading(false)
      
      const newData = querySnapshot.docs.map((doc) => {
        const timestamp = doc.data().date;
        const date = timestamp.toDate();
        const formattedDate = date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).replace(/\//g, '/');
        
        return {
            ...doc.data(),
            date: formattedDate,
            id: doc.id
        }
    });
       setOrders(newData);
      console.log(newData)
      setLocalData(newData) // orders => data from firebase ( data here is  == local data )
      console.log(datalenght);
    });

   
  };
  const [data, setLocalData] = useState([])
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("large");
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showfooter, setShowFooter] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [top, setTop] = useState("none");
  const [bottom, setBottom] = useState("bottomRight");
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState(undefined);
  const [orders, setOrders] = useState([]);
  const [datalenght, setLengh] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {
     getDocs(collection(db, "products")).then((snapshot) => {
      const products = snapshot.docs.map((doc) => doc.data());
      setFilters(products.map((product) => ({ text: product.name + "(" +product.type +  ")", value: product.name + product.type})));
      console.log(filters)
    });
    setTimeout(() => {
      
      setLoading(false);
    }, 2000);
    
    fetchPost();
    setLengh(data.length);
    
  }, []);

 

  
  const scroll = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = "100vw";
  }
  const tableColumns = columns.map((item) => ({
    ...item,
    ellipsis,
  }));

  if (xScroll === "fixed") {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = "right";
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

  

 
  
  

  for (let i = 0; i < datalenght; i++) {
    data.push({
      key: i,
    });
  }
  return (
    <>
        <Spin size="large" spinning={loading}>
      <Table
       rowKey={(record) => record.id}
        {...tableProps}
        pagination={{
          position: [top, bottom],
        }}
        columns={tableColumns}
        dataSource={hasData ? data : []}
        scroll={scroll}
      />
      </Spin>
    </>
  );
}

export default ActiveOrders;
