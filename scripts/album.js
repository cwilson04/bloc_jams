
//function that takes one argument, songNumber, and assigns currentlyPlayingSongNumber 
//and currentSongFromAlbum a new value based on the new song number. 
var setSong = function(songNumber) {
    //if there is currently a song playing, stop that song 
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    //currentlyPlayingSongNumber is the same as songNumber
    currentlyPlayingSongNumber = songNumber; //used parseInt function to return integer of song number
    //to find the currentSongFromAlbum take the list of currentAlbum songs and subtract one to get the proper index start
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1]; //list of songs on the current album and -1 to get corrent index number

//new buzz.sound( sources, [settings] ) creates a new sound instance, taken from Buzz methods library
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
    //this calls setVolume function listed below, sound.setVolume(volume)
    //TODO ask Matthew why setVolume function created when already a method listed in Buzz library?
     setVolume(currentVolume);
 };
 
 //create a function called seek this sets the playback position in seconds
 var seek = function(time) {
     if(currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }
 
 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }

};

//Write a function named getSongNumberCell that takes one argument - number
// and returns the song number element that corresponds to that song number.

//calls td class="song-item-number" and returns the corresponding number
var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

//creates a row that includes the songNumber, songName and songLength
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '"> ' + songNumber + ' </td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
 //creates a jQuery method to call the above row
     var $row = $(template);
     
//create a function to determine what happens when a user clicks on the songNumber
var clickHandler = function() {

//this selects the element with the attribute 'data-song-number'
    var songNumber = $(this).attr('data-song-number');
 
 //we set a variable of currentlyPlayingSongNumber to null below
 //if user clicks on song number and it's not the same as the song currently playing run the function
    if (currentlyPlayingSongNumber !== songNumber) {
        //if currentlyPlayingSongNumber is not equal to the songNumber clicked AND it is not null
        if (currentlyPlayingSongNumber !== null) {
            //assigned a variable call currentlyPlayingCell which is the song number in the row
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            //grab that element from the DOM and make it the currentlyPlayingSongNumber
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        //if the currentlyPlayingSongNumber is not the same songNumber that is clicked we call the setSong function which will stop the current
        //song from playing and play the new songNumber that was clicked
        setSong(songNumber);
        currentSoundFile.play();
        //once the music starts playing you want the button to change to a pause button
        $(this).html(pauseButtonTemplate);
    //here we set currentSongFromAlbum is equal to list currentAlbum.songs find by index songNumber - 1
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        //call the function to update the playerBar to same song
        updatePlayerBarSong();
        //update the currentlyPlayingSongNumber to the song that is playing
        currentlyPlayingSongNumber = songNumber;
        
        // TODO: Check to see if this is supposed to go here?
        var $volumeFill = $('.volume .fill');
        var $volumeThumb = $('.volume .thumb');
        $volumeFill.width(currentVolume + '%');
        $volumeThumb.css({left: currentVolume + '%'});
        
        //if the currentlyPlayingSong is equal to the song clicked
    } else if (currentlyPlayingSongNumber === songNumber) {
        //Return true if the sound is paused or is ended. Return false otherwise.
        if (currentSoundFile.isPaused()) {
            //if song is paused then the play button template will show
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
        } else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSoundFile.pause();   
        }
    }
};

var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');


    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
    }
};

var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');

    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(songNumber);
    }
};
     
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };
 
var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

     
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();
     
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };
 
var updateSeekBarWhileSongPlays = function() {
    if(currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};
 
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
   var $seekBars = $('.player-bar .seek-bar');
   
   $seekBars.click(function(event) {
       var offsetX = event.pageX - $(this).offset().left;
       var barWidth = $(this).width();
       var seekBarFillRatio = offsetX / barWidth;
       
       //check the class of the seek bars parent
       //determine whether the seek bar is changing volume or seeking song position
       if ($(this).parent().attr('class') == 'seek-control') {
           seek(seekBarFillRatio * currentSoundFile.getDuration());
       } else {
           setVolume(seekBarFillRatio * 100);
       }
       
       //if its the playback seek bar, seek to the position of song
       //determined by seekBarFillRation
       //else, set the voume based on the seekBarFillRatio
       
       updateSeekPercentage($(this), seekBarFillRatio);
   });
   
   $seekBars.find('.thumb').mousedown(function(event) {
       var $seekBar = $(this).parent();
       
        $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
 
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
            
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
       
       $(document).bind('mouseup.thumb', function() {
           $(document).unbind('mousemove.thumb');
           $(document).unbind('mouseup.thumb');
       });
   });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};
 
var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
    console.log("Inside nextSong");
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    updateSeekBarWhileSongPlays();
    
};

var previousSong = function() {
    
    // Note the difference between this implementation and the one in
    // nextSong()
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseSelector = $('.main-controls .play-pause')

//Write a function so that users can play and pause a song from the bar, 
//The function should be named togglePlayFromPlayerBar(), take no arguments



$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);

});

