import axios from 'axios'
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

  getSeasons = (itemId, tmdbId, pctSeasons) =>
    this.tmdb.get(`tv/${tmdbId}`)
      .then(({ data }) => this.formatSeasons(data.seasons, pctSeasons, itemId, tmdbId))

  formatSeasons = (seasons, pctSeasons, itemId, tmdbId, watchedEpisodes) => Promise.all(
    seasons.filter(({ season_number, episode_count }) =>
      season_number !== 0 &&  // Remove all specials
      episode_count > 0,       // Remove all seasons that are not aired and don't have episodes
    ).map(season =>
      this.getSeasonAndEpisodes(
        season.season_number,
        tmdbId,
        pctSeasons.find(pctSeason => pctSeason.number === season.season_number),
        itemId,
        watchedEpisodes,
      ),
    ),
  )

  getSeasonAndEpisodes = (seasonNr, tmdbId, pctSeason, itemId) => (
    this.tmdb.get(`tv/${tmdbId}/season/${seasonNr}`).then(({ data }) => ({
      ...pctSeason,
      title   : data.name,
      summary : data.overview,
      episodes: this.formatEpisodes(pctSeason, data.episodes, itemId),
      showId  : itemId,
      season  : data.season_number,
      number  : data.season_number,
      images  : formatImage({ poster: this.imageUri + data.poster_path }),
    }))
  )

  formatEpisodes = (pctSeason, episodes, itemId) => episodes.map((episode) => {
    const pctEpisode = this.getPctEpisodeFromPctSeason(pctSeason, episode.episode_number)

    return {
      ...pctEpisode,
      key        : `${episode.season_number}-${episode.episode_number}`,
      id         : episode.id,
      showId     : itemId,
      title      : episode.name,
      summary    : episode.overview,
      number     : episode.episode_number,
      episode    : episode.episode_number,
      season     : episode.season_number,
      aired      : new Date(episode.air_date).getTime(),
      images     : formatImage({ poster: this.imageUri + episode.still_path }),
      torrents   : this.getEpisodeTorrents(pctEpisode),
      hasTorrents: this.hasTorrents(pctEpisode),
    }
  })

  hasTorrents = (pctEpisode) => !!pctEpisode.torrents

  getEpisodeTorrents = (pctEpisode) => {
    if (!this.hasTorrents(pctEpisode)) {
      return {
        '1080p': null,
        '720p' : null,
        '480p' : null,
      }
    }

    return pctEpisode.torrents
  }

  getPctEpisodeFromPctSeason = (pctSeason, episodeNumber) => {
    if (pctSeason) {
      const episode = pctSeason.episodes.find(pctEpisode => pctEpisode.number === episodeNumber)

      if (episode) {
        return episode
      }
    }

    return {}
  }

}
