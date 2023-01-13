import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Spin, Card } from 'antd';
import moment from 'moment';
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






  const SalesGraph = () => {
   
    const [period, setPeriod] = useState([]);

  
    useEffect(() => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let periodList = Array(6).fill('');
      let salesList = Array(6).fill(0);
      const currentDate = new Date();
      let monthIndex = currentDate.getMonth();
      let year = currentDate.getFullYear();
      for (let i = 0; i < 6; i++) {
        periodList[i] = `${months[monthIndex]} ${year}`;
        monthIndex -= 1;
        if (monthIndex < 0) {
          monthIndex = 11;
          year -= 1;
        }
      }
      db
        .collection('orders')
        .orderBy('date', 'desc')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const order = doc.data();
            const orderDate = new Date(order.date.seconds * 1000);
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();
           
              const periodIndex = 6 - (monthIndex - orderMonth) - 1;
             
            
          });
          setPeriod(periodList);
         
          console.log(salesList)
          
        });
    }, [db]);
  
    return (
      <Card title="Order Summary">
        <p>Period: {period.join(', ')}</p>
       
      </Card>
    );
  };
  
   

  


  export default SalesGraph 
