import React, { Component } from 'react';
import { Nav, Navbar, Form, FormControl, Button, NavDropdown } from 'react-bootstrap';
import ax from 'axios';
import Login from './login';
import { Register } from './buttons';
import user from '../images/icons/svg/user.svg';
// import login from '../images/icons/svg/user-plus.svg';
// import logout from '../images/icons/svg/user-minus.svg';
import close from '../images/icons/svg/cancel-circle.svg';
import UserAuth from '../utils/userauth';
import CheckError from '../utils/checkerror';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      CommunityId: window.location.pathname.match(/\/community\/([0-9]*)/)
        ? window.location.pathname.match(/\/community\/([0-9]*)/)[1]
        : undefined,
      isAuth: true
    }
  }

  componentDidMount() {
    const isAuth = UserAuth();
    this.setState({ isAuth: isAuth });
  }

  async logout() {
    try {
      const res = await ax.get('/api/users/logout');
      if (res.status === 200) {
        window.location = '/';
      }
    }
    catch (error) {
      CheckError(error);
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
      <Navbar bg="light" expand="lg" id='site-nav' style={{ marginBottom: '20px' }}>
        <Navbar.Brand href="/">TPN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto nav navbar-nav navbar-left">
            {/* <Nav.Link href="/profile">Profile</Nav.Link> */}
            {
              this.state.CommunityId
                ? <Nav.Link href={"/community/" + this.state.CommunityId}>Feed</Nav.Link>
                : ''
            }
            {
              this.state.CommunityId
                ? <Nav.Link href={"/community/" + this.state.CommunityId + "/friends"}>Friends</Nav.Link>
                : ''
            }
            {
              this.state.CommunityId
                ? <Nav.Link href={"/community/" + this.state.CommunityId + "/wall"}>Wall</Nav.Link>
                : ''
            }
            {
              this.state.CommunityId
                ? <Nav.Link href={"/community/" + this.state.CommunityId + "/chat"}>Chat</Nav.Link>
                : ''
            }
            <NavDropdown title="Settings" id="basic-nav-dropdown">
              <NavDropdown.Item href="/update-profile">Update Bio</NavDropdown.Item>
              <NavDropdown.Item href="/update-photo">Update Photo</NavDropdown.Item>
              <NavDropdown.Item href="/create-community">Create Community</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="nav navbar-nav navbar-right">
            {
              this.state.isAuth
                ? <div>
                  <a
                    className="btn btn-outline-info user-state-button dashboard"
                    title="Dashboard"
                    href="/profile"
                  >
                    <img src={user} alt="" />
                  </a>
                  <Button variant="danger"
                    className="user-state-button logout"
                    title="Log Out"
                    onClick={this.logout}>
                    Log Out
                  </Button>
                </div>
                : <div>
                  <Button variant="success"
                    className="user-state-button login"
                    title="Log In"
                    onClick={this.toggleLogin}>
                    Log In
                  </Button>
                  <Register />
                </div>
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
