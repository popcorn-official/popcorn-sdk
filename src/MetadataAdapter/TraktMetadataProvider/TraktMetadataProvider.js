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

  getIds = itemId => this.trakt.get(`shows/${itemId}`).then(({ data }) => data)

}
