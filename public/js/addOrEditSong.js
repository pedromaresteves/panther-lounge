export default function addOrEditSong() {
    // DOM Variables
    const form = document.querySelector('form');
    let artistField = document.querySelector('input[name=artist]');
    let titleField = document.querySelector('input[name=title]');
    const lyricsField = document.querySelector('textarea[name=lyrics]');
    const charCountElement = document.querySelector('#char-count');
    const syntaxErrorElement = document.querySelector('#syntax-error');
    const formFields = [artistField, titleField, lyricsField];
    let sendFormButton = document.querySelector('#submitButton');
    const addSongApiUrl = window.location.origin + "/api" + window.location.pathname;
    const charLimit = 6000;

    // Character counter
    function updateCharCount() {
        const currentLength = lyricsField.value.length;
        charCountElement.textContent = `${currentLength}/${charLimit} characters`;
        
        if (currentLength > charLimit) {
            lyricsField.value = lyricsField.value.substring(0, charLimit);
            updateCharCount();
        }
    }
    
    lyricsField.addEventListener('input', updateCharCount);
    updateCharCount();

    // Client-side chord syntax validation
    function validateChordSyntax() {
        const text = lyricsField.value;
        const chordRegex = /\[([^\]]+)\]/g;
        const chordPattern = /^[A-G][b#]*(?:m|maj|min|aug|dim|sus)?[0-9]*(?:\/[A-G][b#]*)?$/i;
        let match;
        
    while ((match = chordRegex.exec(text)) !== null) {
        const chord = match[1].trim();
        if (!chordPattern.test(chord)) {
            syntaxErrorElement.textContent = `Keep in mind to use the chord syntax [Em], [Dsus4], [C#m7] for better user experience.`;
            syntaxErrorElement.className = 'alert alert-warning mt-2';
            syntaxErrorElement.style.display = 'block';
            return false;
        }
    }

    syntaxErrorElement.style.display = 'none';
    return true;
    }
    
    lyricsField.addEventListener('input', validateChordSyntax);
    lyricsField.addEventListener('blur', validateChordSyntax);

    // If editing a song, don't allow user to edit Artist Name
    if (window.location.pathname.indexOf("/edit-song/") !== -1) {
        artistField.disabled = true;
    }

    // Check if Value is empty
    function checkEmptyValues(fieldValue) {
        if (fieldValue === "") return false;
        return true;
    }

    // Check Form Values
    function checkFormValues(artist, title, lyrics) {
        let test = {
            errors: false,
            msg: ""
        };
        if (checkEmptyValues(artist) === false) test.msg += "You must insert an Artist <br>";
        if (checkEmptyValues(title) === false) test.msg += "You must insert a Title <br>";
        if (checkEmptyValues(lyrics) === false) test.msg += "You must insert Lyrics and Chords <br>";
        if (test.msg.length > 0) test.errors = true;
        return test;
    }

    // Only allow saving if all fields have values
    for (let i = 0; i < formFields.length; i++) {
        formFields[i].addEventListener('blur', function (event) {
            let checkForm = checkFormValues(artistField.value, titleField.value, lyricsField.value);
            if (checkForm.errors === false) {
                sendFormButton.disabled = false;
            } else {
                sendFormButton.disabled = true;
            }
        });
    }

    // Initialize button state
    if (checkFormValues(artistField.value, titleField.value, lyricsField.value).errors === false) {
        sendFormButton.disabled = false;
    }

    // Form submission
    form.onsubmit = function (e) {
        e.preventDefault();
        
        const songData = JSON.stringify({
            artist: artistField.value,
            title: titleField.value,
            lyrics: lyricsField.value
        });
        
        var httpRequest = new XMLHttpRequest();
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
    };
}