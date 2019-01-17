import TraktMetadataProvider from './TraktMetadataProvider'
import TmdbMetadataProvider from './TmdbMetadataProvider'

export default class MetadataAdapter {

  tmdbProvider

  traktProvider

  constructor() {
    this.tmdbProvider = new TmdbMetadataProvider()
    this.traktProvider = new TraktMetadataProvider()
  }

  /**
   * Get a show it's ids
   *
   * @param tmdb_id
   * @returns {*}
   */
  getShowIds = tmdb_id => this.traktProvider.searchShowByTmdb(tmdb_id)

  getShowRecommendations = (...args) => this.tmdbProvider.getTvRecommendations(...args)

}
