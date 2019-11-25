import deleteSong from "./deleteSong.js";
import pagination from "./pagination.js";
export default function getPageResults() {
    let path = window.location.origin + "/api" + window.location.pathname + window.location.search;

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
                newResultsHtml = genGuitarChordsIndexResults(response);
            }
            if(response.name === 'paginationSongsByArtist'){
                const artistTitleElement = document.querySelector('#artist-title');
                const breadcrumbArtist = document.querySelector('#breadcrumb-artist');
                breadcrumbArtist.innerHTML = response.visibleResults[0].artist;
                artistTitleElement.innerHTML = `${response.visibleResults[0].artist} Songs`;
                newResultsHtml = genArtistPageResults(response);
            }
            if(response.name === 'profileSongs'){
                const sexyLevel = Math.floor((Math.random() * 1000) + 1);
                const profileStats = document.querySelector('#profile-stats');
                profileStats.innerHTML = `<strong>Total Songs: </strong>${response.visibleResults.length}<br>
                                        <strong>Your sexyness level at the moment: </strong>${sexyLevel}`; 
                newResultsHtml = genProfileResults(response);
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

    httpRequest.open('GET', path);
    httpRequest.send();
}

function genGuitarChordsIndexResults(res){
    let html = '';
    res.visibleResults.forEach(function(item){
        html += `<li class="list-group-item artist-item"><a class="col-6 text-truncate" href="/guitar-chords/${item.artistPath}">${item.artist}</a><span>${item.nOfSongs} song(s)</span></li>`;
    });
    return html;
}
function genArtistPageResults(res){
    let html = '';
    res.visibleResults.forEach(function(item){
        html += `<li class="list-group-item artist-item text-center"><a class="col-12 text-center text-truncate" href="${res.artistPath}/${item.songPath}">${item.title}</a></li>`
        });
    return html;
}
function genProfileResults(res){
    let html = '';
    let counter = 0;
    res.visibleResults.forEach(function(item){      
        html += `<li class="list-group-item artist-item"><a class="col-4 d-none d-sm-block text-left text-truncate" href="/guitar-chords/${item.artistPath}">${item.artist}</a><a class="col-4 text-left text-truncate" href="/guitar-chords/${item.artistPath}/${item.songPath}">${item.title}</a><span class="col-md-2 text-right"><a href="/guitar-chords/edit-song/${item.artistPath}/${item.songPath}" class="mr-3">Edit</a><a href="#" data-toggle="modal" data-target="#modal-${counter}">Delete</a></span></li>
        <div class="modal fade" id="modal-${counter}" tabindex="-1" role="dialog" aria-labelledby="delete-song-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="delete-song-warning-label">Delete Song Warning</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this song?
                </div>
                <div class="modal-footer">
                    <a id="closeDialog" href="/" data-dismiss="modal">Close</a>
                    <a class="delete-song" data-dismiss="modal" href="/api/guitar-chords/${item.artistPath}/${item.songPath}">Delete Song</a>
                </div>
                </div>
            </div>
        </div>`
        counter++;
        });
    return html;
}