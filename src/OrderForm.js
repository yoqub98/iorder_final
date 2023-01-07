import React, { useState } from 'react';
import './index.css';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Radio,Card, Cascader, Row, Col, Statistic, Option, InputNumber, Select, DatePicker, Button, Layout, Typography} from 'antd';
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

async function handlePost (datalist) {

    const data = {
     date : datalist.date,
    client : datalist.client,
    product: datalist.product,
    product_type : datalist.product_type,
    quantity : datalist.quantity,
   price : datalist.price,
    total : datalist.total,
    status : datalist.status,
    pay_status : datalist.pay_status
  
    };
    console.log(data)
    const res = await db.collection('orders').add(data, {merge:true});
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
    pay_status : ""
    
  })
  const [disabled, setDisabled] = useState(true);

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

    const handleProduct = (value) => {
     

console.log(value[0])
        
        if (value[1]==="Сашет-бел") {
         
         setOrderlist ({...orderlist, price : 140000, product: value[1], product_type: value[0]})
                
        }
           else if (value[1]==="Стик-бел") {
          
           setOrderlist ({...orderlist, price : 140000, product: value[1],product_type: value[0] }) 
        }
        else if (value[1]==="Сашет-корч") {
          
          setOrderlist ({...orderlist, price : 320000, product: value[1],product_type: value[0] }) 
       }
       else if (value[1]==="Стик-корч") {
          
        setOrderlist ({...orderlist, price : 320000, product: value[1],product_type: value[0] }) 
     }


        else if (value[0]==="Соль") {
         
          setOrderlist ({...orderlist, price : 45000, product: value[1], product_type: value[0]}) 

        }
    }

    const handleAmount = (amount) => {

     setOrderlist ({...orderlist, total : orderlist.price*amount, quantity: amount});
        
       // console.log(orderlist.total)
    
            }



const handleSubmit =()=> {


console.log(orderlist)

 handlePost(orderlist)
}

const handleProducttype = ( value) => {
  setOrderlist ({...orderlist, product: value});
}

const handlePaymentStatusChange = (e) => {
  setOrderlist ({...orderlist, pay_status : e.target.value})
}

const TotalCard = () => {
  return (
    <Card>

      <Statistic title="Итого"  value={orderlist.total} />
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
    <Select 
          placeholder="Выбрать заказчика"
         onChange={handleClient}
          allowClear
        >
          <Select.Option value="Les Ailes">Les Ailes</Select.Option>
          <Select.Option value="Lotte Hotel">Lotte Hotel</Select.Option>
          <Select.Option value="Baskin Robbins">Baskin Robbins</Select.Option>
          <Select.Option value="Big Burger">Big Burger</Select.Option>
          <Select.Option value="Chopar">Chopar</Select.Option>
        </Select>
    </Form.Item>
 
  <Form.Item label="Продукт">
          <Cascader onChange={handleProduct}
            options={[
              {
                value: 'Сахар',
                label: 'Сахар',
                children: [
                    {
                        value: 'Стик-бел',
                        label: 'Стик-бел',
                          },
                          {
                            value: 'Стик-корч',
                            label: 'Стик-корч',
                              },
                          {
                            value: 'Сашет-бел',
                            label: 'Сашет-бел',
                              },
                              {
                                value: 'Сашет-корч',
                                label: 'Сашет-корч',
                                  },
                ],
              },
              {
                value: 'Соль',
                label: 'Соль',
                children: [
                        {
                        value: 'Сашет',
                        label: 'Сашет',
                          },
                ],
              },
            ]}
          />
        </Form.Item>
  <Form.Item label="Количество">
        <InputNumber onChange={handleAmount} />
</Form.Item>
<Form.Item label="Статус оплаты">
        <Radio.Group onChange={handlePaymentStatusChange} value={orderlist.pay_status}>
          <Radio value="paid">Оплачено</Radio>
          <Radio value="pending">Не оплачено</Radio>
        </Radio.Group>
      </Form.Item>

        <Form.Item label="Статус заказа">
        <Radio.Group  onChange={handleStatus} defaultValue="a" buttonStyle="solid">
      <Radio.Button value="in progress">В процессе</Radio.Button>
      <Radio.Button value="delivered">Доставлено</Radio.Button>
      <Radio.Button value="ready to ship">Готов к отгрузке</Radio.Button>
   
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