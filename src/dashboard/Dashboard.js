import React from "react";
import { useState } from "react";
import { Card } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import SalesCard from "./SalesCard";
import SalesData from "./SalesGraph";
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
  

const Dashboard =()=> {

   return ( 
    <div>
   <SalesCard/> 
   <SalesData/>
   </div>
   )


}
export default Dashboard; 