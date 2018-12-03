import axios from 'axios'

import * as PctHelpers from './PctHelpers'
import formatRuntime from '../utils/formatRuntime'
import formatImage from '../utils/formatImage'
import * as Constants from '../constants'

export default class PctAdapter {

  defaultFilters = {
    sort: 'trending',
    day : new Date().getDate(),
  }

  popcornAPI = axios.create({
    baseURL: 'https://movies-v2.api-fetch.website/',
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
      .then(({ data: show }) => this.formatShow(show, true))
  )

  formatMovies = movies => (movies.map(movie => this.formatMovie(movie)))

  formatMovie = (movie) => ({
    id           : movie.imdb_id,
    title        : movie.title,
    year         : movie.year,
    certification: movie.certification,
    summary      : movie.synopsis,
    runtime      : formatRuntime(movie.runtime),
    trailer      : movie.trailer,
    images       : formatImage(movie.images),
    genres       : movie.genres,
    rating       : PctHelpers.formatRating(movie.rating),
    torrents     : PctHelpers.formatTorrents(movie.torrents.en),
    type         : Constants.TYPE_MOVIE,
    watched      : {
      complete: false,
      progress: 0,
    },
  })

  formatShows = shows => shows.map(show => this.formatShow(show))

  formatShow = (show, isDetail = false) => {
    let formattedShow = {
      id        : show.imdb_id,
      title     : show.title,
      year      : show.year,
      images    : formatImage(show.images),
      rating    : PctHelpers.formatRating(show.rating),
      seasons   : [],
      numSeasons: show.num_seasons,
      type      : Constants.TYPE_SHOW,
      watched   : {
        complete: false,
        progress: 0,
      },
    }

    if (isDetail) {
      formattedShow = {
        ...formattedShow,
        runtime: formatRuntime(show.runtime),
        seasons: PctHelpers.formatShowEpisodes(show.episodes),
        summary: show.synopsis,
        genres : show.genres,
        status : show.status,
        network: show.network,
      }
    }

    return formattedShow
  }

  getStatus = () => this.popcornAPI.get().then(res => res.ok).catch(() => false)

}
