import deleteSong from "./deleteSong.js";

export default function pagination() {

    const pages = document.querySelectorAll("#pag-nav ul li");
    for(let i = 0; i< pages.length; i++){
      pages[i].addEventListener("click", pageAction);
    }


  function pageAction(e){
    e.preventDefault();
    let selectedPage = e.target.textContent;
    let httpRequest;

    //UPDATE URL
    history.pushState({
      id: `page ${e.target.textContent}`
    }, 'New Page', `${e.target.origin}${e.target.pathname}?page=${e.target.textContent}`);

    //UPDATE PRESSED BUTTON COLOR
    for(let i = 0; i< pages.length; i++){
      pages[i].firstChild.classList.remove("clicked-page-button");
    }
    e.target.classList.add("clicked-page-button")
    
    //AJAX REQUEST
    httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }

    httpRequest.onreadystatechange = function(){    
        const pageComponent = document.querySelector("#page-results");
        let newResultsHtml = ``;
        if(httpRequest.readyState === 4){
          const response = JSON.parse(httpRequest.response);
          if(response.length == 1){
            response[0].forEach(function(item){
              newResultsHtml += `<li class="list-group-item artist-item"><a href="/guitar-chords/${item.link}">${item.artist}</a><span>${item.nOfSongs} songs</span></li>`;
            });
          } else{
            response[0].forEach(function(item){
              newResultsHtml += `<li class="list-group-item artist-item"><a href="${response[1]}/${item.link}">${item.title}</a><span><a href="edit-song/${response[1]}/${item.link}" class="mr-3">Edit</a><a href="/" data-toggle="modal" data-target="#modal-${item.title.replace(/\s/g, "")}">Delete</a></span></li>
              <div class="modal fade" id="modal-${item.title.replace(/\s/g, "")}" tabindex="-1" role="dialog" aria-labelledby="${item.link}-label" aria-hidden="true">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${item.link}-label">Delete Song Warning</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this song?
                    </div>
                    <div class="modal-footer">
                        <a id="closeDialog" href="/" data-dismiss="modal">Close</a>
                        <a class="delete-song" data-dismiss="modal" href="${response[1]}/${item.link}">Delete Song</a>
                    </div>
                    </div>
                </div>
            </div>`
            });
          }
          pageComponent.innerHTML = newResultsHtml;
          deleteSong();
        }
    };
    httpRequest.open('GET', `${window.location.origin}${window.location.pathname.replace("guitar-chords", "api")}?page=${selectedPage}`);
    httpRequest.send();
    }
}