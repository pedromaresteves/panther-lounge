import getPageResults from "./getPageResults.js";

export default function deleteSong() {
    
    const yourSongsTitle = document.querySelector("#error-message");
    const deleteSongsButtons = document.getElementsByClassName("delete-song");
    
    function deleteSong(e){
      e.preventDefault();
      let currentPage = 1;
      const eventTarget = e.target;
      const itemToRemove = document.querySelector("a[href='" + eventTarget.attributes.href.value + "'").parentElement;
      const songToDeleteUrl = eventTarget.href;
      let httpRequest;
    
      httpRequest = new XMLHttpRequest();
      if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
      }
    
      httpRequest.onreadystatechange = function(){  
          if(httpRequest.readyState === 4){
            const response = JSON.parse(httpRequest.response);
            var errorDiv = document.createElement("div"); 
            var errorMsg = document.createTextNode(response.deletedMsg); 
            errorDiv.className += "m-1 text-center text-monospace bg-info text-white";
            errorDiv.appendChild(errorMsg);
            itemToRemove.remove();
            yourSongsTitle.appendChild(errorDiv);
            var intervalID = window.setInterval(function(){
              yourSongsTitle.removeChild(errorDiv);
              if(response.redirectUrl){
                window.location = response.redirectUrl;
              }
              clearInterval(intervalID);
            }, 2500);
            if(window.location.search.match(/[0-9]/g)){
              currentPage = window.location.search.match(/[0-9]/g).join("")
            } 
            getPageResults(currentPage);
          }
      };
      httpRequest.open('DELETE', songToDeleteUrl);
      httpRequest.send();
      }
    
      for(let i = 0; i<deleteSongsButtons.length; i++){
        deleteSongsButtons[i].addEventListener("click", deleteSong);
      }  
} 