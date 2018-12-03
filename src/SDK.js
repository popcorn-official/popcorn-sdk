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

  getMovie = (itemId) => (
    this.pctAdapter.getMovie(itemId)
      .then(this.checkAdapters('checkMovie'))
  )

  getShows = (page = 1, filters = {}) => (
    this.pctAdapter.getShows(page, filters)
      .then(this.checkAdapters('checkShows'))
  )

  getShow = (itemId) => (
    this.getShowBasic(itemId)
      .then(this.getShowMeta)
  )

  getShowBasic = itemId => (
    this.pctAdapter.getShow(itemId)
      .then(this.checkAdapters('checkShow'))
  )

  getShowMeta = pctShow => this.metadataAdapter
    .getSeasons(pctShow.id, pctShow.seasons)
    .then(seasons => ({
      ...pctShow,
      seasons,
    }))

  checkAdapters = (method) => async(items) => {
    for (let i = 0; i < this.adapters.length; i++) {
      items = await this.adapters[i][method](items)
    }

    return items
  }

  searchEpisode = (...args) => ({})

  search = (...args) => ([])

})()
