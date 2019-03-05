import PctAdapter from './PctAdapter'
import MetadataAdapter from './MetadataAdapter'
import SubsAdapter from './SubsAdapter'
import SearchAdapter from './SearchAdapter'

import * as Constants from './constants'

export default new (class SDK {

  pctAdapter
  metadataAdapter
  subsAdapter
  searchAdapter

  adapters = []

  constructor() {
    this.pctAdapter = new PctAdapter()
    this.metadataAdapter = new MetadataAdapter()
    this.subsAdapter = new SubsAdapter()
    this.searchAdapter = new SearchAdapter()
  }

  addAdapter = (adapter) => {
    this.adapters.push(adapter)
  }

  getMovies = (page = 1, filters = {}) => (
    this.pctAdapter.getMovies(page, filters)
      .then(this.checkAdapters('checkMovies'))
  )

  getMovie = (item) => {
    if (!item.ids || !item.ids.imdb) {
      throw Error(`"ids.imdb" is required to retrieve a movie!`)
    }

    return (
      this.pctAdapter.getMovie(item.ids.imdb)
        .then(this.checkAdapters('checkMovie'))
    )
  }

  getShows = (page = 1, filters = {}) => (
    this.pctAdapter.getShows(page, filters)
      .then(this.checkAdapters('checkShows'))
  )

  getShow = async(item) => {
    if (item.ids.imdb) {
      return this.getShowBasic(item.ids.imdb)
        .then(this.getShowMeta)

    } else if (item.ids.tmdb) {
      // If we don't have the IMDB id but we have TMDB id we need a additional call

      const veryBasicShow = await this.metadataAdapter.getShowIds(item)
      const pctShow = await this.getShowBasic(veryBasicShow)

      return this.getShowSeasonsMeta({
        ...pctShow,
        ...veryBasicShow,
      })
    }
  }

  getShowBasic = imdbID => (
    this.pctAdapter.getShow(imdbID)
      .then(this.checkAdapters('checkShow'))
  )

  getShowMeta = pctShow => this.metadataAdapter
    .getShowIds(pctShow)
    .then(this.getShowSeasonsMeta)

  getShowIds = pctShow => this.metadataAdapter.getShowIds(pctShow)

  getShowSeasonsMeta = pctShow => this.metadataAdapter
    .getAdditionalShowSeasonsMeta(pctShow)
    .then(seasons => ({
      ...pctShow,
      seasons,
    }))

  getShowRecommendations = (...args) => this.metadataAdapter.getShowRecommendations(...args)

  checkAdapters = (method) => async(items) => {
    for (let i = 0; i < this.adapters.length; i++) {
      items = await this.adapters[i][method](items)
    }

    return items
  }

  searchEpisode = (...args) => this.searchAdapter.searchEpisode(...args)

  search = (...args) => this.searchAdapter.search(...args)

  searchForSubtitles = (item, torrent = null, season = null, episode = null) => (
    this.subsAdapter.searchSubtitles(item, torrent, season, episode)
  )

})()
