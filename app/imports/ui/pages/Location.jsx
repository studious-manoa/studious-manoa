import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader, Header, Image, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router-dom';
import { Projects, projectsName } from '/imports/api/projects/Projects';
import { Reviews, reviewsName } from '/imports/api/reviews/Reviews';
import MapLeaflet from '../components/MapLeaflet';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Location extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  displayReviews() {
    const reviews = Reviews.find().fetch({ location: this.props.project._id });
    // if there are no reviews, it will say there are no reviews.
    if (reviews.length === 0) return <div> This location doesn&apos;t have any reviews yet. </div>;
    // if there are reviews, they will be displayed.
    // displays the 10 most recent reviews in cards
    return (
        <div>
          <Header as='h2'>Recent reviews</Header>
          {_.map(reviews, review => <Card>
            <Card.Content>
              <Card.Header as='h3'> {review.rating} / 5 </Card.Header>
              <Card.Description> {review.body}</Card.Description>
            </Card.Content>
          </Card>)}
        </div>
    );
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const lat = this.props.project.lat;
    const lng = this.props.project.long;

    return (
        <div>
          <Link to={`/review/${this.props.project._id}`}>Add a review for this location.</Link>
          <Header as='h1'>{this.props.project.name}</Header>
          <div>{this.displayReviews()}</div>
          <Image src={this.props.project.picture}/>
          <p>{this.props.project.description}</p>
          <MapLeaflet lat={lat} lng={lng}
                      zoom={17} locations={[[this.props.project.name, lat, lng]]}>
          </MapLeaflet>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Location.propTypes = {
  project: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const locationName = match.params.name;
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(projectsName);
  // const sub2 = Meteor.subscribe(profilesName);
  const sub3 = Meteor.subscribe(reviewsName);
  // const sub4 = Meteor.subscribe(profilesProjectsName);
  return {
    project: Projects.findOne(
        { name: locationName },
    ),
    ready: sub1.ready() && sub3.ready(),
  };
})(Location);
