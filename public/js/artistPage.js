import deleteSong from "./deleteSong.js";
import getPageResults from "./getPageResults.js";
export default function artistPage() {
  if(!window.location.search.match(/[0-9]/g)){
    getPageResults(1, true);
  } else {
    let currentPage = window.location.search.match(/[0-9]/g).join("");
    getPageResults(currentPage);
  }
  deleteSong();
}