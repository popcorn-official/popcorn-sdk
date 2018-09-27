const sizes = ['Bytes/s', 'KB/s', 'MB/s']

export default (bytes) => {
  if (bytes === 0) {
    return '0 Byte'
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)

  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`
}
