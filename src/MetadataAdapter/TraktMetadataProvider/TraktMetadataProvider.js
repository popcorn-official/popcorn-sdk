import axios from 'axios'

export default class TraktMetadataAdapter {

  apiUri = 'https://api.trakt.tv'

  clientId = '647c69e4ed1ad13393bf6edd9d8f9fb6fe9faf405b44320a6b71ab960b4540a2'

  trakt

  constructor() {
    this.trakt = axios.create({
      baseURL: this.apiUri,

      headers: {
        'Content-Type'     : 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key'    : this.clientId,
      },
    })
  }

  searchShowByTmdb = tmdb_id => (
    this.trakt.get(`search/tmdb/${tmdb_id}`, { params: { type: 'show' } }) // extended: 'full'
      .then(({ data }) => {
        if (data.length > 0) {
          return this.formatIds(data.shift().show)
        }

        throw Error(`TraktMetadataAdapter: No show found with tmdb id ${tmdb_id}`)
      })
  )

  formatIds = traktShow => ({
    id     : traktShow.ids.imdb,
    imdb_id: traktShow.ids.imdb,
    tmdb_id: traktShow.ids.tmdb,
    tvdb_id: traktShow.ids.tvdb,
  })

}
