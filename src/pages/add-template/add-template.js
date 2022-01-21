import React, {Component} from 'react';
import './add-template.css';
import DashBg from '../../components/dash-bg/dash-bg';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import CustomButton from '../../components/custom-button/custom-button';
import CustomInput from '../../components/custom-input/custom-input';
import { FaPlus } from 'react-icons/fa';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import { EditorState, ContentState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import {stateToHTML} from 'draft-js-export-html';
import apiConnect from '../../api/connect';
import { connect } from 'react-redux';
import { setTemplates } from '../../redux/templates/templates.actions';


class AddTemplatePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            template_name: '',
            mail_subject: '',
            sender_name: '',
            sender_email: '',
            mail_body: '',
            html_mail_body: '',
            attachment_names: [],
            attachment_names_value: [],
            attachments: [],
            attachments_value: [],
            input_field_count: 0,
            formError: '',
            formSuccess: false,
            isLoading: false
        }
    }

    handleChange = event => {
        const {value, name} = event.target;
        this.setState({[name]: value});
    }

    handleFileChange = event => {
        const uploadKey = event.target.getAttribute('uploadkey');
        const fileData = event.target.files[0];
        const currentFileData = [...this.state.attachments_value];
        currentFileData[uploadKey] = fileData;
        this.setState({
            attachments_value: currentFileData
        })
    }

    handleAttachName = event => {
        const uploadKey = event.target.getAttribute('uploadkey');
        const {value} = event.target;
        const newNames = [...this.state.attachment_names_value];
        newNames[uploadKey] = value;
        this.setState({
            attachment_names_value: newNames
        })
    }

    onEditorStateChange = (editorState) => {
        const htmlFied = stateToHTML(editorState.getCurrentContent());
        this.setState({
          mail_body: editorState,
          html_mail_body: htmlFied
        });
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({
            ...this.state,
            formError: '',
            formSuccess: false,
            isLoading: true
        });
        try {
            const { template_name, mail_subject, sender_name, sender_email, html_mail_body, attachment_names_value, attachments_value } = this.state;
            if(!template_name || !mail_subject || !sender_name || !sender_email || !html_mail_body ){
                this.setState({
                    formError: 'Template name, mail subject, sender name, sender email, mail body are all required to proceed'
                });
                return;
            }

            const fd = new FormData();
            fd.append('template_name', template_name);
            fd.append('mail_subject', mail_subject);
            fd.append('sender_name', sender_name);
            fd.append('sender_email', sender_email);
            fd.append('mail_body', html_mail_body);

            if(attachment_names_value.length > 0){
                for(let i=0; i<attachment_names_value.length; i++){
                    fd.append('attachment_name[]', attachment_names_value[i]);
                }                
            }

            if(attachments_value.length > 0){
                for(let ii=0; ii<attachments_value.length; ii++){
                    fd.append('attach[]', attachments_value[ii]);
                }                
            }

            const response = await apiConnect.post('/doTemplate', fd, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            if(response.data.status === 'success'){
                this.setState({
                    ...this.state,
                    isLoading: false,
                    formSuccess: true,
                    template_name: '',
                    mail_subject: '',
                    sender_name: '',
                    sender_email: '',
                    mail_body: '',
                    html_mail_body: '',
                    attachment_names: [],
                    attachment_names_value: [],
                    attachments: [],
                    attachments_value: [],
                    input_field_count: 0,
                });
                const rp = await apiConnect.get('/getTemplates');
                if(rp.data.status === 'success'){
                    this.props.setTemplates(rp.data.templates);
                }
            }else{
                this.setState({
                    ...this.state,
                    formError: response.data.message,
                    isLoading: false
                });
            }

        } catch (error) {
            console.log(error);
            this.setState({
                ...this.state,
                formError: 'Something went wrong',
                isLoading: false
            })
        }
    }

    render() {        
        return(
            <div className='add-template'>
                <Container>
                    <Row>
                        <Col md={12}>
                            <DashBg>
                                {
                                    this.state.formError ?
                                    <p style={{textAlign: 'center'}}>
                                        <Alert variant="danger">                                        
                                            {this.state.formError}                                        
                                        </Alert>
                                    </p>
                                    :
                                    null
                                }
                                {
                                    this.state.formSuccess ?
                                    <p style={{textAlign: 'center'}}>
                                        <Alert variant="success">                                        
                                            Template successfully added                                        
                                        </Alert>
                                    </p>
                                    :
                                    null
                                }
                                <form onSubmit={this.handleSubmit}>
                                    <CustomInput name='template_name' placeholder='Template name' type='text' required label='Template name' value={this.state.template_name}  handleChange={this.handleChange} />
                                    <CustomInput name='mail_subject' placeholder='Mail Subject' type='text' required label='Mail Subject' value={this.state.mail_subject} handleChange={this.handleChange} />
                                    <CustomInput name='sender_name' placeholder='Sender name' type='text' required label='Sender name' value={this.state.sender_name} handleChange={this.handleChange} />
                                    <CustomInput name='sender_email' placeholder='Sender email' type='email' required label='Sender email' value={this.state.sender_email} handleChange={this.handleChange} />
                                   {
                                       this.state.attachment_names.map((name, i) => {
                                           return(
                                            <div key={i}>
                                                <Row>
                                                    <Col md={6}>
                                                        <div className='form-group'>
                                                            <CustomInput name='attachment_name' 
                                                            value={this.state.attachment_names_value[i]} 
                                                            uploadkey={i} handleChange={this.handleAttachName} id={`${name}`} required type='text' placeholder='Attachment name' label='Attachment name'/>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className='form-group'>
                                                            <CustomInput name='attachment' 
                                                            // value={this.state.attachments_value[i]} 
                                                            uploadkey={i} id={`attachments_${i}`} handleChange={this.handleFileChange} type='file' required placeholder='Sender email' label='Attachment'/>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                           )
                                       })
                                   }
                                    <div className='form-group'>
                                        <Button onClick={() => {
                                            const currentCount = this.state.input_field_count + 1;
                                            const currentAttachNames = this.state.attachment_names;
                                            const currentAttachNamesValue = [...this.state.attachment_names_value] ;
                                            const currentAttachments = this.state.attachments;
                                            const currentAttachmentsValue = [...this.state.attachments_value];
                                            currentAttachNames.push(`attachment_name_${currentCount}`);
                                            currentAttachments.push(`attachments_${currentCount}`);
                                            currentAttachNamesValue.push('');
                                            currentAttachmentsValue.push('');
                                            this.setState({
                                                ...this.state,
                                                input_field_count: this.state.input_field_count + 1,
                                                attachment_names: currentAttachNames,
                                                attachments: currentAttachments,
                                                attachment_names_value: currentAttachNamesValue,
                                                attachments_value: currentAttachmentsValue
                                            })
                                        }} variant='info' size='sm'><FaPlus style={{fontSize: 12, marginTop: -4}} /> Add attachment</Button>
                                    </div>
                                    <div className='form-group'>
                                        <Editor
                                        editorState={this.state.mail_body}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorStyle={{height: '300px', borderWidth: 2, borderColor: '#ccc', borderStyle: 'solid', marginBottom: 20}}
                                        onEditorStateChange={this.onEditorStateChange}
                                        />
                                    </div>
                                    <CustomButton type='submit' displayText={
                                    <span>Save Template {this.state.isLoading ? <Spinner animation="border" size="sm" /> : null}</span>
                                    } />
                                </form>
                            </DashBg>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setTemplates: () =>  dispatch(setTemplates())
})

export default connect(null, mapDispatchToProps)(AddTemplatePage);