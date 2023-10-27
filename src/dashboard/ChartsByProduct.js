import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Pie } from 'react-chartjs-2';

const firebaseConfig = {
    apiKey: "AIzaSyCEsm2uX4Ott4vxlH-K_p25xnYPShXv6FI",
    authDomain: "biflow-efa49.firebaseapp.com",
    databaseURL: "https://biflow-efa49-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "biflow-efa49",
    storageBucket: "biflow-efa49.appspot.com",
    messagingSenderId: "257343919180",
    appId: "1:257343919180:web:ffaa88ed28958ff04c90e9",
    measurementId: "G-89DK3S524X"// Your Firebase config here
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ChartByProduct = () => {
  const [productCategoryData, setProductCategoryData] = useState({});
  const [productData, setProductData] = useState({});

  useEffect(() => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    // Function to group orders by a specific field (product_category or product)
    const groupOrders = (field) => {
      db.collection("orders")
        .where("date", ">=", sixMonthsAgo)
        .where("date", "<=", currentDate)
        .get()
        .then((querySnapshot) => {
          const data = {};
          querySnapshot.forEach((doc) => {
            const fieldValue = doc.data()[field];
            data[fieldValue] = (data[fieldValue] || 0) + doc.data().price;
          });
          if (field === "product_category") {
            setProductCategoryData(data);
          } else if (field === "product") {
            setProductData(data);
          }
        });
    };

    // Fetch and group data by product_category and product
    groupOrders("product_category");
    groupOrders("product");
  }, []);

  return (
    <Card
      bordered={false}
      style={{ width: '500' }}
      headStyle={{ borderColor: '#1890ff', borderWidth: 1.5, backgroundColor: '#fafafa' }}
      title="Sales Data for the Last 6 Months"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <Pie
            data={{
              labels: Object.keys(productCategoryData),
              datasets: [
                {
                  data: Object.values(productCategoryData),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5',
                    'rgba(255, 206, 86, 0.5',
                    // Add more colors as needed
                  ],
                },
              ],
            }}
          />
          <h3>Product Categories</h3>
        </div>
        <div style={{ width: '48%' }}>
          <Pie
            data={{
              labels: Object.keys(productData),
              datasets: [
                {
                  data: Object.values(productData),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5',
                    'rgba(255, 206, 86, 0.5',
                    // Add more colors as needed
                  ],
                },
              ],
            }}
          />
          <h3>Products</h3>
        </div>
      </div>
    </Card>
  );
};


export default ChartByProduct;