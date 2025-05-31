import { Col, Layout, Row } from 'antd';
const { Footer } = Layout;

const footer = () => {
  return (
    <Footer className="footer" style={{ zIndex: 1000 }}>
      <Row>
        <Col span={24} style={{ margin: 0, textAlign: 'center' }}>
          <h4 style={{ margin: 0, alignItems: 'center' }}>سایت یادبودها یادآور تمام خاطرات خانواده</h4>
        </Col>
      </Row>
    </Footer>
  );
};

export default footer;
