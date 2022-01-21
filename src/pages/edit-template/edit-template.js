import React, { Component } from 'react';
import './edit-template.css';
import DashBg from '../../components/dash-bg/dash-bg';
import { Container, Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState } from 'draft-js';
import CustomInput from '../../components/custom-input/custom-input';
import CustomButton from '../../components/custom-button/custom-button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import htmlToDraft from 'html-to-draftjs';
import {stateToHTML} from 'draft-js-export-html';
import apiConnect from '../../api/connect';
import { selectTemplates } from '../../redux/templates/templates.selector';
import { setTemplates } from '../../redux/templates/templates.actions'

class EditTemplatePage extends Component {
    constructor(props){
        super(props);
        this.state ={
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
            isLoading: false,
            existing_attachments: [],
            template_set: false,
            templateId: ''
        }
    }

    componentDidMount(){
        const {templateId} = this.props.match.params;
        const template = this.props.templates.find(template => template.id === templateId); 
        this.setState({
            template_set: false
        })

        if(!template){
            this.setState({
                ...this.state,
                formError: 'No template found',
                template_set: true
            })
            return;
        }

        if(!template.mail_body){
            const htmlBlock = htmlToDraft('');
            const htmlState = ContentState.createFromBlockArray(htmlBlock.contentBlocks);
            const editorState = EditorState.createWithContent(htmlState);

            this.setState({
                ...this.state,
                template_name: template.template_name,
                mail_subject: template.mail_subject,
                sender_email: template.sender_email,
                sender_name: template.sender_name,
                mail_body: editorState,
                html_mail_body: htmlBlock,
                templateId: template.id,
                existing_attachments: template.attachments,
                template_set: true
            })

        }else{
            const htmlBlock = htmlToDraft(template.mail_body);
            const htmlState = ContentState.createFromBlockArray(htmlBlock.contentBlocks);
            const editorState = EditorState.createWithContent(htmlState);

            this.setState({
                ...this.state,
                template_name: template.template_name,
                mail_subject: template.mail_subject,
                sender_email: template.sender_email,
                sender_name: template.sender_name,
                mail_body: editorState,
                html_mail_body: htmlBlock,
                templateId: template.id,
                existing_attachments: template.attachments,
                template_set: true
            })
        }

        

    }

    onEditorStateChange = (editorState) => {
        const htmlFied = stateToHTML(editorState.getCurrentContent());
        this.setState({
            ...this.state,
            mail_body: editorState,
            html_mail_body: htmlFied
        });
    };

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

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({
            ...this.state,
            formError: '',
            formSuccess: false,
            isLoading: true
        });
        try {
            const { template_name, mail_subject, sender_name, sender_email, html_mail_body, attachment_names_value, attachments_value, templateId } = this.state;
            if(!template_name || !mail_subject || !sender_name || !sender_email || !html_mail_body || !templateId ){
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
            fd.append('templateId', templateId);

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

            const response = await apiConnect.post('/doEditTemplate', fd, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            if(response.data.status === 'success'){
                this.setState({
                    ...this.state,
                    isLoading: false,
                    formSuccess: true
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

    removeAttachment = async event => {
        event.preventDefault();
        const sure = window.confirm('Are you sure you want to delete this attachment? This action cannot be undone');
        const {name} = event.target
        try {
            if(!sure){
                return;
            }
            const attachmentkey = event.target.getAttribute('attachmentkey');
            const fd = new FormData();
            fd.append('attachment', name);
            const response = await apiConnect.post('/removeAttachment', fd);

            if(response.data.status === 'success'){
                const copiedArray = [...this.state.existing_attachments];
                const indexNum = copiedArray.findIndex(attachment => {
                    return attachment.attachment === attachmentkey
                })

                copiedArray.splice(indexNum, 1)

                this.setState({
                    existing_attachments: copiedArray
                })
            }else{
                window.alert('Unable to delete attachment');
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }

    render(){
        return(
            <div className='edit-template'>
                <Container>
                    <Row>
                        <Col md={12}>
                            <DashBg>
                                {
                                    this.state.formError ?
                                    <div className='alert-holder'>
                                        <Alert variant="danger">                                        
                                            {this.state.formError}                                        
                                        </Alert>
                                    </div>
                                    :
                                    null
                                }
                                {
                                    !this.state.template_set ?
                                    <div className='alert-holder'>
                                        <Alert variant="warning">                                        
                                            Loading Template  <Spinner size='sm' variant='dark' animation='border' />                                        
                                        </Alert>
                                    </div>
                                    :
                                    null
                                }
                                {
                                    this.state.formSuccess ?
                                    <div className='alert-holder'>
                                        <Alert variant="success">                                        
                                            Template successfully updated                                        
                                        </Alert>
                                    </div>
                                    :
                                    null
                                }
                                {}
                                <form onSubmit={this.handleSubmit}>
                                    <CustomInput name='template_name' placeholder='Template name' type='text' required label='Template name' value={this.state.template_name}  handleChange={this.handleChange} />
                                    <CustomInput name='mail_subject' placeholder='Mail Subject' type='text' required label='Mail Subject' value={this.state.mail_subject} handleChange={this.handleChange} />
                                    <CustomInput name='sender_name' placeholder='Sender name' type='text' required label='Sender name' value={this.state.sender_name} handleChange={this.handleChange} />
                                    <CustomInput name='sender_email' placeholder='Sender email' type='email' required label='Sender email' value={this.state.sender_email} handleChange={this.handleChange} />
                                    {
                                        this.state.existing_attachments.length ?
                                            <div className='form-group'>
                                            {
                                            this.state.existing_attachments.map((attachment, i) => {
                                                return(
                                                        <span key={i}>
                                                            <span className='btn btn-sm btn-info'>{attachment.attachment_name} <Button type='button' onClick={event => this.removeAttachment(event)} name={attachment.attachment} vairant='danger' size='sm'><FaTrash style={{fontSize: 12, marginTop: -4}} /></Button></span> 
                                                            {' '}
                                                        </span>
                                                )
                                            })
                                            }
                                            </div>
                                        :
                                        null
                                    }
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
                                                            //value={this.state.attachments_value[i]} 
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
                                    <span>Save Template {this.state.isLoading ? <Spinner animation="border" size="sm" variant='light' /> : null}</span>
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

const mapStateToProps = createStructuredSelector({
    templates: selectTemplates,
});

const mapDispatchToProps = dispatch => ({
    setTemplates: templates =>  dispatch(setTemplates(templates))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplatePage);