//Import Statements
import { Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//Card Module Component
const CardModule = (props: any) => {
    return (
        <Col xs={12} sm={12} md={6} lg={6} xl={3} className='mb-4'>
            <Card>
                <Card.Header className='cardhead ps-5 pt-4'>
                    <p className='display-6 fw-bold'>{props.heading}</p>
                    <p className='display-1'>{props.heading1}</p>
                </Card.Header>
                <Card.Body className='ps-5 pe-5 cardtext'>
                    {props.body1}<br />
                    {props.body2}<br />
                    {props.body3}
                </Card.Body>
                <Card.Footer className='pt-4' style={{ display: props.link ? 'block' : 'none' }}>
                    <Link to={props.link ? props.link : ''} className='mt-auto btn btnbox'>Launch Instance<i className="fa-solid fa-arrow-right-long"></i></Link>
                </Card.Footer>
            </Card>
        </Col>
    )
}

//Export Statement
export default CardModule