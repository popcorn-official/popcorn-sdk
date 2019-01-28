import axios from 'axios'

import * as PctHelpers from './PctHelpers'
import formatImage from '../utils/formatImage'
import * as Constants from '../constants'

export default class PctAdapter {

  today = null

  constructor() {
    this.today = new Date()
  }

  defaultFilters = {
    sort: 'trending',
    day : new Date().getDate(),
  }

  popcornAPI = axios.create({
    baseURL: 'http://beta2.api-fetch.website/',
  })

  getMovies = (page = 1, filters = {}) => (
    this.popcornAPI.get(`movies/${page}`, { params: { ...this.defaultFilters, ...filters } })
      .then(({ data: movies }) => this.formatMovies(movies))
  )

  getMovie = itemId => (
    this.popcornAPI.get(`movie/${itemId}`, { params: { day: this.defaultFilters.day } })
      .then(({ data: movie }) => this.formatMovie(movie))
  )

  getShows = (page = 1, filters = {}) => (
    this.popcornAPI.get(`shows/${page}`, { params: { ...this.defaultFilters, ...filters } })
      .then(({ data: shows }) => this.formatShows(shows))
  )

  getShow = itemId => (
    this.popcornAPI.get(`show/${itemId}`, { params: { day: this.defaultFilters.day } })
      .then(({ data: show }) => this.formatShow(show))
  )

  formatMovies = movies => (movies.map(movie => this.formatMovie(movie)))

  formatMovie = (movie) => ({
    ...movie,
    id      : movie._id,
    images  : formatImage(movie.images),
    torrents: PctHelpers.formatTorrents(movie.torrents),
    type    : Constants.TYPE_MOVIE,
    watched : {
      complete: false,
      progress: 0,
    },
  })

  formatShows = shows => shows.map(show => this.formatShow(show))

  formatShow = show => ({
    ...show,
    id     : show._id,
    images : formatImage(show.images),
    type   : Constants.TYPE_SHOW,
    seasons: show.seasons
      ? show.seasons.map(season => ({
        ...season,
        episodes: season.episodes.map(episode => ({
          ...episode,
          hasAired: episode.first_aired < this.today.getTime(),
        })),
      }))
      : [],
    watched: {
      complete: false,
      progress: 0,
    },
  })

  getStatus = () => this.popcornAPI.get().then(res => res.ok).catch(() => false)

}
