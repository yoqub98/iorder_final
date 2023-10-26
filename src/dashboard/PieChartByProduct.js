import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import { Pie } from 'react-chartjs-2';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const { Option } = Select;

const PieChartByProduct = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1month');
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);

  const data = {
    labels: [],
    datasets: [
      {
        label: 'Dataset 1',
        data: [], // This will be populated with actual data
        backgroundColor: [], // This will be populated with actual data
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Pie Chart',
      },
    },
  };

  useEffect(() => {

    const calculateStartDate = (selectedPeriod) => {
        const currentDate = new Date();
      
        switch (selectedPeriod) {
          case '1month':
            const oneMonthAgo = new Date(currentDate);
            oneMonthAgo.setMonth(currentDate.getMonth() - 1);
            return oneMonthAgo;
      
          case '1week':
            const oneWeekAgo = new Date(currentDate);
            oneWeekAgo.setDate(currentDate.getDate() - 7);
            return oneWeekAgo;
      
          case '1year':
            const oneYearAgo = new Date(currentDate);
            oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
            return oneYearAgo;
      
          default:
            return currentDate;
        }
      };
      
      // Utility function to generate random colors for the chart
      const generateRandomColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
          const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
          colors.push(randomColor);
        }
        return colors;
      };

    // Fetch your Firestore data and update the 'data' object with your actual data
    const fetchData = async () => {
      const startDate = calculateStartDate(selectedPeriod);
      const querySnapshot = await firebase.firestore().collection('orders')
        .where('date', '>=', startDate)
        .get();

      const categoryCounts = {};
      const productCounts = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const productCategory = data.product_category;
        const product = data.product;

        categoryCounts[productCategory] = (categoryCounts[productCategory] || 0) + 1;
        productCounts[product] = (productCounts[product] || 0) + 1;
      });

      // Update the 'data' object with your actual data
      data.labels = Object.keys(categoryCounts);
      data.datasets[0].data = Object.values(categoryCounts);
      data.datasets[0].backgroundColor = generateRandomColors(data.labels.length);

      setCategoryData(Object.values(categoryCounts));
      setProductData(Object.values(productCounts));
    };

    fetchData();
  }, [selectedPeriod]);

  const handleRandomize = () => {
    // Randomize the data
    const randomizedData = data.datasets[0].data.map(() =>
      Math.floor(Math.random() * 100)
    );
    data.datasets[0].data = randomizedData;
    setCategoryData([...randomizedData]);
    setProductData([...randomizedData]);
  };

  return (
    <div>
      <Select value={selectedPeriod} onChange={setSelectedPeriod}>
        <Option value="1month">1 Month</Option>
        <Option value="1week">1 Week</Option>
        <Option value="1year">1 Year</Option>
      </Select>
      <Button onClick={handleRandomize}>Randomize Data</Button>
      <div>
        <Pie data={data} options={options} />
      </div>
      <div>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChartByProduct;
