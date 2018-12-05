/**
 * Default adapter with the minimum required functions
 */
export default class Adapter {

  /**
   * Get's called after the movies are fetched and before they are returned
   *
   * @param movies
   * @returns {*}
   */
  checkMovies = movies => movies

  /**
   * Get's called after the movie is fetched and before they it is returned
   *
   * @param movie
   * @returns {*}
   */
  checkMovie = movie => movie

  /**
   * Get's called after the shows are fetched and before they are returned
   *
   * @param shows
   * @returns {*}
   */
  checkShows = shows => shows

  /**
   * Get's called after the show is fetched and before they it is returned
   *
   * @param show
   * @returns {*}
   */
  checkShow = show => show

}
