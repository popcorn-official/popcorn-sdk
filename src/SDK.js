import PctAdapter from './PctAdapter'
import metadataAdapter from './MetadataAdapter'

export default new (class SDK {

  pctAdapter
  metadataAdapter

  constructor() {
    this.pctAdapter = new PctAdapter()
    this.metadataAdapter = new metadataAdapter()
  }

  getMovies = (page = 1, filters = {}) => (
    this.pctAdapter.getMovies(page, filters)
  )

  getMovie = (itemId) => this.pctAdapter.getMovie(itemId)

  getShows = (page = 1, filters = {}) => (
    this.pctAdapter.getShows(page, filters)
  )

  getShow = (itemId) => (
    this.pctAdapter.getShow(itemId)
      .then(pctShow => (
        this.metadataAdapter
          .getSeasons(itemId, pctShow.seasons)
          .then(seasons => ({
            ...pctShow,
            seasons,
          }))
      ))
  )

  searchEpisode = (...args) => ({})

  search = (...args) => ([])

})()
