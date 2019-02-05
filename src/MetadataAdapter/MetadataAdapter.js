import TraktMetadataProvider from './TraktMetadataProvider'
import TmdbMetadataProvider from './TmdbMetadataProvider'

export default class MetadataAdapter {

  traktProvider

  tmdbProvider

  constructor() {
    this.traktProvider = new TraktMetadataProvider()
    this.tmdbProvider = new TmdbMetadataProvider()
  }

  /**
   * Adds trailer and ids to the show
   *
   * @param item
   * @returns {*}
   */
  getShowIds = item => {
    if (item.id || item.ids.imdb) {
      return this.traktProvider.getShowByItem(item)

    } else if (item.ids.tmdb) {
      return this.traktProvider.searchShowByTmdb(item)
    }

    throw Error('No id to use to retrieve show with!')
  }

  getAdditionalShowSeasonsMeta = item => this.tmdbProvider.getSeasons(item)

  getAdditionalSeasonAndEpisodesInfo = (...args) => this.tmdbProvider.getSeasonAndEpisodes(...args)

  getShowRecommendations = (...args) => this.tmdbProvider.getTvRecommendations(...args)

}
