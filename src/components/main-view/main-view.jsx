//movies state that will hold the list of movies:

import React from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import axios from "axios";
import { connect } from 'react-redux';

// #0
import { setMovies } from '../../actions/actions';

import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button';

import '../main-view/main-view.scss';

import MoviesList from '../movies-list/movies-list';
//reusable movie-card components
import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { RegistrationView } from "../registration-view/registration-view";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import ProfileView from "../profile-view/profile-view";



//components states
export class MainView extends React.Component {
  //create component with constructor- the place to initialize a state’s values.
  constructor(props) {
    super(props);
    // initialized with an object containing movies that holds an array of movies
    const localUser = JSON.parse(localStorage.getItem('user'))
    this.state = {
      movies: [],
      selectedMovie: null,
      user: localUser,
      register: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      // this.setState({
      //   user: JSON.parse(localStorage.getItem('user'))
      // });
      this.getMovies(accessToken);
    }
  }

  /* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/
  onLoggedIn(authData) {
    console.log('Auth Data User', authData.user); 
       this.setState({
      user: authData.user
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    localStorage.setItem('favoriteMovies', authData.user.FavoriteMovies);
    window.location.pathname = '/';
    this.getMovies(authData.token);
  }

  logOut() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null
    });
    alert('You have logged out');
    window.open('/login', '_self');
  }

  //make a GET request to heroku.
  getMovies(token) {
    axios
      .get('https://kumi-movie-index.herokuapp.com/movies', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // #1
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /*When a movie is clicked, this function is invoked and updates the state of the `selectedMovie` *property to that movie*/
  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie,
    });
  }

  onRegister(register) {
    this.setState({
      register,
    });
  }


  render() {

    // #2
    let { movies } = this.props;
    let { user } = this.state;

    //destructure
    const { selectedMovie, register } = this.state;

    /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView*/
    //if (!user) return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
    if(window.location.pathname === '/login') {
      if(!user) {
      return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
      }
    }

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;
    if(window.location.pathname === '/register'){
      return <RegistrationView />
    }
    return (
      <Container>
        <Router>
          <Navbar>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav className="justify-content-end">
                <Nav.Link href={`/users/${user.Username}`}>My Account</Nav.Link>
              </Nav>
              <Button onClick={() => this.logOut()} variant="secondary">Log Out</Button>
            </Navbar.Collapse>
          </Navbar>

          {/* movies */}
          
          <Row className="main-view">
          <Route exact path="/register" render={() => <RegistrationView />} />

            <Route exact path="/" render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              return <MoviesList movies={movies} />;
            }} />
            
            <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />

            <Route path="/genres/:name" render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return <GenreView genre={movies.find((m) => m.Genre.Name === match.params.name)} movies={movies} />
            }} />

            <Route path="/directors/:name" render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return <DirectorView director={movies.find((m) => m.Director.Name === match.params.name)} movies={movies} />
            }} />

            <Route exact path='/users/:username'
              render={() => {
                if (!user) return <LoginView onLoggedIn={(data) => this.onLoggedIn(data)} />;
                if (movies.length === 0) return;
                return <ProfileView movies={movies} />
              }} />
          </Row>
          
        </Router>
      </Container>
    );
  }
}
// #3
let mapStateToProps = state => {
  return { movies: state.movies }
}

// #4
export default connect(mapStateToProps, { setMovies })(MainView);