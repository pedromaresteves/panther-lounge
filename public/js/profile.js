import deleteSong from "./deleteSong.js";
import getPageResults from "./getPageResults.js";
export default function profile() {
  if(!window.location.search.match(/[0-9]/g)){
    getPageResults(1);
  } else {
    let currentPage = window.location.search.match(/[0-9]/g).join("");
    getPageResults(currentPage);
  }
  deleteSong();
}