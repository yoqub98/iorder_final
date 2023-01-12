import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
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


const SalesCard = () => {
   // Get current and previous month in the format 'YYYY-MM'
   const current = new Date();
const currentMonth = current.toISOString().slice(0, 7);
let previousMonth = new Date(current);
previousMonth.setUTCMonth(current.getUTCMonth()-1);
previousMonth = previousMonth.toISOString().slice(0, 7);
 
   // Get total sales for current month and previous month
   const [currentSales, setCurrentSales] = useState(0);
   const [previousSales, setPreviousSales] = useState(0);
 
   useEffect(() => {
     db.collection('orders')
       .where('date', '>=', `${currentMonth}-01T00:00:00`)
       .where('date', '<=', `${currentMonth}-31T23:59:59`)
       .get()
       .then(snapshot => {
         let total = 0;
         snapshot.forEach(doc => {
           total += doc.data().total;
         });
         setCurrentSales(total);
       })
       .catch(error => {
         console.error('Error getting current month sales: ', error);
       });
   }, [ [currentMonth]]);
 
   useEffect(() => {
    let total = 0;
    db.collection('orders')
       .where('date', '>=', `${previousMonth}-01T00:00:00`)
       .where('date', '<=', `${previousMonth}-31T23:59:59`)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          total += doc.data().total;
        });
        setPreviousSales(total);
      })
      .catch(error => {
        console.error('Error getting previous month sales: ', error);
      });
  }, []);
 
   // Calculate the sales growth compared to previous month
   let salesGrowth;
   if (previousSales === 0) {
     salesGrowth = 'NA';
   } else {
     salesGrowth = ((currentSales - previousSales) / previousSales) * 100;
   }
 
   return (
     <Card>
       <p>Current Month Sales: {currentSales}</p>
       <p>Previous Month Sales: {previousSales}</p>
       <p>Sales Growth: {salesGrowth}%</p>
     </Card>
   );
}
export default SalesCard;