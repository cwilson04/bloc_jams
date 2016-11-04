//write a function name forEach
//use a loop to go through all elements in points array
//execute a callback for each element

function forEach(array, callback) {
    for (var i = 0; i < array.length; i++)  {
          callback(array[i]);
    }
}