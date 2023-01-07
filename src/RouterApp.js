import { BarsOutlined, CodeSandboxOutlined, FileAddOutlined } from '@ant-design/icons';

import Icon from '@ant-design/icons/lib/components/Icon';
import { Layout, Menu } from 'antd';
import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ActiveOrders from './active_orders/ActiveOrders';
import Inventory from './Inventory';
import OrderForm from './OrderForm';

const { Header, Content, Footer, Sider } = Layout;


class RouterApp extends Component {
   state = {
      collapsed: false,
   };

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
                        <Link to='/inventory' />
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
