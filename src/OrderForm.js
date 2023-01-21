import React, { useState, useEffect } from 'react';
import './index.css';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Radio,Card, Cascader, Row, Col, Statistic, Option, InputNumber, Select, DatePicker, Button, Layout, Typography, message} from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const { Title } = Typography;


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

async function handlePost (datalist, makeprice, product_name,product_categ) {
  const timestamp = firebase.firestore.Timestamp.fromDate(new Date( datalist.date));
    const data = {
    date : timestamp,
    client : datalist.client,
    product: product_name,
    product_type : product_categ,
    quantity : datalist.quantity,
   price : makeprice,
    total : datalist.total,
    status : datalist.status,
    pay_status : datalist.pay_status
  
    };
    console.log(data)
    const res = await db.collection('orders').add(data, {merge:true}).then(() => {
      message.success('Заказ успешно добавлен в базу данных!');
    })
    .catch((error) => {
     message.error (error.message);
    });;
    
  }


function OrderForm () {
  
  const [orderlist, setOrderlist] = useState ({
    date : "",
    client : "", 
    product : "",
    product_type: "",
    quantity : 0,
    price : 0,
    total : 0,
    status : "",
    pay_status : "",
    pay_type : "",
    
  })
const [disabled, setDisabled] = useState(true);
const [options, setOptions] = useState([]);
const [product_name, SetProducName] = useState("")
const [product_categ, SetProducCateg] = useState("")
const [clientOptions, setClientOptions] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const productCategoriesRef = db.collection('product_categories');
      const productCategoriesSnapshot = await productCategoriesRef.get();
      const productCategories = productCategoriesSnapshot.docs.map(doc => doc.data());
        const nestedOptions = productCategories.reduce((acc, category) => {
        const parent = category.name;
        if (!acc[parent]) {
          acc[parent] = { value: parent, label: parent, children: [] };
        }
        //Fetching products now
        (async () => {
          const productsRef = db.collection('products');
          const productsSnapshot = await productsRef.get();
          const products = productsSnapshot.docs.map(doc => doc.data());
          const child = products.filter(product => product.type === parent)
          child.forEach(childOption => {
              acc[parent].children.push({ value: childOption.name, label: childOption.name });
          })
        })();
        return acc;
      }, {});
      Object.values(nestedOptions).forEach(parent => {
        parent.children.sort((a, b) => a.value.localeCompare(b.value));
      });
      setOptions(Object.values(nestedOptions));
      const customersRef = db.collection('customers');
const customersSnapshot = await customersRef.get();
const customers = customersSnapshot.docs.map(doc => doc.data());
const companyNames = customers.map(customer => {
    return { value: customer.companyName, label: customer.companyName };
});
setClientOptions(companyNames);
    };


    fetchData();
  }, []);





  
   const handleDate = (date, dateString) => {
     //console.log(dateString)
     setOrderlist ({...orderlist, date : dateString})
   //  console.log(orderlist.date)
    };

    const handleStatus = (e)=> {
      
      setOrderlist ({...orderlist, status : e.target.value})
      
    }



    const handleClient = (value) => {
        setOrderlist ({...orderlist, client : value})
    }

   async function  handleProduct (value) {
       console.log(value[0]) // sashet 
     
      let getprice = await fetchPrice(value)
  
   SetProducName(value[1])
    SetProducCateg(value[0])
     
       setOrderlist({...orderlist, price : getprice })
       console.log(orderlist.price)
    }



    async function fetchPrice(value) {
      const productsRef = db.collection("products");
      const query = productsRef.where("name", "==", value[1]).where("type", "==", value[0]);
      const querySnapshot = await query.get();
      const data = querySnapshot.docs[0].data();
     
      return data.price;
  }

    const handleAmount = (amount) => {
//console.log(amount)
//console.log(newprice)
     setOrderlist ({...orderlist, total : orderlist.price*amount*1000, quantity: amount});
     
    
       // console.log(orderlist.total)
    
            }



const handleSubmit =()=> {

  
console.log(orderlist.product)
const makeprice = orderlist.total / orderlist.quantity / 1000

 handlePost(orderlist,makeprice,product_name,product_categ)
}



const handlePaymentStatusChange = (e) => {
  setOrderlist ({...orderlist, pay_status : e.target.value})
}

const TotalCard = () => {
  return (
    <Card>

      <Statistic title="Итого"  value={orderlist.total.toLocaleString() + " сум"} />
    </Card>
  );
};




  return (
    <div>
   <Form
   labelCol={{ span: 4 }}
   wrapperCol={{ span: 14 }}
   layout="horizontal">
     <Title level={2}>Добавить заказ</Title>
  <Form.Item>
 
  </Form.Item>
  <Form.Item label="Выбрать дату">
          <DatePicker onChange={handleDate} />
          </Form.Item>
  <Form.Item label="Заказчик">
    <Select options={clientOptions}
          placeholder="Выбрать заказчика"
         onChange={handleClient}
          allowClear
        >
         

        </Select>
    </Form.Item>
 
  <Form.Item label="Продукт">
          <Cascader onChange={handleProduct} options={options}    />
        </Form.Item>
  <Form.Item label="Количество">
        <InputNumber onChange={handleAmount} />
</Form.Item>
<Form.Item label="Статус оплаты">
        <Radio.Group onChange={handlePaymentStatusChange} value={orderlist.pay_status}>
          <Radio value="оплачено">Оплачено</Radio>
          <Radio value="не оплачено">Не оплачено</Radio>
        </Radio.Group>
      </Form.Item>

        <Form.Item label="Статус заказа">
        <Radio.Group  onChange={handleStatus} defaultValue="a" buttonStyle="solid">
      <Radio.Button value="в процессе">В процессе</Radio.Button>
      <Radio.Button value="доставлено">Доставлено</Radio.Button>
      <Radio.Button value="готов к отгрузке">Готов к отгрузке</Radio.Button>
   
    </Radio.Group>
        </Form.Item>
   <Form.Item>
  
      
    
    </Form.Item>
    <Form.Item>
     <TotalCard></TotalCard>
     </Form.Item>
     <Button type="primary" onClick={handleSubmit}>Test</Button>
   </Form>
   </div>
  )
}

export default OrderForm ;