const tf = require('@tensorflow/tfjs') 

const NUM_POINTS = 10

var x = Array.from({length: NUM_POINTS}, () => Math.random())
var y = Array.from({length: NUM_POINTS}, () => Math.random())
console.log(x) 

const model = tf.sequential({
    layers: [tf.layers.dense({units: 32, inputShape: [50]}),
    tf.layers.dense({units: 3}),
    tf.layers.dense({units: 2}),
    tf.layers.dense({units: 1})]
 });

