
//FUNCTIONS INSTRODUCTION

//function1 

let sayHello = function(name){ //passing single parms
    console.log(name);
}
sayHello('preeti');
//function2
let message = function(firstName,lastName){  //passing two parms in function
console.log(`welcome message ${firstName}  ${lastName}`)
}
message('preeti','khavekar');
//function3
let numbers = function (num1, num2){
    let add = num1 + num2;
    return add;
}
let result = numbers(10,10);
 console.log(result);

//multiplication

let multipl = function(n1,n2){
    // mulResult = n1*n2;
    return n1*n2;     //reducing code for return 
}
let finalResult = multipl(10, 10);
console.log(finalResult);

//-------------Default parms --------------------//

let defaultParms = function(name = "preeti", lenght = 6 ){      // if u dint declar parms in function u can take it direction inside function that is it  will works
  return name + lenght;
}

console.log(defaultParms());