import React from 'react';
import './dashboard.css';
import DashBg from '../../components/dash-bg/dash-bg';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import CustomButton from '../../components/custom-button/custom-button';
import CustomInput from '../../components/custom-input/custom-input';
import CustomSelect from '../../components/custom-select/custom-select';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectTemplates } from '../../redux/templates/templates.selector';
import { setTemplates } from '../../redux/templates/templates.actions';
import apiConnect from '../../api/connect';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {stateToHTML} from 'draft-js-export-html';

class DashboardPage extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            template: '',
            mail_subject: '',
            sender_name: '',
            sender_email: '',
            to: '',
            cc: '',
            bcc: '',
            mail_body: '',
            html_mail_body: '',
            isLoading: false,
            formError: '',
            formSuccess: '',
            existing_attachments: []
        }
    }

    componentDidMount() {
        const templateRun =  async () => {
            try {
                if(this.props.templates){
                    // this.setState({templatesOptions: this.props.templates})
                }else{
                    const response = await apiConnect.get('/getTemplates');
                    if(response.data.status === 'success'){
                        this.props.setTemplates(response.data.templates);
                    }
                    this.setState({templatesOptions: this.props.templates})
                }
            } catch (error) {
                console.log(error);
            }

        }

        templateRun();
    }

    handleChange = event => {
        const {value, name} = event.target;

        if(name === 'template'){
            if(value){
                const template = this.props.templates.find(template => template.id === value); 
                if(!template.mail_body){
                    const htmlBlock = htmlToDraft('');
                    const htmlState = ContentState.createFromBlockArray(htmlBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(htmlState);
    
                    this.setState({
                        ...this.state,
                        mail_subject: template.mail_subject,
                        sender_email: template.sender_email,
                        sender_name: template.sender_name,
                        mail_body: editorState,
                        template: value,
                        html_mail_body: htmlBlock,
                        existing_attachments: template.attachments
                    })
                }else{
                    const htmlBlock = htmlToDraft(template.mail_body);
                    const htmlState = ContentState.createFromBlockArray(htmlBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(htmlState);
    
                    this.setState({
                        ...this.state,
                        mail_subject: template.mail_subject,
                        sender_email: template.sender_email,
                        sender_name: template.sender_name,
                        mail_body: editorState,
                        template: value,
                        html_mail_body: htmlBlock,
                        existing_attachments: template.attachments
                    })
                }      
            }else{
                this.setState({
                    ...this.state,
                    mail_subject: '',
                    sender_email: '',
                    sender_name: '',
                    mail_body: '' ,
                    html_mail_body: '',
                    existing_attachments: []
                })
            }
        }else{
            this.setState({[name]: value});
        }
    }

    onEditorStateChange = (editorState) => {
        const htmlFied = stateToHTML(editorState.getCurrentContent());
        this.setState({
            ...this.state,
            mail_body: editorState,
            html_mail_body: htmlFied
        });
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
            const { template, to, cc, bcc, mail_subject, sender_email, html_mail_body, sender_name } = this.state;

            if(!to || !mail_subject || !sender_email || !html_mail_body || !sender_name){
                this.setState({
                    formError: 'Mail subject, sender name, sender email, mail body, to are all required to proceed'
                })
                return;
            }
            
            const fd = new FormData();
            fd.append('template_id', template);
            fd.append('to', to);
            fd.append('cc', cc);
            fd.append('bcc', bcc);
            fd.append('mail_subject', mail_subject);
            fd.append('sender_email', sender_email);
            fd.append('sender_name', sender_name);
            fd.append('mail_body', html_mail_body);

            const response = await apiConnect.post('/sendMail', fd);
            if(response.data.status === 'success'){
                this.setState({formSuccess: true});
            }else{
                this.setState({formError: response.data.message});
            }

        } catch (error) {
            console.log(error);
            this.setState({formError: 'Something went wrong'})
        }
    }

    render(){
        return(
            <div className='dashboard'>
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
                                    this.state.formSuccess ?
                                    <div className='alert-holder'>
                                        <Alert variant="success">
                                        
                                        Mail Sent Successfully

                                        </Alert>
                                    </div>
                                    :
                                    null
                                }
                                <form onSubmit={this.handleSubmit}>
                                    <CustomSelect name='template' handleChange={this.handleChange} placeholder='Select Template' options={this.props.templates} label='Template'/>
                                    <CustomInput name='mail_subject' value={this.state.mail_subject} placeholder='Mail Subject' label='Mail Subject' handleChange={this.handleChange} type='text' required />
                                    <CustomInput name='sender_name' value={this.state.sender_name} placeholder='Sender Name' label='Sender Name' handleChange={this.handleChange} type='text' required />
                                    <CustomInput name='sender_email' value={this.state.sender_email} placeholder='Sender Email' label='Sender Email' handleChange={this.handleChange} type='email' required />
                                    <CustomInput name='to' placeholder='To' value={this.state.to} label='To' handleChange={this.handleChange} type='text' required />
                                    <CustomInput name='cc' placeholder='CC' value={this.state.cc} label='CC' handleChange={this.handleChange} type='text' />
                                    <CustomInput name='bcc' placeholder='BCC' value={this.state.bcc} label='BCC' handleChange={this.handleChange} type='text' />
                                    {
                                        this.state.existing_attachments.length ?
                                            <div className='form-group'>
                                            {
                                            this.state.existing_attachments.map((attachment, i) => {
                                                return(
                                                        <span key={i}>
                                                            <span className='btn btn-sm btn-info'>{attachment.attachment_name}</span> 
                                                            {' '}
                                                        </span>
                                                )
                                            })
                                            }
                                            </div>
                                        :
                                        null
                                    }
                                    <div className='form-group'>
                                        <Editor
                                        editorState={this.state.mail_body}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorStyle={{height: '300px', borderWidth: 2, borderColor: '#ccc', borderStyle: 'solid', marginBottom: 20}}
                                        onEditorStateChange={this.onEditorStateChange}
                                        />
                                    </div>
                                    <CustomButton displayText={
                                        <span>
                                            Send Mail {this.state.isLoading ? <Spinner variant='light' size='sm' animation='border' /> : null}
                                        </span>
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
    // template: id => getTemplate(id)
});

const mapDispatchToProps = dispatch => ({
    setTemplates: templates => dispatch(setTemplates(templates))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);