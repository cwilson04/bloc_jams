
//function that takes one argument, songNumber, and assigns currentlyPlayingSongNumber 
//and currentSongFromAlbum a new value based on the new song number. 
var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    var currentlyPlayingSongNumber = parseInt(songNumber); //used parseInt function to return integer of song number
    var currentSongFromAlbum = currentAlbum.songs[songNumber - 1]; //list of songs on the current album and -1 to get corrent index number

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
     setVolume(currentVolume);
 };
 
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


var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '"> ' + songNumber + ' </td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
var clickHandler = function() {

    var songNumber = $(this).attr('data-song-number');

        if (currentlyPlayingSongNumber !== null) {
        // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }

        if (currentlyPlayingSongNumber !== songNumber) {
        // Switch from Play -> Pause button to indicate new song is playing.
             setSong(songNumber);           
             currentSoundFile.play();
             currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
             
             var $volumeFill = $('.volume .fill');
             var $volumeThumb = $('.volume .thumb');
             $volumeFill.width(currentVolume + '%');
             $volumeThumb.css({left: currentVolume + '%'});
             
             $(this).html(pauseButtonTemplate);
             updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
         // Switch from Pause -> Play button to pause currently playing song.
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate)
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
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
 
//part 1 of assignment 34
//write a function called setcurrenttimeinplayerbar that takes 1 arugment current time
var setCurrentTimeInPlayerBar = function(currentTime) {
    var $currentTime = $('.seek-control .current-time');
    $currentTime.text(currentSoundFile.getDuration());
};

//part 2 of assignment 34
//Write a function called setTotalTimeInPlayerBar() 
//that takes one argument, totalTime, that sets the text of the element with the .total-time class to the length of the song.

var setTotalTimeInPlayerBar = function(totalTime) {
    var $totalTime = $('.seek-control .total-time');
    $totalTime.text(song.length);
};
 
var updateSeekBarWhileSongPlays = function() {
    if(currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            udateSeekPercentage($seekBar, seekBarFillRatio);
            //add setCurrentTimeIn Player method to updateSeekBarWhileSongPlays
            setCurrentTimeInPlayerBar();
        });
    }
};
 
var updateSeekPercentage = function($seekBar, seekBarFillRation) {
    var offsetXPercent = seekBarFillRation * 100;
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
           seek(seekBarFillRation * currentSoundFile.getDuration());
       } else {
           setVolume(seekBarFillRation * 100);
       }
       
       //if its the playback seek bar, seek to the position of song
       //determined by seekBarFillRation
       //else, set the voume based on the seekBarFillRatio
       
       updateSeekPercentage($(this), seekBarFillRation);
   });
   
   $seekBars.find('.thumb').mousedown(function(event) {
       var $seekBar = $(this).parent();
       
       $(document).bind('mousemove.thumb'), function(event) {
           var offsetX = event.pageX - $seekBar.offset().left;
           var barWidth = $seekBar.width();
           var seekBarFillRation = offsetX / barWidth;
           
           if ($seekBar.parent().attr('class') == 'seek-control') {
               seek(seekBarFillRation * currentSoundFile.getDuration());
           } else {
               setVolume(seekBarFillRatio);
           }
           
           
           updateSeekPercentage($seekBar, seekBarFillRatio);
       }
       
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
    
    setTotalTimeInPlayerBar();
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
    setSong = currentSongIndex + 1;
    currentSoundFile.play();
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
    setSong = currentSongIndex + 1;
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
    updateSeekBarWhileSongPlays();
    
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

var togglePlayFromPlayerBar = function() {
    //if player bar is on pause switch to playerBarPlayButton
    //if player bar is on play switch to playBarPauseButton
    //I want to select the player-bar and toggle between play and pause
    if(song.pause) {
        song.play(playerBarPlayButton);
    } else {
        song.pause(playerBarPauseButton);
    }
}


$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseSelector.click(togglePlayFromPlayerBar);

    });

