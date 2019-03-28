// function reverse(str){
//     let reversed = "";    
//     for (var p = str.length - 1; p >= 0; p--){        
//      reversed += str[p];
//       console.log(reversed);
//     }    
//     return reversed;
//   }
//  console.log( reverse('preeti'));
function reverse(arr) {
  for(var i = 0, j = arr.length-1; i < j; i++, j--) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
};
var reversed = reverse(['a','b','c','d','e']);
console.log(reversed);

// function reverse2(myName){
//   for(i=0,  j= ((myName.length-1)/2); i < j; i++,j--){
//     var tmp= myName[i];
//     myName[i] = myName[j];
//     myName[j]= tmp;
//   }
//   return myName;
// }
// var reversed= reverse2(['p','h','c','k','e']);
// console.log(reversed);
// const arr = []
// function loop1(myLoop){
//   for()
// }


function myreverse(array){
  for(i=0; array.length-1, i<j; i++, j-- ){
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}
var finalarry = reverse(['p','j','l']);
console.log(finalarry);


var mm = ['a','b','b', 'b', 'v'];
ll = mm.filter(function(i,v){
    return mm.indexOf(i)===v;
})
console.log(ll);


var a = [...Array(100).keys()];
var primeNumbers = a.map(v => { 
    if (v % 2 === 0 || v % 3 === 0) { 
      if (v === 2 || v === 3) {
       return v;
      } else {
       return;
      } 
    } else {
      return v;
    }
});

//primeNumbers.filter(val => val);
console.log(primeNumbers);

