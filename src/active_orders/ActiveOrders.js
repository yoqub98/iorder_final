import React, { useEffect, useState } from "react";
import moment from "moment";
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Modal, message, Space, Table, Typography, Select } from "antd";
import { Spin } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import './custom_styling.css';

// Initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyCEsm2uX4Ott4vxlH-K_p25xnYPShXv6FI",
  authDomain: "biflow-efa49.firebaseapp.com",
  databaseURL: "https://biflow-efa49-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "biflow-efa49",
  storageBucket: "biflow-efa49.appspot.com",
  messagingSenderId: "257343919180",
  appId: "1:257343919180:web:ffaa88ed28958ff04c90e9",
  measurementId: "G-89DK3S524X"// Your Firebase config
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore database instance

// Create custom icon set
const IconSet = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3867263_dgojwc1pnnm.js',
});

const { Text } = Typography;

// Default expandable configuration for the table
const defaultExpandable = {
  expandedRowRender: (record) => <p>{record.description}</p>,
};
const defaultTitle = () => "Here is title";
const defaultFooter = () => "Here is footer";

function ActiveOrders() {
  const [orderstatus, setOrderStatus] = useState("");
  const [filters, setFilters] = useState([]); // Filters for product type

  const [data, setLocalData] = useState([]); // Local data for the table
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
  const [datalength, setLength] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  // Function to handle selection changes
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    console.log(selectedRowKeys); // Add this line to check selectedRowKeys
  };

    // Function to handle the "Delete All" button click
    const handleDeleteAll = () => {
      console.log(selectedRowKeys); // Verify that selectedRowKeys contains the correct order IDs
    
      // Show a confirmation modal
      Modal.confirm({
        title: 'Delete Selected Orders',
        content: 'Are you sure you want to delete the selected orders?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          // Loop through selectedRowKeys and delete each order
          for (const id of selectedRowKeys) {
            await deleteData(id);
          }
          setSelectedRowKeys([]); // Clear selected rows
        },
      });
    };
  


  // Columns configuration for the table
  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      render: (text, record) => {
        const date = moment(record.date).format("DD/MM/YYYY");
        return <Text>{date}</Text>;
      },
      sorter: (a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      },
      defaultSortOrder: "descend",
    },
    {
      title: "Заказчик",
      dataIndex: "client",
      sorter: (a, b) => a.client - b.client,
    },
    {
      title: "Продукт",
      dataIndex: "product",
      filters: filters,
      onFilter: (value, record) => record.product + record.product_type === value,
      render: (text, record) => {
        return <div><Text>{record.product}</Text> <Text type="secondary"> ({record.product_type})</Text></div>
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
        return (
          <div>
            {record.pay_status === "не оплачено" ? (
              <ExclamationCircleOutlined style={{ marginRight: "5px", color:"red"}} />
            ) : (
              <CheckCircleOutlined style={{ marginRight: "5px", color: "green"}} />
            )}
            <Text>{record.total.toLocaleString()} сум</Text>
          </div>
        );
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (text, row, index) => (
        <Select style={{ width: '160px', color: "#ff1438" }}
          defaultValue={row.status}
          onChange={(value) => handleStatusChange(value, row.id)}
        >
          <Select.Option value="в процессе"> <IconSet style={{ fontSize: 16, marginRight: 5, }} type="icon-progress"/> в процессе</Select.Option>
          <Select.Option value="доставлено"> <IconSet style={{ fontSize: 16, marginRight: 5 }} type="icon-truck-completed_fill"/> доставлено</Select.Option>
          <Select.Option value="готов к отгрузке"><IconSet style={{ fontSize: 16, marginRight: 7 }} type="icon-delivery_line"/>готов к отгрузке</Select.Option>
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
            onClick={() => showDeleteConfirm(row.id)}
            icon={<DeleteOutlined style={{ fontSize: "16px", color: "#ff4d4f" }} />}
            type="text"
          />
          <Space>
            <Button
              onClick={() => handleDelete(row.id)}
              icon={<EditOutlined style={{ fontSize: "16px", color: "black" }} />}
              type="text"
            />
          </Space>
        </Space>
      ),
    },
  ];

  // Handle order deletion
  const handleDelete = (id) => {
    deleteData(id);
  };

  // Handle order status change
  const handleStatusChange = async (value, id) => {
    const docRef = doc(db, "orders", id);
    const updateData = {
      status: value
    };

    updateDoc(docRef, updateData)
      .then(() => {
        message.success('Статус заказа успешно изменен');
      })
      .catch((error) => {
        message.error("Произошла ошибка при изменении статуса заказа");
        console.log(error);
      });
  };

  // Show confirmation modal for order deletion
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

  // Delete order from the database
  const deleteData = async (id) => {
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

  // Fetch orders data from Firestore
  const fetchPost = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
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
      };
    });
    setOrders(newData);
    setLocalData(newData); // Orders data from Firebase
    setLength(newData.length);
  };

  // Fetch product types for filtering
  useEffect(() => {
    getDocs(collection(db, "products")).then((snapshot) => {
      const products = snapshot.docs.map((doc) => doc.data());
      setFilters(products.map((product) => ({ text: product.name + "(" + product.type + ")", value: product.name + product.type })));

    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    fetchPost();
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

  return (
    <>
      {/* Add the "Delete All" button */}
      <Button
        type="danger"
        onClick={handleDeleteAll}
        disabled={selectedRowKeys.length === 0}
      >
        Delete All Selected
      </Button>
  
      {/* Add the table with checkboxes */}
      <Spin size="large" spinning={loading}>
        <Table
          rowKey={(record) => record.id}
          {...tableProps}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: onSelectChange,
          }}
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
