import { Sum } from '../src/main'
// import { Sum } from '../dist/bundle.js'
// 
// console.log(CLOUD_GAME_SDK.version, 588)

test('sum is right', () => {
    expect(Sum(1, 2)).toBe(3);
});

// test('CLOUD_GAME_SDK get', () => {
//     expect((CLOUD_GAME_SDK.version).toBe(3))
// })