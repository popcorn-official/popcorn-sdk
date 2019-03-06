export const formatSeasonEpisodeToString = (season, episode) => (
  `s${String(season).length === 1 ? `0${String(season)}` : String(season)
    }e${String(episode).length === 1 ? `0${String(episode)}` : String(episode)}`
)

export default (title, season = null, episode = null) => {
  const searchTitle = title.toLowerCase().replace(' ', '.')

  if (season == null && episode === null) {
    return searchTitle
  }

  return `${searchTitle}.${formatSeasonEpisodeToString(season, episode)}`
}
