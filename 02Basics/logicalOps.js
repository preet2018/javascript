// && if both the things are true 
// || if one condtion is true


let pandId = true;
let voitId = false;

if(pandId && voitId){
    console.log('able to vot');
}
else if(!pandId || voitId ){
    console.log('notAble to vot');

}
else{
    console.log('welcome to');
}