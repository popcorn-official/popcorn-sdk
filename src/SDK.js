import PctAdapter from './PctAdapter'
import MetadataAdapter from './MetadataAdapter'
import BookmarkAdapter from './BookmarkAdapter'

export default new (class SDK {

  pctAdapter
  metadataAdapter

  bookmarks

  constructor() {
    this.pctAdapter = new PctAdapter()
    this.metadataAdapter = new MetadataAdapter()

    this.bookmarks = new BookmarkAdapter()
  }

  /**
   * Can be used to overwrite the adapter that checks if shows / movies are bookmarked
   *
   * @param bookmarkAdapter
   */
  setBookmarkAdapter = (bookmarkAdapter) => {
    this.bookmarks = bookmarkAdapter
  }

  getMovies = (page = 1, filters = {}) => (
    this.pctAdapter.getMovies(page, filters)
      .then(this.bookmarks.checkMovies)
  )

  getMovie = (itemId) => (
    this.pctAdapter.getMovie(itemId)
      .then(this.bookmarks.checkMovie)
  )

  getShows = (page = 1, filters = {}) => (
    this.pctAdapter.getShows(page, filters)
      .then(this.bookmarks.checkShows)
  )

  getShow = (itemId) => (
    this.getShowBasic(itemId)
      .then(this.getShowMeta)
  )

  getShowBasic = itemId => (
    this.pctAdapter.getShow(itemId)
      .then(this.bookmarks.checkShow)
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
