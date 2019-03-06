export default (metadata) => {
  if (metadata.includes('french')) return true
  if (metadata.includes('german')) return true
  if (metadata.includes('greek')) return true
  if (metadata.includes('dutch')) return true
  if (metadata.includes('hindi')) return true
  if (metadata.includes('português')) return true
  if (metadata.includes('portugues')) return true
  if (metadata.includes('spanish')) return true
  if (metadata.includes('español')) return true
  if (metadata.includes('espanol')) return true
  if (metadata.includes('latino')) return true
  if (metadata.includes('russian')) return true

  return metadata.includes('subtitulado')
}
