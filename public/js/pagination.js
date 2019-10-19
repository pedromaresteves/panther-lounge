import getPageResults from "./getPageResults.js";

export default function pagination() {

    const pages = document.querySelectorAll("#pag-nav ul li");
    for(let i = 0; i< pages.length; i++){
      pages[i].addEventListener("click", pageAction);
    }


  function pageAction(e){
    e.preventDefault();
    let selectedPage = e.target.textContent.replace(/\s/g, "");;

    //UPDATE URL
    history.pushState({
      id: `page ${e.target.textContent}`
    }, 'New Page', `${e.target.origin}${e.target.pathname}?page=${e.target.textContent}`);

    //UPDATE PRESSED BUTTON COLOR
    for(let i = 0; i< pages.length; i++){
      pages[i].firstChild.classList.remove("clicked-page-button");
    }
    e.target.classList.add("clicked-page-button");

    getPageResults(selectedPage);
  }
}