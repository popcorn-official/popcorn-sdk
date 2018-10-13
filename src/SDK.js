import PctAdapter from './PctAdapter'
import MetadataAdapter from './MetadataAdapter'
import BookmarkAdapter from './BookmarkAdapter'

export default new (class SDK {

  pctAdapter
  metadataAdapter
  bookmarkAdapter

  constructor() {
    this.pctAdapter = new PctAdapter()
    this.metadataAdapter = new MetadataAdapter()
    this.bookmarkAdapter = new BookmarkAdapter()
  }

  /**
   * Can be used to overwrite the adapter that checks if shows / movies are bookmarked
   *
   * @param bookmarkAdapter
   */
  setBookmarkAdapter = (bookmarkAdapter) => {
    this.bookmarkAdapter = bookmarkAdapter
  }

  getMovies = (page = 1, filters = {}) => (
    this.pctAdapter.getMovies(page, filters)
      .then(this.bookmarkAdapter.checkMovies)
  )

  getMovie = (itemId) => (
    this.pctAdapter.getMovie(itemId)
      .then(this.bookmarkAdapter.checkMovie)
  )

  getShows = (page = 1, filters = {}) => (
    this.pctAdapter.getShows(page, filters)
      .then(this.bookmarkAdapter.checkShows)
  )

  getShow = (itemId) => (
    this.getShowBasic(itemId)
      .then(this.getShowMeta)
  )

  getShowBasic = itemId => (
    this.pctAdapter.getShow(itemId)
      .then(this.bookmarkAdapter.checkShow)
  )

  getShowMeta = pctShow => this.metadataAdapter
    .getSeasons(pctShow.id, pctShow.seasons)
    .then(seasons => ({
      ...pctShow,
      seasons,
    }))

  searchEpisode = (...args) => ({})

  search = (...args) => ([])

})()
