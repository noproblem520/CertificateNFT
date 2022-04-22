// abc('input', function(result) {
//     bcd('input', function(result) {
//         asd('input', function(result) {

//          });
//     });
// });


abc('input')
.then(function(result) {
    return bcd('input');
}).then(function(result) {
    return asd('input');
}).then(function(result) {
    console.log();
})


await abc('input')
await bcd('input')
await asd('input')
console.log();