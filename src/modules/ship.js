export default function Ship(length, count = 0) {
  let hitCount = count
  function hit() {
    hitCount++
  }

  function isSunk() {
    return hitCount === length ? true : false
  }

  function shipLength() {
    return length
  }

  return {
    hitCount() {
      return hitCount
    },
    hit,
    shipLength,
    isSunk,
  }
}
