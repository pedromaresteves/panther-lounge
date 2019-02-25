export default function addSongScript() {

    //Quill settings
    const options = {
        debug: 'info',
        placeholder: 'Compose an epic...',
        theme: 'snow'
    };
    const quill = new Quill('#editor', options);

    //DOM Variables
    const form = document.querySelector('form');
    let artistField = document.querySelector('input[name=artist]');
    let titleField = document.querySelector('input[name=title]');
    const formFields = [artistField,titleField];
    let lyricsChordsSender = document.querySelector('input[name=lyrics]');
    let sendFormButton = document.querySelector('#submitButton');

    //If editing a song, we get the lyrics and chords and fill the text editor
    if(lyricsChordsSender.value){
        console.log(lyricsChordsSender.value);
        quill.insertText(0, lyricsChordsSender.value, true);
    }
    

    //Check if Value is empty
    function checkEmptyValues(fieldValue){
    if(fieldValue === ""){
        return false;
    }
    return true;
    }

    //Check Form Values
    function checkFormValues(artist, title){
    let test = {
        errors: false,
        msg: ""
    }
    //let errors = '';
    if(checkEmptyValues(artist) === false){
        test.msg += "You must insert an Artist <br>";
    }
    if(checkEmptyValues(title) === false){
        test.msg += "You must insert a Title <br>";
    }
    if(test.msg.length > 0){
        test.errors = true;
    }
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


    //Submiting Quill content through form
    form.onsubmit = function(e) {
    
    lyricsChordsSender.value = JSON.stringify(quill.getContents());
    }
}