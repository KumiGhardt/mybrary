import React from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { setMovies } from '../../actions/actions';

export class MovieView extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  addFavoriteMovie(movie) {
    let token = localStorage.getItem("token");
    let url =
      "https://kumi-movie-index.herokuapp.com/users/" +
      JSON.parse(localStorage.getItem("user")).Username +
      "/movies/" +
      movie._id;
    console.log(token);

    axios
      .post(url, "", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        // window.open("/", "_self");
        window.open("/users/" + JSON.parse(localStorage.getItem("user")).Username, "_self");
        alert("Added to favorites!");
      });
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
     
      <div className="movie-view">
        <img className="movie-poster" src={movie.ImagePath} />
        <div className="movie-title">
          <span className="label">Title: </span>
          <span className="value">{movie.Title}</span>
        </div>
        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>

        <div className="movie-genre">
          <span className="label"><Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">Genre</Button>
          </Link> </span>
          <span className="value">{movie.Genre.Name}</span>

        </div>
        <div className="movie-director">
          <span className="label"><Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">Director</Button>
          </Link></span>
          <span className="value">{movie.Director.Name}</span>

        </div>
        <Link to={'/'}> <Button variant="dark">Back</Button> </Link>
        <Button variant="info" onClick={() => this.addFavoriteMovie(movie)}>Favorite</Button>
      </div>
      
    );
  }
}
MovieView.propTypes = {
  movie: PropTypes.shape({
    // movie prop may contain Title, and IF it does, it must be a string
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string,
    Year: PropTypes.number,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string,
      Biography: PropTypes.string
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string,
      Bio: PropTypes.string,
      Birthdate: PropTypes.string
    }),
    Featured: PropTypes.bool
  })
};