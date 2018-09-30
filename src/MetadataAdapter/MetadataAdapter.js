import TraktMetadataProvider from './TraktMetadataProvider'
import TmdbMetadataProvider from './TmdbMetadataProvider'

export default class MetadataAdapter {

  traktProvider

  tmdbProvider

  constructor() {
    this.traktProvider = new TraktMetadataProvider()
    this.tmdbProvider = new TmdbMetadataProvider()
  }

  getSeasons = (itemId, pctSeasons) => new Promise((resolve) => {
    this.traktProvider.getIds(itemId).then(({ ids: { tmdb } }) => (
        this.tmdbProvider.getSeasons(itemId, tmdb, pctSeasons).then(resolve)
      ),
    )
  })

}
