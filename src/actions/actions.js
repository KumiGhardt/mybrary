// initializes the movies list with movies
export const SET_MOVIES = 'SET_MOVIES';
//filters movies list
export const SET_FILTER = 'SET_FILTER';
//filters users
export const SET_USER = 'SET_USER';

export function setMovies(value) {
  return { 
      type: SET_MOVIES,
       value };
}



export function setFilter(value) {
  return { 
      type: SET_FILTER, 
      value };
}

export function setUSER(value) {
  return { 
      type: SET_USER,
       value };
}