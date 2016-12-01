var collectionItemTemplate =
     '<div class="collection-album-container column fourth">'
   + '  <img src="assets/images/album_covers/01.png"/>'
   + '  <div class="collection-album-info caption">'
   + '    <p>'
   + '      <a class="album-name" href="/album.html"> The Colors </a>'
   + '      <br/>'
   + '      <a href="/album.html"> Pablo Picasso </a>'
   + '      <br/>'
   + '      X songs'
   + '      <br/>'
   + '    </p>'
   + '  </div>'
   + '</div>'
   ;
   
window.onload = function() {
    //select the first element with an alum cover class name
    var collectionContainer = document.getElementsByClassName('album-covers')[0];
    //assign an empty string to clear its content 
    collectionContainer.innerHTML = '';
    //creat a loop that inserts 12 albums
    for (var i=0; i < 12; i++) {
        collectionContainer.innerHTML += collectionItemTemplate;
    }
};
