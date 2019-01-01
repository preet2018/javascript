
// how let and var will works in function scope

let iAmGolbal = "i am golbal varibale";
if(true){
    var iAmLocal ="I am local Variable"; //let is works in only block of function
    iAmGolbal ="super Girl";
    console.log(iAmLocal);
    console.log(iAmGolbal);
}
console.log(iAmLocal);
