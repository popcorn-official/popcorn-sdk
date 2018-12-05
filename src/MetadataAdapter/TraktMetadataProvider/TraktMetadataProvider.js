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

  getShowByItem = item => (
    this.trakt.get(`shows/${item.id || item.ids.imdb}`, { params: { extended: 'full' } })
      .then(({ data }) => this.formatShow(item, data))
  )

  searchShowByTmdb = item => (
    this.trakt.get(`search/tmdb/${item.ids.tmdb}`, { params: { type: 'show', extended: 'full' } })
      .then(({ data }) => {
        if (data.length > 0) {
          return this.formatShow(item, data[0].show)
        }

        throw Error(`TraktMetadataAdapter: No show found with tmdb id ${item.ids.tmdb}`)
      })
  )

  formatShow = (show, traktShow) => ({
    ...show,
    id     : traktShow.ids.imdb,
    ids    : traktShow.ids,
    trailer: traktShow.trailer,
  })

}
