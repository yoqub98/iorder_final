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
    const [data, setData] = useState(null);
  
    useEffect(() => {
     
      const ordersRef = db.collection('orders');
      const currentDate = moment();
      const sixMonthsAgo = moment().subtract(6, 'months');
  
      const salesByMonth = {};
  
      ordersRef
        .where('date', '>=', sixMonthsAgo.toDate())
        .where('date', '<=', currentDate.toDate())
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            const order = doc.data();
            const date = moment(order.date);
            const month = date.format('MMMM YYYY');
  
            if (!salesByMonth[month]) {
              salesByMonth[month] = 0;
            }
  
            salesByMonth[month] += order.total;
          });
  
          const labels = Object.keys(salesByMonth);
          const values = Object.values(salesByMonth);
  
          setData({
            labels,
            datasets: [
              {
                label: 'Sales',
                data: values,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
              },
            ],
          });
        });
    }, []);
  
    const options = {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              month: 'MMM YYYY'
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Sales'
          }
        }]
      }
    };
  
    if (!data) {
      return (
        <Card>
          <Spin />
        </Card>
      );
    }
  
    return (
      <Card>
        <Line data={data} options={options}/>
      </Card>
    );
  };

  export default SalesGraph 
