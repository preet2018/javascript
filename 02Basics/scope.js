
// how let and var will works in function scope

let iAmGolbal = "i am golbal varibale";
if(true){
    var iAmLocal ="I am local Variable"; //let is works in only block of function
    iAmGolbal ="super Girl";
    console.log(iAmLocal);
    console.log(iAmGolbal);
}
console.log(iAmLocal);


//undefined
var test2;
console.log(test2);

var test1 = null
console.log(typeof test1);
// object

var names = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl"];
var uniqueNames = [];
uniqueArray= names.filter(function(i,val){
    return names.indexOf(i)=== val;
})
console.log(uniqueArray);


//this keyword we can use in diffret way in object in function

//using this keyword in object 

details = {
   name : 'preeti',
   age: '22',

   mydetails(){
       console.log(`${this.name}`);

   }
}

var myarray = [{
    name:'preeti2',
    age:'22',
    adres:'11welcome',
},
{
    name:'preeti2',
    age:'22',
    adres:'11welcome',
},
{
    name:'preeti3',
    age:'22',
    adres:'11welcome',
},
{
    name:'preeti4',
    age:'22',
    adres:'11welcome',
},
{
    name:'preeti5',
    age:'22',
    adres:'11welcome',
}]
//console.log(myarray);
// maparray = myarray.filter(function(i, v){
//     return i.indexOf(i)===v;
// })
// console.log(maparray);