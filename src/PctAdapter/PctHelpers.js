import * as Constants from '../constants'
import getHealth from '../utils/getHealth'
import formatImage from '../utils/formatImage'

export const formatTorrents = (torrents, type = 'movie') => {
  const formatTorrent = (torrent, quality) => ({
    ...torrent,
    quality,
    health: getHealth(torrent.seed || torrent.seeds, torrent.peer || torrent.peers),
    seeds : torrent.seed || torrent.seeds,
    peers : torrent.peer || torrent.peers,
  })

  if (type === 'movie') {
    return {
      '1080p': !torrents['1080p'] ? null : formatTorrent(torrents['1080p'], '1080p'),
      '720p' : !torrents['720p'] ? null : formatTorrent(torrents['720p'], '720p'),
    }
  }

  return {
    '1080p': !torrents['1080p'] ? null : formatTorrent(torrents['1080p'], '1080p'),
    '720p' : !torrents['720p'] ? null : formatTorrent(torrents['720p'], '720p'),
    '480p' : !torrents['480p'] ? null : formatTorrent(torrents['480p'], '480p'),
  }
}

export const formatRating = rating => ({
  stars: (rating.percentage / 100) * 5,
  ...rating,
})

export const formatShowEpisodes = (episodes) => {
  const seasons = []

  episodes.forEach((episode) => {
    if (!seasons[episode.season]) {
      seasons[episode.season] = {
        title   : null,
        summary : null,
        showId  : null,
        season  : parseInt(episode.season, 10), // Make sure it's a number
        number  : parseInt(episode.season, 10), // Make sure it's a number
        type    : Constants.TYPE_SHOW_SEASON,
        episodes: [],
        images  : formatImage(),
      }
    }

    seasons[episode.season].episodes.push({
      key        : `${episode.season}-${episode.episode}`,
      id         : null,
      showId     : null,
      title      : episode.title,
      summary    : episode.overview,
      season     : parseInt(episode.season, 10), // Make sure it's a number
      episode    : parseInt(episode.episode, 10), // Make sure it's a number
      number     : parseInt(episode.episode, 10), // Make sure it's a number
      aired      : new Date(episode.first_aired).getTime(),
      torrents   : formatTorrents(episode.torrents, 'show'),
      hasTorrents: true,
      images     : formatImage(),
      type       : Constants.TYPE_SHOW_EPISODE,
      watched    : {
        complete: false,
        progress: 0,
      },
    })
  })

  return seasons.filter(Boolean)
}
