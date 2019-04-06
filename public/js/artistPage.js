export default function artistPage() {

const menu = document.getElementById("available-songs");
const deleteSongsButtons = document.getElementsByClassName("delete-song");

function deleteSong(e){
  e.preventDefault()
  const eventTarget = e.target;
  const itemToRemove = document.querySelector("a[href='" + eventTarget.attributes.href.value + "'").parentElement; 
  const songToDeleteUrl = eventTarget.href.replace("guitar-chords", "api");
  var httpRequest;

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
        errorDiv.className += "text-muted text-center text-monospace";
        errorDiv.appendChild(errorMsg);
        itemToRemove.remove();
        menu.prepend(errorDiv);
        var intervalID = window.setInterval(function(){
          menu.removeChild(errorDiv);
          clearInterval(intervalID);
          if(response.redirectUrl){
            window.location = response.redirectUrl;
          }
        }, 1500);
      }
  };
  httpRequest.open('DELETE', songToDeleteUrl); //MAKE FUNCTION WORK
  httpRequest.send();
}

for(let i = 0; i<deleteSongsButtons.length; i++){
  deleteSongsButtons[i].addEventListener("click", deleteSong);
}



  
//   deleteSongsButtons.addEventListener("click", deleteSong);
//TODO PREVENT DEFAULT AND MAKE A DELETE CALL TO DELETE SONG WHEN CLICKING BUTTON
}