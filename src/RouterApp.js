import { BarsOutlined, CodeSandboxOutlined,PlusSquareOutlined, FileAddOutlined, DashboardOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import Icon from '@ant-design/icons/lib/components/Icon';
import { Layout, Menu, Badge } from 'antd';
import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, useLocation } from 'react-router-dom';
import ActiveOrders from './active_orders/ActiveOrders';
import Inventory from './Inventory';
import OrderForm from './OrderForm'; 
import AddProduct from './AddProduct';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Dashboard from './dashboard/Dashboard';
import AddCustomer
 from './AddCustomer';
const { Header, Content, Footer, Sider } = Layout;
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

class RouterApp extends Component {
   state = {
      collapsed: false,
      outOfStock: false
        };

   componentDidMount() {
      db.collection('inventory').onSnapshot((snapshot) => {
             snapshot.docs.forEach((doc) => {
               if (doc.data().quantity === 0) {
                 this.setState({outOfStock: true});
                 return; // once you find one item with quantity 0, you don't have to continue the loop
               }
             });
           });
        }
  

   onCollapse = collapsed => {
      this.setState({ collapsed });
   };
   toggle = () => {
      this.setState({
         collapsed: !this.state.collapsed,
      });
   };



   render() {
      return (
         <Router>
            <Layout style={{ minHeight: '100vh' }}>
               <Sider
                  collapsible
                  collapsed={this.state.collapsed}
                  onCollapse={this.onCollapse}
               >
             
                  <div className='logo' />
                  <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
                     <Menu.Item key='1'>
                        <FileAddOutlined style={{ fontSize: '18px' }} />
                        <span>Добавить заказ</span>

                        <Link to='/' />
                     </Menu.Item>
                     <Menu.Item key='2'>
                        <BarsOutlined style={{ fontSize: '18px' }} />
                        <span>Активные заказы</span>
                        <Link to='/active_orders' />
                     </Menu.Item>
                    
                     <Menu.Item key='3'>
                        
                        <CodeSandboxOutlined style={{ fontSize: '18px' }} />
                        <span>Инвентарь</span>
                        <Badge style={{backgroundColor: 'red'}} dot={this.state.outOfStock}/>
                        <Link to='/inventory' />
                     </Menu.Item>
                   
                     <Menu.Item key='4'>
                     <PlusSquareOutlined  style={{ fontSize: '18px' }} />
                        <span>Добавить продукт</span>
                        <Link to='/addproduct' />
                     </Menu.Item>
                     <Menu.Item key='6'>
                        <UsergroupAddOutlined style={{ fontSize: '18px' }} />
                        <span>Добавить клиента</span>

                        <Link to='/add_customer' />
                     </Menu.Item>
                     <Menu.Item key='5'>
                        <DashboardOutlined style={{ fontSize: '18px' }} />
                        <span>Dashboard</span>

                        <Link to='/dashboard' />
                     </Menu.Item>
                  </Menu>
               </Sider>
               <Layout>
                  <Header style={{ background: '#fff', padding: 0, paddingLeft: 16 }}>
                     <Icon
                        className='trigger'
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        style={{ cursor: 'pointer' }}
                        onClick={this.toggle}
                     />
                  </Header>
                  <Content
                     style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#fff',
                        minHeight: 280,
                     }}
                  >
                     <Routes>
                        <Route exact path='/' element={<OrderForm />} />
                        <Route path='/active_orders' element={<ActiveOrders />} />
                        <Route path='/inventory' element={<Inventory />} />
                        <Route path='/addproduct' element={<AddProduct />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/add_customer' element={<AddCustomer />} />
                     </Routes>
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>OrderIt</Footer>
               </Layout>
            </Layout>
         </Router>
      );
   }
}

export default RouterApp;
