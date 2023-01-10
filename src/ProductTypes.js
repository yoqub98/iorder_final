import { Card, Col, Row, } from 'antd';
import './product_card_styling.css';
const { Meta } = Card;
const Product_types = (props) => {
  const { data } = props;

  return (
    <Row gutter={16}>
      {data.map((item) => (
        <Col key={item.id} span={8} >
          <Card style={{ marginBottom: '18px' }} bordered={false} headStyle={{ borderColor: '#1890ff' , borderWidth: 1.5, backgroundColor: '#fafafa'}} type="inner" title={item.name}>
           Цена : {item.price} сум/шт
           <Meta style={{ marginTop: '12px' }} description={item.type}>
           
           </Meta></Card>
        </Col>
      ))}
    </Row>
  );
};

export default Product_types;
