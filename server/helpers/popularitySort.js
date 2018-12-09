function popularitySort(a, b) {
    const valueA = a.popularity;
    const valueB = b.popularity;
  
    let comparison = 0;
    if (valueA > valueB) {
      comparison = -1;
    } else if (valueA < valueB) {
      comparison = 1;
    }
    return comparison;
}
module.exports = popularitySort