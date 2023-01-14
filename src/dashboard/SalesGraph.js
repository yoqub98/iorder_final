import React, { useState, useEffect } from 'react';

import { Card } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);







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







  const SalesData = () => {
    const [period, setPeriod] = useState([]);
    const [sales, setSales] = useState([]) 
   const [labels, setLabels] = useState([])
const [salesData, setSalesData] = useState([])
  
  useEffect(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let periodList = Array(6).fill('');
    let salesList = Array(6).fill(0);
    const currentDate = new Date();
    let monthIndex = currentDate.getMonth();
    let year = currentDate.getFullYear();
  
    for (let i = 0; i < 6; i++) {
      periodList[i] = `${months[monthIndex]} ${year}`;
      const startOfMonth = new Date(year, monthIndex, 1);
      const endOfMonth = new Date(year, monthIndex + 1, 0);
      db.collection("orders")
        .where("date", ">=", startOfMonth)
        .where("date", "<", endOfMonth)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            salesList[i] += doc.data().total;
          });
          const reversedPeriod = periodList.slice().reverse();
          const reversedSales = salesList.slice().reverse();
          setPeriod(reversedPeriod);
          setLabels(reversedPeriod);
          setSales(reversedSales);
          setSalesData(reversedSales);
    
        });
      monthIndex -= 1;
      if (monthIndex < 0) {
        monthIndex = 11;
        year -= 1;
      }
    }
    
  }, []);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
   
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
    scales: {
      yAxes: [{
        ticks: {
         
          beginAtZero: true,
        },
      }],
      xAxes: [{
        ticks: {
         
          beginAtZero: true,
        },
      }],
    },
   
    legend: {
      display: true
    },
   
    elements: {
      line: {
        tension:0.3, // Bezier curve tension of the line. Set to 0 for no bezier curves.
      },
    },
  };
  
  
    const data = {
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: salesData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
       
      ],
    };





    return (
      <Card bordered={false}  style={{width:'500'}}  headStyle={{ borderColor: '#1890ff' , borderWidth: 1.5, backgroundColor: '#fafafa'}}  title="Продажи за последние 6 месяцев">
     
       <Line options={options} data={data} />
      
      </Card>
    );
  };
  
   

  


  export default SalesData 
