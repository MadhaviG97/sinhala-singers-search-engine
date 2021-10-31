export function sortGenres(data) {
  let genres = data?.genres;
  let sortedGenres = [];
  for (let item in genres) {
    sortedGenres.push({ label: genres[item]["key"], count: genres[item]["doc_count"] });
  }

  sortedGenres
    .sort((a, b) => {
      return a.count - b.count;
    })
    .reverse();
  return sortedGenres;
}
