
export default function songPong() {
    let lyricsChordsElement = document.querySelector('#editor');
    var quill = new Quill('#editor', {
        modules: {
            toolbar: false
        },
        placeholder: 'Loading Content',
        theme: false
        });
    quill.enable(false);
    if(!!lyricsChordsElement.attributes.value.value){
        const songContent = JSON.parse(lyricsChordsElement.attributes.value.value).ops;
        let contentToBeSet = [];
        songContent.forEach(function(item){
            contentToBeSet.push(item)
        });
        quill.setContents(contentToBeSet)
    }
}