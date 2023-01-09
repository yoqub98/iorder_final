import { Card, Col, Row } from 'antd';
import './product_card_styling.css';
const Product_types = (props) => {
  const { data } = props;

  return (
    <Row gutter={16}>
      {data.map((item) => (
        <Col key={item.id} span={8} >
          <Card  bordered={false}  type="inner" title={item.name}>
           Цена : {item.price} сум/шт</Card>
        </Col>
      ))}
    </Row>
  );
};

export default Product_types;
