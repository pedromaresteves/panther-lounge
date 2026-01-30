export default function addOrEditSong() {

    //DOM Variables
    const form = document.querySelector('form');
    let artistField = document.querySelector('input[name=artist]');
    let titleField = document.querySelector('input[name=title]');
    const formFields = [artistField, titleField];
    let lyricsChordsSender = document.querySelector('input[name=lyrics]');
    let sendFormButton = document.querySelector('#submitButton');
    const addSongApiUrl = window.location.origin + "/api" + window.location.pathname;
    const quillCharlimit = 6000;

    //Quill settings
    const toolbarOptions = [{ size: ['small', false, 'large', 'huge'] }, 'bold', 'italic', 'underline', { 'indent': '-1' }, { 'indent': '+1' }];
    const quill = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
    });

    quill.on('text-change', function (delta, old, source) {
        if (quill.getLength() > quillCharlimit) {
            quill.deleteText(quillCharlimit, quill.getLength());
        }
    });

    //If editing a song, we get the lyrics and chords and fill the text editor
    if (!!lyricsChordsSender.value) {
        const songContent = JSON.parse(lyricsChordsSender.value).ops;
        let contentToBeSet = [];
        songContent.forEach(function (item) {
            contentToBeSet.push(item)
        });
        quill.setContents(contentToBeSet)
    }

    //If editing a song, don't allow user to edit Artist Name
    if (window.location.pathname.indexOf("/edit-song/") !== -1) {
        artistField.disabled = true;
    }


    //Check if Value is empty
    function checkEmptyValues(fieldValue) {
        if (fieldValue === "") return false;
        return true;
    }

    //Check Form Values
    function checkFormValues(artist, title) {
        let test = {
            errors: false,
            msg: ""
        }
        if (checkEmptyValues(artist) === false) test.msg += "You must insert an Artist <br>";
        if (checkEmptyValues(title) === false) test.msg += "You must insert a Title <br>";
        if (test.msg.length > 0) test.errors = true;
        return test;
    }

    //Only allow saving if all field have values
    for (let i = 0; i < formFields.length; i++) {
        formFields[i].addEventListener('blur', function (event) {
            let checkForm = checkFormValues(artistField.value, titleField.value);
            if (checkForm.errors === false) {
                sendFormButton.disabled = false;
            } else {
                sendFormButton.disabled = true;
            }
        });
    }
    if (checkFormValues(artistField.value, titleField.value).errors === false) sendFormButton.disabled = false;

    //Submiting Quill content through form
    form.onsubmit = function (e) {
        lyricsChordsSender.value = JSON.stringify(quill.getContents());
        const songData = JSON.stringify({
            artist: artistField.value,
            title: titleField.value,
            lyricsAndChords: quill.getContents()
        });
        var httpRequest;

        e.preventDefault();
        httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                try {
                    const response = JSON.parse(httpRequest.response);

                    // Check for error message first
                    if (response.errorMsg && response.errorMsg.trim() !== '') {
                        // Remove any existing error divs
                        const existingErrors = form.querySelectorAll('.alert-danger');
                        existingErrors.forEach(el => el.remove());

                        const errorDiv = document.createElement("div");
                        errorDiv.className = "alert alert-danger alert-dismissible fade show mt-3";
                        errorDiv.innerHTML = `
                            <strong>Error:</strong> ${response.errorMsg}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        `;
                        form.prepend(errorDiv);
                        window.scrollTo(0, 0);
                        return true;
                    }

                    // If we have a redirect URL, proceed
                    if (response.redirectUrl) {
                        window.location = response.redirectUrl;
                        return true;
                    }
                } catch (e) {
                    console.error('Error parsing response:', e);
                    alert('Error processing response. Please try again.');
                }
            }
        };
        httpRequest.open('POST', addSongApiUrl);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(songData);
    }
}