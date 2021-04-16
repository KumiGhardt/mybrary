import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

export class DirectorView extends React.Component {

  constructor() {
    super();
    this.state = {};
    
  }


  render() {
      
    const { director, movies } = this.props;
    if (!director) return null;

    return (
      <div className="director-view">
        <div className="director-name">
          <span className="label">Name: </span>
          <span className="value">{director.Director.Name}</span>
        </div>
        <div className="movie-description">
          <span className="label">Bio: </span>
          <span className="value">{director.Director.Bio}</span>
        </div>

        <div className="director-birth">
          <span className="label">Birthdate: </span>
          <span className="value">{director.Director.Birth}</span>
        </div>

        <div className="director-death">
          <span className="label">Death: </span>
          <span className="value">{director.Director.Death}</span>
        </div>

        <div className="director-movies">
          <span className="label">Movies by {director.Director.Name}: </span>
        </div>

        <div className="d-flex row mp-6 mx-3">
            {movies.map((movie) => {
              if (movie.Director.Name === director.Director.Name) {
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



DirectorView.propTypes = {
  Movie: PropTypes.shape({
    Director: {
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string,
    Birth: PropTypes.number,
    Death: PropTypes.number, 
  }
})
};