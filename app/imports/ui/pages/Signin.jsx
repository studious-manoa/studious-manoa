import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Container, Form, Grid, Header, Message, Menu } from 'semantic-ui-react';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
export default class Signin extends React.Component {

  /** Initialize component state with properties for login and redirection. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Handle Signin submission using Meteor's account mechanism. */
  submit = () => {
    const { email, password } = this.state;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: '', redirectToReferer: true });
      }
    });
  }

  /** Render the signin form. */
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    // if correct authentication, redirect to page instead of login screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    // Otherwise return the Login form.
    return (

        <Container>
              <Grid textAlign="center" verticalAlign="middle" padded centered columns={2}>
                <Grid.Column width={15}>
                  <div style={{ height: '30px' }}/>
                  <Header as="h2" textAlign="center" size="huge">
                    Sign in
                  </Header>
                  <Form onSubmit={this.submit}>
                    <Container textAlign='center' style={{ height: '400px', borderRadius: '10px' }}>
                      <div style={{ height: '20px' }}/>
                      <Form.Input
                          icon="user"
                          iconPosition="left"
                          name="email"
                          type="email"
                          placeholder="E-mail address"
                          onChange={this.handleChange}
                          style={{ width: '45%' }}
                      />
                      <div style={{ height: '10px' }}/>
                      <Form.Input
                          icon="lock"
                          iconPosition="left"
                          name="password"
                          placeholder="Password"
                          type="password"
                          onChange={this.handleChange}
                          style={{ width: '45%' }}

                      />
                      <div style={{ height: '10px' }}/>
                      {/* eslint-disable-next-line max-len */}
                      <Form.Button style={{ width: '45%', backgroundColor: '#ED9921', color: '#FCF3E1' }} content="Continue"/>
                      <div style={{ height: '10px' }}/>
                      <a as={NavLink} exact to="/resetpassword" style={{ color: '#767676' }}>Forgot your password?</a>
                      <Menu.Item icon="sign in" text="Reset Password" as={NavLink} exact to="/resetpassword"/>
                      <div style={{ height: '10px' }}/>
                      <a as={NavLink} exact to="/signup" style={{ color: '#767676' }}>Create new user</a>
                      <Menu.Item icon="sign in" text="Sign Up" as={NavLink} exact to="/signup"/>
                    </Container>
                  </Form>
                  {this.state.error === '' ? (
                      ''
                  ) : (
                      <Message
                          error
                          header="Login was not successful"
                          content={this.state.error}
                      />
                  )}
                </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signin.propTypes = {
  location: PropTypes.object,
};
