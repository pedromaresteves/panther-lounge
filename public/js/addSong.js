export default function addSong() {

    //DOM Variables
    const form = document.querySelector('form');
    let artistField = document.querySelector('input[name=artist]');
    let titleField = document.querySelector('input[name=title]');
    const formFields = [artistField,titleField];
    let lyricsChordsSender = document.querySelector('input[name=lyrics]');
    let sendFormButton = document.querySelector('#submitButton');
    const addSongApiUrl = window.location.origin + "/api" + window.location.pathname;
    console.log(addSongApiUrl);

    //Quill settings
    var quill = new Quill('#editor', {
        modules: {
            toolbar: '#toolbar'
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
        });
    
    //If editing a song, we get the lyrics and chords and fill the text editor
    if(lyricsChordsSender.value){
        const songContent = JSON.parse(lyricsChordsSender.attributes.value.value).ops;
        let contentToBeSet = [];
        songContent.forEach(function(item){
            contentToBeSet.push(item)
        });
        quill.setContents(contentToBeSet)
    }

    //If editing a song, don't allow user to edit Artist Name
    if(window.location.pathname.indexOf("/edit-song/") !== -1){
        artistField.disabled = true;
    }
    

    //Check if Value is empty
    function checkEmptyValues(fieldValue){
    if(fieldValue === "") return false;
    return true;
    }

    //Check Form Values
    function checkFormValues(artist, title){
    let test = {
        errors: false,
        msg: ""
    }
    if(checkEmptyValues(artist) === false) test.msg += "You must insert an Artist <br>";
    if(checkEmptyValues(title) === false) test.msg += "You must insert a Title <br>";
    if(test.msg.length > 0) test.errors = true;
    return test;
    }

    //Only allow saving if all field have values
    for(let i=0; i<formFields.length; i++){
        formFields[i].addEventListener('blur', function( event ) {
            let checkForm = checkFormValues(artistField.value,titleField.value);
            if(checkForm.errors === false ){
            sendFormButton.disabled = false;
            } else {
            sendFormButton.disabled = true;
            }
        });
    }
    if(checkFormValues(artistField.value,titleField.value).errors === false) sendFormButton.disabled = false;

    //Submiting Quill content through form
    form.onsubmit = function(e) {
        lyricsChordsSender.value = JSON.stringify(quill.getContents());
        const songData = JSON.stringify({
            artist:artistField.value,
            title: titleField.value,
            lyricsAndChords: lyricsChordsSender.value
        });
        var httpRequest;
    

        e.preventDefault();
        httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
          alert('Giving up :( Cannot create an XMLHTTP instance');
          return false;
        }
    
        httpRequest.onreadystatechange = function(){    
            if(httpRequest.readyState === 4){
              const response = JSON.parse(httpRequest.response);
              if(response.errorMsg){
                const errorDiv = document.createElement("div"); 
                const errorMsg = document.createTextNode(response.errorMsg); 
                errorDiv.className += "text-danger text-center text-monospace";
                errorDiv.appendChild(errorMsg);
                form.prepend(errorDiv);
                const intervalID = window.setInterval(function(){
                  form.removeChild(errorDiv);
                  clearInterval(intervalID);
                }, 3000);
                return true;
              }
              if(response.redirectUrl){
                window.location = response.redirectUrl;
                return true;
              }
            }
        };
        httpRequest.open('POST', addSongApiUrl);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(songData);
    }
}