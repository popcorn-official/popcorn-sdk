import axios from 'axios'
import hasOwnProperty from '../../utils/hasOwnProperty'

import * as Constants from '../../constants'

export default class TmdbMetadataProvider {

  key = '809858c82322872e2be9b2c127ccdcf7'

  imageUri = 'https://image.tmdb.org/t/p/'

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

  getSeasons = (itemId, tmdbId, pctSeasons) =>
    this.tmdb.get(`tv/${tmdbId}`)
      .then(({ data }) => this.formatSeasons(data.seasons, pctSeasons, itemId, tmdbId))

  formatSeasons = (seasons, pctSeasons, itemId, tmdbId, watchedEpisodes) => Promise.all(
    seasons.map(season =>
      this.getSeasonAndEpisodes(
        season.season_number,
        tmdbId,
        pctSeasons[season.season_number],
        itemId,
        watchedEpisodes,
      ),
    ),
  )

  getSeasonAndEpisodes = (seasonNr, tmdbId, pctSeason, itemId) => (
    this.tmdb.get(`tv/${tmdbId}/season/${seasonNr}`).then(({ data }) => ({
      title   : data.name,
      summary : data.overview,
      episodes: this.formatEpisodes(pctSeason, data.episodes, itemId),
      showId  : itemId,
      number  : data.season_number,
      type    : Constants.TYPE_SHOW_SEASON,
      images  : this.formatImage(data.poster_path),
    }))
  )

  formatEpisodes = (pctSeason, episodes, itemId) => episodes.map(episode => ({
    id         : episode.id,
    showId     : itemId,
    title      : episode.name,
    summary    : episode.overview,
    number     : episode.episode_number,
    season     : episode.season_number,
    type       : Constants.TYPE_SHOW_EPISODE,
    aired      : new Date(episode.air_date).getTime(),
    images     : this.formatImage(episode.still_path),
    torrents   : this.getEpisodeTorrents(pctSeason, episode.episode_number),
    hasTorrents: this.hasTorrents(pctSeason, episode.episode_number),
    watched    : {
      complete: false,
      progress: 0,
    },
  }))

  hasTorrents = (pctSeason, episodeNumber) => (
    pctSeason && hasOwnProperty(pctSeason, episodeNumber)
  )

  getEpisodeTorrents = (pctSeason, episodeNumber) => {
    if (!this.hasTorrents(pctSeason, episodeNumber)) {
      return {
        '1080p': null,
        '720p' : null,
        '480p' : null,
      }
    }

    return pctSeason[episodeNumber].torrents
  }

  formatImage = (image) => {
    const replaceWidthPart = (uri, size) => this.imageUri + size + uri

    return {
      poster: {
        full  : image ? replaceWidthPart(image, 'original') : null,
        high  : image ? replaceWidthPart(image, 'w1280') : null,
        medium: image ? replaceWidthPart(image, 'w780') : null,
        thumb : image ? replaceWidthPart(image, 'w342') : null,
      },
    }
  }

}
