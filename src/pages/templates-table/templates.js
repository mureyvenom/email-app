import React, {useState} from 'react';
import './templates.css';
import DashBg from '../../components/dash-bg/dash-bg';
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { selectTemplates } from '../../redux/templates/templates.selector';
import { createStructuredSelector } from 'reselect';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import apiConnect from '../../api/connect';
import { setTemplates } from '../../redux/templates/templates.actions';

const TemplatesTable = ({templates, setTemplates, history, match}) => {
    const [formError, setFormError] = useState('');

    const handleDelete = async event => {
        const sure = window.confirm('This action cannot be undone, do you want to proceed?');
        try {            
            if(!sure){
                return;
            }
            setFormError('');
            const templateId = event.target.getAttribute('templateid');
            console.log('template_id', templateId);

            const fd = new FormData();
            fd.append('id', templateId);

            const response = await apiConnect.post('/deleteTemplate', fd);
            if(response.data.status === 'success'){
                const rp = await apiConnect.get('/getTemplates');
                if(rp.data.status === 'success'){
                    setTemplates(rp.data.templates);
                }
                window.alert('Template Deleted');
            }else{
                setFormError(response.data.message);
            }
        } catch (error) {
            console.log(error);
            setFormError('Something went wrong');
        }

    }
    
    return(
        <div className='templates-page'>
            <Container>
                <Row>
                    <Col md={12}>
                        <DashBg>
                            {
                                formError ?
                                <div className='alert-holder'>
                                    <Alert variant="danger">                                        
                                        {formError}                                        
                                    </Alert>
                                </div>
                                :
                                null
                            }
                            <Table bordered striped>
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Template Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        templates.map((template, i) => {
                                            return(
                                                <tr key={i}>
                                                    <td>{i+1}</td>
                                                    <td>{template.template_name}</td>
                                                    <td>
                                                        <Button templateid={template.id} onClick={() => history.push(`${match.url}/${template.id}`)} size='sm' variant='info'>Edit <FaPencilAlt  style={{fontSize: 12, marginTop: -4}} /></Button>
                                                        {' '}
                                                        <Button templateid={template.id} onClick={handleDelete} size='sm' variant='danger'>Delete <FaTrash   style={{fontSize: 12, marginTop: -4}} /></Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </DashBg>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    templates: selectTemplates,
});

const mapDispatchToProps = dispatch => ({
    setTemplates: templates => dispatch(setTemplates(templates))
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesTable);