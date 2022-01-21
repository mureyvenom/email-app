import React, { useState } from 'react';
import './homepage.css';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import CustomInput from '../../components/custom-input/custom-input';
import CustomButton from '../../components/custom-button/custom-button';
import { connect } from 'react-redux';
import { setCurrentUser, setLoginError, clearLoginError } from '../../redux/user/user.actions';
import apiConnect from '../../api/connect';
import { createStructuredSelector } from 'reselect';
import { selectLoginError } from '../../redux/user/user.selector';

const HomePage = ({loginUser, errorMessage, setLoginError, clearLoginError}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUsername = event => {
        const { value } = event.target;
        setUsername(value);
    }

    const handlePassword = event => {
        const { value } = event.target;
        setPassword(value);
    }

    const handleSubmit = async event => {
        event.preventDefault();
        clearLoginError();
        setIsLoading(true);

        try {
            const fd = new FormData();
            fd.append('username', username);
            fd.append('password', password);

            const response = await apiConnect.post('/doLogin', fd);
            if(response.data.status === 'success'){
                loginUser(response.data.user);
            }else{
                setLoginError(response.data.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoginError('Something went wrong');
            setIsLoading(false);
        }
    }

    return(
        <div className='home-page'>
            <Container>
                <Row>
                    <Col md={4}></Col>
                    <Col md={4}>
                        <h3>Mailing App</h3>
                        {
                            errorMessage ?
                            <p style={{textAlign: 'center'}}>
                                <Alert variant="danger">
                                
                                {errorMessage}

                                </Alert>
                            </p>
                            :
                            null
                        }
                        <form onSubmit={handleSubmit}>
                            <CustomInput type='text' handleChange={handleUsername} value={username} placeholder='Enter username' name='username' />
                            <CustomInput type='password' handleChange={handlePassword} value={password} placeholder='Enter password' name='password' />
                            <CustomButton displayText={
                                <span>
                                    Login {isLoading ? <Spinner variant='light' size='sm' animation='border' /> : null}
                                </span>
                            } type='submit' />
                        </form>
                    </Col>
                    <Col md={4}></Col>
                </Row>
            </Container>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    loginUser: user => dispatch(setCurrentUser(user)),
    setLoginError: error => dispatch(setLoginError(error)),
    clearLoginError: () => dispatch(clearLoginError())
});

const mapStateToProps = createStructuredSelector({
    errorMessage: selectLoginError
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);