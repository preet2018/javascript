
//ARRY CONCEPT

const numbers = [1,2,3,4,5,6,7,8,9];

console.log(numbers);
console.log ([numbers.length]);
console.log(numbers[0]);
console.log(numbers[8]);
console.log(numbers[numbers.length - 1]);

// 3 must method of array to know 

let indexNumbers = ['one','two','three'];
indexNumbers[0];

//------- from START of array -------//

//shift() method
indexNumbers.shift()
console.log(indexNumbers);

//unshift() method
indexNumbers.unshift('preeti');
console.log(indexNumbers);

//--------from ENd of the array-------//

//pop() method
indexNumbers.pop();
console.log(indexNumbers);

//push() method
indexNumbers.push('four');
console.log(indexNumbers)

//------ from middle of the array ---//

indexNumbers.splice(1,2,'khavekar');   //here 1 is postion of index array and two is selected to replace value
console.log(indexNumbers);