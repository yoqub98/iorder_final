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






class SalesGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            period: [],
            sales: []
        };
    }

    componentDidMount() {
       
        db.collection('orders').get().then((querySnapshot) => {
            const orders = [];
            querySnapshot.forEach((doc) => {
                orders.push(doc.data());
            });

            // Process the orders data to create the period and sales lists
            const period = [];
            const sales = [];

            const currentDate = new Date();
            for (let i = 0; i < 6; i++) {
                const month = currentDate.getMonth() - i;
                const year = currentDate.getFullYear();
                if (month < 0) {
                    period.push(`${12 + month}/${year - 1}`);
                } else {
                    period.push(`${month}/${year}`);
                }
            }

            period.forEach(month => {
                const filteredOrders = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate.getMonth() === Number(month.split('/')[0]) && orderDate.getFullYear() === Number(month.split('/')[1]);
                });

                sales.push({
                    month: month,
                    total: filteredOrders.reduce((acc, order) => acc + order.total, 0)
                });
            });

            this.setState({
                orders: orders,
                period: period,
                sales: sales
            });
        });
    }

    render() {
        return (
            <div>
    Sales:
    {this.state.sales.map((sale, index) => (
        <div key={index}>
            Month: {sale.month}, Total: {sale.total}
        </div>
    ))}
</div>
        );
    }
}



  export default SalesGraph 
