import PctAdapter from './PctAdapter'
import MetadataAdapter from './MetadataAdapter'

export default new (class SDK {

  pctAdapter
  metadataAdapter

  adapters = []

  constructor() {
    this.pctAdapter = new PctAdapter()
    this.metadataAdapter = new MetadataAdapter()
  }

  addAdapter = (adapter) => {
    this.adapters.push(adapter)
  }

  getMovies = (page = 1, filters = {}) => (
    this.pctAdapter.getMovies(page, filters)
      .then(this.checkAdapters('checkMovies'))
  )

  getMovie = (item) => {
    if (!item.id && !item.imdb_id) {
      throw Error(`"imdb_id" is required to retrieve a movie!`)
    }

    return (
      this.pctAdapter.getMovie(item.id || item.imdb_id)
        .then(this.checkAdapters('checkMovie'))
    )
  }

  getShows = (page = 1, filters = {}) => (
    this.pctAdapter.getShows(page, filters)
      .then(this.checkAdapters('checkShows'))
  )

  getShow = async(item) => {
    if (!item.id && !item.imdb_id && !item.tmdb_id) {
      throw Error(`"imdb_id" is required to retrieve a show!`)
    }

    // Fetch imdb id's
    if (!item.id && !item.imdb_id) {
      const showIds = await this.metadataAdapter.getShowIds(item.tmdb_id)

      item = {
        ...item,
        ...showIds,
      }
    }

    return this.pctAdapter.getShow(item.id || item.imdb_id)
      .then(this.checkAdapters('checkShow'))
  }

  getShowRecommendations = (...args) => this.metadataAdapter.getShowRecommendations(...args)

  checkAdapters = (method) => async(items) => {
    for (let i = 0; i < this.adapters.length; i++) {
      items = await this.adapters[i][method](items)
    }

    return items
  }

  searchEpisode = (...args) => ({})

  search = (...args) => ([])

})()
