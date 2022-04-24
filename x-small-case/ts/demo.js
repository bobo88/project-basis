const limitFun = (selectArr)=>{
    let flatStr = [...new Set(selectArr)].sort().join('-')
    let arrOrigin = ['1-6', '1-2', '2-7']
    return arrOrigin.includes(flatStr) ? '规则正确' : '规则不符合';
}
console.log(limitFun([1,6,1, 1, 1, 1, 1]))


// const limitFun = (selectArr)=>{
//     const typeArr1 = [1,6];
//     const typeArr2 = [1,2];
//     const typeArr3 = [2,7];
//     let type1=true;
//     let type2=true;
//     let type3=true;
//     if([...new Set([...typeArr1,...selectArr])].sort().toString() === typeArr1.toString()){
//         type1 = false;
//     }
//     if([...new Set([...typeArr2,...selectArr])].sort().toString() === typeArr2.toString()){
//         type2 = false;
//     }
//     if([...new Set([...typeArr3,...selectArr])].sort().toString() === typeArr3.toString()){
//         type3 = false;
//     }
//     if(!type1 || !type2 || !type3){
//         console.log("规则正确");
//         return;
//     }else{
//         console.log("规则不符合");
//     }
// }
// limitFun([1,6,1, 1, 1, 1, 1])