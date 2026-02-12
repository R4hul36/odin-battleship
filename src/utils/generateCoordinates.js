export function generateRandomCoordinates() {
  const x = Math.floor(Math.random() * 10)
  const y = Math.floor(Math.random() * 10)
  return [x, y]
}

export function randomOrientation() {
  const orientations = ['horizontal', 'vertical']
  return orientations[Math.floor(Math.random() * 2)]
}

export function generateRandomNumber (range) {
  return Math.floor(Math.random()*range)
}