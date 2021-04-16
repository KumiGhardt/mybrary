import React from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    Form, 
    Button,
    Container,
    Card,
    Tab,
    Tabs
} from 'react-bootstrap'

class ProfileView extends React.Component {
  constructor() {
    super();
    this.state = {
      Username: null,
      Password: null,
      Email: null,
      Birthday: null,
      FavoriteMovies: [],
      validated: null,
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log({ user });
    //.split converts the string into an array
    const favoritemovies = localStorage.getItem('favoriteMovies').split(',');
    this.setState({
      FavoriteMovies: favoritemovies
    });
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }


  getUser(token) {
    const Username = JSON.parse(localStorage.getItem('user')).Username;
    axios
      .get('https://kumi-movie-index.herokuapp.com/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //filter current user
        const currentUser = response.data.filter(item => item.Username === Username)
        
        this.setState({
          Username: currentUser[0].Username,
          Password: currentUser[0].Password,
          Email: currentUser[0].Email,
          Birthday: currentUser[0].Birthday,
          FavoriteMovies: currentUser[0].FavoriteMovies,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }



  handleRemoveFavorite(e, movie) {
    console.log(movie);
    e.preventDefault();
    const username = JSON.parse(localStorage.getItem('user')).Username;
    const token = localStorage.getItem('token'); 
    
    axios
      .delete(`https://kumi-movie-index.herokuapp.com/users/${username}/movies/${movie}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert('Movie was removed from your Favorites List.');
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

      //change user details

  handleUpdate(e, newUsername, newPassword, newEmail, newBirthday) {
    this.setState({
      validated: null,
    });

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        validated: true,
      });
      return;
    }
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = JSON.parse(localStorage.getItem('user')).Username;

    axios({
      method: 'put',
      url: `${'https://kumi-movie-index.herokuapp.com/'}users/${username}`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        Username: newUsername ? newUsername : this.state.Username,
        Password: newPassword ? newPassword : this.state.Password,
        Email: newEmail ? newEmail : this.state.Email,
        Birthday: newBirthday ? newBirthday : this.state.Birthday,
      },
    })
      .then((response) => {
        console.log ({response});
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
        });
        alert('Changes have been saved!');
        localStorage.setItem('user', JSON.stringify(response.data));
        // this.props.history.push(`/users/${username}`);
        window.location.pathname = `/users/${username}`
        // console.log(response.data);

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  
  //deregister
  handleDeregister() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem("user")).Username;
    axios
      .delete(`https://kumi-movie-index.herokuapp.com/users/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        alert('Your account has been deleted');
        // this.props.history.push(`/`);
        window.location.pathname = `/login`
      })
      .catch((e) => {
        console.log(e);
      });
  }

  setUsername(input) {
    this.Username = input;
  }

  setPassword(input) {
    this.Password = input;
  }

  setEmail(input) {
    this.Email = input;
  }

  setBirthday(input) {
    this.Birthday = input;
  }

  

  render() {
    const { user, validated, FavoriteMovies } = this.state;
    console.log({FavoriteMovies});
    const {movies} = this.props;
    const username = JSON.parse(localStorage.getItem('user')).Username;
    //const  FavoriteMovies = this.props.movies.map(movie => (<div key={movie._id}></div>))

    return (
      <Container className='profile-view'>
        <Tabs defaultActiveKey='profile' transition={false} className='profile-tabs'>

          <Tab className='tab-item' eventKey='profile' title='Profile'>
            <Card className='profile-card' border='info'>
                <Card.Title className='profile-title'>{username}'s Favorite Movies</Card.Title>
                {FavoriteMovies.length === 0 && <div className='card-content'>You don't have any favorite movies yet!</div>}
                <div className='favorites-container'>
                  {FavoriteMovies.length > 0 && movies.map((movie) => {
                      if (movie._id === FavoriteMovies.find((favMovie) => favMovie === movie._id)) {
                        return (
                          <div key={movie._id}>
                            <Card className='favorites-item card-content' style={{ width: '16rem', flex: 1 }}>
                              {/* <Card.Img>{movie.ImageUrl}</Card.Img> */}
                              <Card.Title className='movie-card-title'>{movie.Title}</Card.Title>
                              <Card.Subtitle className='text-muted fav-subtitle'>{movie.Year}</Card.Subtitle>
                              <Card.Body className='movie-card-body'>
                                <Button size='sm' className='profile-button view-movie' variant='info' as={Link} to={`/movies/${movie._id}`} target='_self'>
                                  View Movie
                                </Button>
                                <Button size='sm' className='profile-button remove-favorite' variant='danger' onClick={(e) => this.handleRemoveFavorite(e, movie._id)}>
                                  Remove
							                	</Button>
                              </Card.Body>
                            </Card>
                          </div>
                        );
                      }
                    })}
                </div>
            </Card>

          </Tab>


          <Tab className='tab-item' eventKey='update' title='Update'>
            <Card className='update-card' border='info'>
                <Card.Title className='profile-title'>Update Profile</Card.Title>
                <Card.Subtitle className='card-subtitle-update'>Please leave any fields not being updated empty. 
                  <span className='password-instructions'> *You must enter in either a new or existing password to verify the change!</span>
                </Card.Subtitle>
                <Card.Body>
                <Form noValidate validated={validated} className='update-form' onSubmit={(e) => this.handleUpdate(e, this.Username, this.Password, this.Email, this.Birthday)}>
                  <Form.Group controlId='formBasicUsername'>
                    <Form.Label className='form-label'>Username</Form.Label>
                    <Form.Control type='text' placeholder='Change Username' onChange={(e) => this.setUsername(e.target.value)} pattern='[a-zA-Z0-9]{5,}'/>
                    <Form.Control.Feedback type='invalid'>Please enter a valid username with at least 5 alphanumeric characters.</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId='formBasicPassword'>
                    <Form.Label className='form-label'>
                      Password <span className='required'>*</span>
                    </Form.Label>
                    <Form.Control type='password' placeholder='Current or New Password' onChange={(e) => this.setPassword(e.target.value)} pattern='.{5,}'/>
                    <Form.Control.Feedback type='invalid'>Please enter a valid password with at least 5 characters.</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId='formBasicEmail'>
                    <Form.Label className='form-label'>Email</Form.Label>
                    <Form.Control type='email' placeholder='Change Email' onChange={(e) => this.setEmail(e.target.value)} />
                    <Form.Control.Feedback type='invalid'>Please enter a valid email address.</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId='formBasicBirthday'>
                    <Form.Label className='form-label'>Birthday</Form.Label>
                    <Form.Control type='date' placeholder='Change Birthday' onChange={(e) => this.setBirthday(e.target.value)} />
                    <Form.Control.Feedback type='invalid'>Please enter a valid birthday.</Form.Control.Feedback>
                  </Form.Group>
                  <Button className='update-profile-button' type='submit' variant='info'>
                    Update
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>


          <Tab className='tab-item' eventKey='delete' title='Delete Profile'>
            <Card className='update-card' border='danger'>
              <Card.Title className='profile-title'>Delete Your Profile</Card.Title>
              <Card.Subtitle className='text-muted'>If you delete your account, it cannot be recovered.</Card.Subtitle>
              <Card.Body>
                <Button className='button' variant='danger' onClick={(e) => this.handleDeregister(e)}>
                    Click Here If You're Sure!
				        </Button>
              </Card.Body>
            </Card>
          </Tab>


        </Tabs>
      </Container>
    );
  }
}

ProfileView.propTypes = {
  movies: propTypes.array.isRequired, 
};

//retrieve movies and users from global state
let mapStateToProps = state => {
  return { movies: state.movies }
}


export default connect(mapStateToProps)(ProfileView);