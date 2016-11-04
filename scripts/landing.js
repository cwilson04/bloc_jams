var animatePoints = function() {
 
     var points = document.getElementsByClassName('point');
 
 //create a function named revealPoint
 //function will take one argument which is the index for the point array
 // this function will change the style properties of that point
 
 // not inside the revealPoint function--
 //create a loop that will loop through the points and execute revealPoint for each point
 
     var revealPoint = function (index) {
          points[index].style.opacity = 1;
          points[index].style.transform = "scaleX(1) translateY(0)";
          points[index].style.msTransform = "scaleX(1) translateY(0)";
          points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
     }    

     for (var i = 0; i < points.length; i++)  {
          revealPoint(i);
     }
};

 