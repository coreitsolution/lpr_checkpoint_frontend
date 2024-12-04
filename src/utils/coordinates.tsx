export const isValidLatitude = (lat: number): boolean => {
  return !isNaN(lat) && lat >= -90 && lat <= 90
}

export const isValidLongitude = (lng: number): boolean => {
  return !isNaN(lng) && lng >= -180 && lng <= 180
}

export const parseCoordinates = (input: string): { lat: number, lng: number } | null => {
  const coords = input.split(',').map(coord => parseFloat(coord.trim()))
  
  if (coords.length === 2 && isValidLatitude(coords[0]) && isValidLongitude(coords[1])) {
    return { lat: coords[0], lng: coords[1] }
  }
  
  return null
}