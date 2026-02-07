export default function Ship(length, type, count = 0) {
  let hitCount = count
  function hit() {
    hitCount++
  }

  function isSunk() {
    return hitCount === length ? true : false
  }

  function shipInfo() {
    return {type, length}
  }


  return {
    hitCount() {
      return hitCount
    },
    hit,
    shipInfo,
    isSunk,
  }
}
