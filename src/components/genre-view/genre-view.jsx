import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import Button from 'react-bootstrap/Button';

export class GenreView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const { genre, movies } = this.props;
    if (!genre) return null;

    return (
      <div className="genre-view">
        <div className="genre-name">
          <span className="label">Name: </span>
          <span className="value">{genre.Genre.Name}:</span>
        </div>
        <div className="genre-description">
          <span className="label">Description: </span>
          <span className="value">{genre.Genre.Description}</span>
        </div>
      
        <div className="genre-movies">
          <span className="label">Movies in the {genre.Genre.Name} Genre: </span>
        </div>

        <div className="d-flex row mp-6 mx-3">
            {movies.map((movie) => {
              if (movie.Genre.Name === genre.Genre.Name) {
                return (
                  <div key={movie._id}>
                    <Card
                      className="mb-3 mr-2 h-100"
                      style={{ width: '16rem' }}
                    >
                      <Card.Img variant="top" src={movie.ImagePath} />
                      <Card.Body>
                        <Link
                          className="text-muted"
                          to={`/movies/${movie._id}`}
                        >
                          <Card.Title>{movie.Title}</Card.Title>
                        </Link>
                        <Card.Text>
                          {movie.Description.substring(0, 90)}...
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="bg-white border-top-0">
                        <Link to={`/movies/${movie._id}`}>
                          <Button
                            variant="link"
                            className="read-more-link pl-0"
                          >
                          Read more
                          </Button>  
                        </Link>
                      </Card.Footer>
                    </Card>
                  </div>
                );
              }
            })}
          </div>


        <Link to={'/'}> <Button variant="dark">Back</Button> </Link>
      </div>
    );
  }
}



GenreView.propTypes = {
  movie: PropTypes.shape({
    Genre: {
      Name: PropTypes.string,
      Description: PropTypes.string
    }
  })
};