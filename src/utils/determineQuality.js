import hasNonEnglishLanguage from './hasNonEnglishLanguage'

export default (magnet) => {
  const lowerCaseMetadata = magnet.toLowerCase()

  // Filter non-english languages
  if (hasNonEnglishLanguage(lowerCaseMetadata)) {
    return null
  }

  // Most accurate categorization
  if (lowerCaseMetadata.includes('1080')) return '1080p'
  if (lowerCaseMetadata.includes('720')) return '720p'
  if (lowerCaseMetadata.includes('480')) return '480p'

  // Guess the quality 1080p
  if (lowerCaseMetadata.includes('bluray')) return '1080p'
  if (lowerCaseMetadata.includes('blu-ray')) return '1080p'

  // Guess the quality 720p, prefer english
  if (lowerCaseMetadata.includes('dvd')) return '720p'
  if (lowerCaseMetadata.includes('rip')) return '720p'
  if (lowerCaseMetadata.includes('mp4')) return '720p'
  if (lowerCaseMetadata.includes('web')) return '720p'
  if (lowerCaseMetadata.includes('hdtv')) return '720p'
  if (lowerCaseMetadata.includes('eng')) return '720p'

  return null
}
