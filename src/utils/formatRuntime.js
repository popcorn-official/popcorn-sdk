export default (runtimeInMinutes) => {
  const hours = runtimeInMinutes >= 60 ? Math.round(runtimeInMinutes / 60) : 0
  const minutes = runtimeInMinutes % 60

  return {
    full: hours > 0
      ? `${hours} ${hours > 1 ? 'hours' : 'hour'}${minutes > 0
        ? ` ${minutes} minutes`
        : ''}`
      : `${minutes} minutes`,

    short: hours > 0
      ? `${hours} ${hours > 1 ? 'hrs' : 'hr'}${minutes > 0
        ? ` ${minutes} min`
        : ''}`
      : `${minutes} min`,

    hours,
    minutes,
    inMinutes: parseInt(runtimeInMinutes, 10),
  }
}
