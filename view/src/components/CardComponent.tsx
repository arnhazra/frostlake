//Import Statements
import { Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//Card Component Component
const CardComponent = (props: any) => {
    return (
        <Col xs={12} sm={12} md={6} lg={6} xl={4} className='mb-4'>
            <Card>
                <Card.Header className='cardhead ps-5 pt-4'>
                    <p className='display-6 fw-bold'>{props.heading}</p>
                </Card.Header>
                <Card.Body className='ps-5 pe-5 cardtext'>
                    {props.body1}<br />
                    {props.body2}<br />
                    {props.body3}<br />
                </Card.Body>
                <Card.Footer className='pt-4'>
                    <Link to={props.link ? props.link : ''} className='mt-auto btn'>Open Workspace<i className="fa-solid fa-circle-arrow-right"></i></Link>
                </Card.Footer>
            </Card>
        </Col>
    )
}

//Export Statement
export default CardComponent