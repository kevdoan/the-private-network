import React, { Component } from 'react';
import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import ax from 'axios';
import Login from './login';
import user from '../images/icons/svg/user.svg';
import login from '../images/icons/svg/user-plus.svg';
import logout from '../images/icons/svg/user-minus.svg';
import close from '../images/icons/svg/cancel-circle.svg';

class Header extends Component {
  async logout() {
    const res = await ax.get('/api/users/logout');
    if (res.status === 200) {
      window.location = '/';
    }
  }

  toggleLogin() {
    let loginForm = document.getElementById('login');

    if (loginForm.className === 'expander open') {
      loginForm.className = 'expander closed';
    }
    else {
      loginForm.className = 'expander open';
    }
  }

  render() {
    return (
      <Navbar bg="light" expand="lg" id='site-nav'>
        <Navbar.Brand href="/">TPN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto nav navbar-nav navbar-left">
            <Nav.Link href="/feed">Feed</Nav.Link>
            {/* <Nav.Link href="/profile">Profile</Nav.Link> */}
            <Nav.Link href="/chat">Chat</Nav.Link>
            {/* <NavDropdown title="Communities" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}
          </Nav>
          <Nav className="nav navbar-nav navbar-right">
            {this.props.isAuth ?
              <div>
                <a
                  className="btn btn-outline-info user-state-button dashboard"
                  title="Dashboard"
                  href="/profile"
                >
                  <img src={user} alt="" />
                </a>
                <Button variant="outline-info"
                  className="user-state-button logout"
                  title="Log Out"
                  onClick={this.logout}>
                  <img src={logout} alt="" />
                </Button>
              </div>
              :
              <Button variant="outline-info"
                className="user-state-button login"
                title="Log In"
                onClick={this.toggleLogin}>
                <img src={login} alt="" />
              </Button>
            }
            <Form inline>
              {/* // TODO make search route to handle searches */}
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
        <div className="expander closed" id="login">
          <button className="btn icon closed" onClick={this.toggleLogin}>
            <img src={close} alt="" />
          </button>
          <Login />
        </div>
      </Navbar>
    )
  }
}

export default Header;