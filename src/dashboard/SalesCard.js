import React, { useState, useEffect } from 'react';
import { Card , Statistic} from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

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


const SalesCard = () => {
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [previousMonthSales, setPreviousMonthSales] = useState(0);

  useEffect(() => {
     // Get current month and previous month
     var currentYear = new Date().getFullYear();
     var currentMonth = new Date().getMonth();
     var previousMonth;
     var previousYear;
     if (currentMonth === 0) {
         previousMonth = 11;
         previousYear = currentYear - 1;
     } else {
         previousMonth = currentMonth - 1;
         previousYear = currentYear;
     }
 
     var startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
     var startOfPreviousMonth = new Date(previousYear, previousMonth, 1);
     var endOfPreviousMonth = new Date(previousYear, previousMonth, new Date(previousYear, previousMonth+1, 0).getDate());
 
     var currentMonthRef = db.collection("orders").where("date", ">=", firebase.firestore.Timestamp.fromDate(startOfCurrentMonth));
     var previousMonthRef = db.collection("orders").where("date", ">=", firebase.firestore.Timestamp.fromDate(startOfPreviousMonth)).where("date","<=", firebase.firestore.Timestamp.fromDate(endOfPreviousMonth));
 
     // Get sales data for current month
     currentMonthRef.get().then(function(querySnapshot) {
     var total = 0;
     querySnapshot.forEach(function(doc) {
         total += doc.data().total;
     });
     setCurrentMonthSales(total);
     });
 
     // Get sales data for previous month
     previousMonthRef.get().then(function(querySnapshot) {
     var total = 0;
     querySnapshot.forEach(function(doc) {
         total += doc.data().total;
     });
     setPreviousMonthSales(total);
     });
  }, []);

  // Calculate sales growth
  let salesGrowth = ((currentMonthSales - previousMonthSales) / previousMonthSales * 100).toFixed(2)
  
  if(isNaN(salesGrowth)){
      salesGrowth = 0;
  }
  return (
      <Card title="Обьем продаж" bordered={false}  >
       <Statistic style={{fontWeight : "600"}} title="Этот месяц:" value={currentMonthSales.toLocaleString("en-US")+" сум"}  />
       <Statistic style={{fontWeight : "300", fontSize: 8}}
          
            value={salesGrowth + "%"}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined size={2} />}
            suffix="%"
          />
          <p>Прошлый месяц: {previousMonthSales.toLocaleString("en-US")+" сум"}</p>
          
      </Card>
  );
};

export default SalesCard;