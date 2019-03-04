export const formatSeasonEpisodeToString = (season, episode) => (
  `s${String(season).length === 1 ? `0${String(season)}` : String(season)
    }e${String(episode).length === 1 ? `0${String(episode)}` : String(episode)}`
)

export default (title, season, episode) => {
  const searchTitle = title.toLowerCase().replace(' ', '.')

  return `${searchTitle}.${formatSeasonEpisodeToString(season, episode)}`
}
