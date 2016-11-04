var pointsArray = document.getElementsByClassName('point');
 
     var animatePoints = function(points) {
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

window.onload = function() {
     
     // Automatically animate the points on a tall screen where scrolling can't trigger the animation
     if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }

     var sellingPoints = document.getElementsByClassName('selling-points')[0];
     var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
     window.addEventListener('scroll', function(event) {
         if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);   
         }
     });
}