
export default function songPong() {
    let path = window.location.origin + "/api" + window.location.pathname;
    console.log("pop");
    var quill = new Quill('#editor', {
        modules: {
            toolbar: false
        },
        placeholder: 'Loading Content',
        theme: false
        });
    quill.enable(false);

    let httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    
    httpRequest.onreadystatechange = function(){    
        if(httpRequest.readyState === 4){
            const response = JSON.parse(httpRequest.response);
            quill.setContents(response.lyricsChords.ops);
        }
    };

    httpRequest.open('GET', path);
    httpRequest.send();
}