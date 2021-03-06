import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Landing from '../pages/Landing';
import ListStuffAdmin from '../pages/ListStuffAdmin';
import AddReview from '../pages/AddReview';
import EditProject from '../pages/EditProject';
import Location from '../pages/Location';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import UserProfile from '../pages/UserProfile';
import EditUserProfile from '../pages/EditUserProfile';
import Signout from '../pages/Signout';
import Resetpassword from '../pages/Resetpassword';
import Footer from '../components/Footer';
import AddContact from '../pages/AddContact';
import Home from '../pages/Home';
import AddProject from '../pages/AddProject';
import Projects from '../pages/Projects';
import ProjectsAdmin from '../pages/ProjectsAdmin';
import Filter from '../pages/Filter';
import Tags from '../pages/Tags';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
        <Router>
          <div>
            <NavBar/>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <ProtectedRoute path="/home" component={Home}/>
              <Route path="/locations" component={Projects}/>
              <Route path="/locationsAdmin" component={ProjectsAdmin}/>
              <Route path="/tags" component={Tags}/>
              <ProtectedRoute path="/addlocation" component={AddProject}/>
              <Route path="/filter" component={Filter}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <ProtectedRoute path="/review/:_id" component={AddReview}/>
              <Route path="/location/:name" component={Location}/>
              <ProtectedRoute path="/add" component={AddContact}/>
              <Route path="/userprofile" component={UserProfile}/>
              <Route path="/edituserprofile" component={EditUserProfile}/>
              <Route path="/editProject" component={EditProject}/>
              <Route path="/resetpassword" component={Resetpassword}/>
              <ProtectedRoute path="/edit/:_id" component={EditProject}/>
              <AdminProtectedRoute path="/admin" component={ListStuffAdmin}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <Route component={NotFound}/>
            </Switch>
            <Footer />
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
          (<Component {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
      );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
          return (isLogged && isAdmin) ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default App;
