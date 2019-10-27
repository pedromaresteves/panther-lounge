import getPageResults from "./getPageResults.js";

export default function pagination() {

    const pages = document.querySelectorAll("#pag-nav ul li");
    for(let i = 0; i< pages.length; i++){
      pages[i].addEventListener("click", pageAction);
    }


  function pageAction(e){
    e.preventDefault();
    let selectedPage = e.target.textContent.replace(/\s/g, "");

    //UPDATE URL
    history.pushState({
      id: `page ${selectedPage}`
    }, 'New Page', `${e.target.origin}${e.target.pathname}?page=${selectedPage}`);

    getPageResults(selectedPage);
  }
}