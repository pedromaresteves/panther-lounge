import deleteSong from "./deleteSong.js";
import pagination from "./pagination.js";
export default function getPageResults(currentPage) {
    let partialPath;
    
    if(window.location.pathname.indexOf('guitar-chords') !== -1) partialPath = window.location.pathname.replace("guitar-chords", "api")
    if(window.location.pathname.indexOf('profile') !== -1) partialPath = window.location.pathname.replace("profile/", "api/profile")
    console.log(`${window.location.origin}${partialPath}?page=${currentPage}`);
    let httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
    alert('Giving up :( Cannot create an XMLHTTP instance');
    return false;
    }
    
    httpRequest.onreadystatechange = function(){    
        const resultsComponent = document.querySelector("#page-results");
        const paginationComponent = document.querySelector('#pag-nav ul');
        let newResultsHtml = ``;
        let paginationHtml = ``;
        if(httpRequest.readyState === 4){
        const response = JSON.parse(httpRequest.response);
        if(response.name === 'paginationArtists'){
            response.visibleResults.forEach(function(item){
            newResultsHtml += `<li class="list-group-item artist-item"><a href="/guitar-chords/${item.link}">${item.artist}</a><span>${item.nOfSongs} songs</span></li>`;
            });
        }
        if(response.name === 'paginationSongsByArtist'){
            response.visibleResults.forEach(function(item){
            newResultsHtml += `<li class="list-group-item artist-item"><a href="${response.escapedArtist}/${item.link}">${item.title}</a><span><a href="edit-song/${response.escapedArtist}/${item.link}" class="mr-3">Edit</a><a href="/" data-toggle="modal" data-target="#modal-${item.title.replace(/\s/g, "")}">Delete</a></span></li>
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
                        <a class="delete-song" data-dismiss="modal" href="${response.escapedArtist}/${item.link}">Delete Song</a>
                    </div>
                    </div>
                </div>
            </div>`
            });
        }
        for(let i = 1; i <= response.numOfPages; i++) {
            if(i == response.currentPage) {
                paginationHtml += `<li class="page-item"><a class="page-link clicked-page-button" href="#"> ${i} </a></li>`; 
            }else {
                paginationHtml += `<li class="page-item"><a class="page-link" href="#"> ${i} </a></li>`;
            }
        }
        resultsComponent.innerHTML = newResultsHtml;
        paginationComponent.innerHTML = paginationHtml;
        pagination();
        deleteSong();
        }
    };

    httpRequest.open('GET', `${window.location.origin}${partialPath}?page=${currentPage}`);
    httpRequest.send();
}