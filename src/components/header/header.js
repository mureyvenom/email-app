import React from 'react';
import './header.css';
import topbar from '../../assets/topbar.png';
import logo from '../../assets/logo.png';
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap';
import { connect } from 'react-redux';
import { logOutUser, clearLoginError } from '../../redux/user/user.actions';
import { clearTemplates } from '../../redux/templates/templates.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selector';

const Header = ({currentUser, logOut, clearLoginError, clearTemplates}) => {
    return(
        <div>
            <div id='top-bar'>
                <img src={topbar} alt='topbar' className='img-fluid' />                
            </div>
            <Navbar collapseOnSelect expand="md" id='navbar'>
                <Container>
                    <Navbar.Brand href="/"><img src={logo} alt='logo' className='img-fluid' /></Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        {
                            currentUser 
                            ?
                            <Nav className="ml-auto mr-auto">
                                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                                <NavDropdown title="Template" id="collasible-nav-dropdown">
                                    <NavDropdown.Item href="/add-template">Add template</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/templates">Edit/Remove Template</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link onClick={() => {
                                    clearLoginError();
                                    clearTemplates();
                                    logOut();
                                }}>logout</Nav.Link>
                            </Nav>
                            :
                            null
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
    logOut: () =>  dispatch(logOutUser()),
    clearLoginError: () => dispatch(clearLoginError()),
    clearTemplates: () => dispatch(clearTemplates())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);