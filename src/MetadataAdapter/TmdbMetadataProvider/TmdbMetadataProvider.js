import axios from 'axios'
import * as Constants from '../../constants'
import * as PctHelpers from '../../PctAdapter/PctHelpers'
import formatImage from '../../utils/formatImage'

export default class TmdbMetadataProvider {

  key = '809858c82322872e2be9b2c127ccdcf7'

  imageUri = 'https://image.tmdb.org/t/p/w500/'

  apiUri = 'https://api.themoviedb.org/3/'

  tmdb

  constructor() {
    this.tmdb = axios.create({
      baseURL: this.apiUri,
      params : {
        api_key: this.key,
      },
    })
  }

  getTvRecommendations = (item) => (
    this.tmdb.get(`tv/${item.tmdb_id}/recommendations`)
      .then(({ data }) => this.formatShow(data.results))
  )

  formatShow = shows => (
    shows.map(show => ({
      id        : null,
      imdb_id   : null,
      tmdb_id   : show.id,
      title     : show.original_name,
      year      : null,
      images    : formatImage({
        poster  : this.imageUri + show.poster_path,
        backdrop: this.imageUri + show.backdrop_path,
      }),
      rating    : PctHelpers.formatRating({ percentage: show.vote_average }),
      seasons   : [],
      num_seasons: null,
      type      : Constants.TYPE_SHOW,
      watched   : {
        complete: false,
        progress: 0,
      },
    }))
  )

}
