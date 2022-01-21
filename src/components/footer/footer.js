import React from 'react';
import './footer.css';
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
    return(
        <div className='footer'>
            <Container>
                <Row>
                    <Col className='align-right'>
                        <p className="version">Version 1.1.0</p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Footer;