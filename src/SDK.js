import PctAdapter from './PctAdapter'

export default new (class SDK {

  pctAdapter

  constructor() {
    this.pctAdapter = new PctAdapter()
  }

  getMovies = (page = 1, filters = {}) => (
    this.pctAdapter.getMovies(page, filters)
  )

  getShows = () => ([])

  getShow = (itemId) => ({})

  searchEpisode = (...args) => ({})

  search = (...args) => ([])

})()
