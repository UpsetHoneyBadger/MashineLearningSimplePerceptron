const RESOLUTION = 25
const NUM_POINTS = 100
const DISCRETIZE = true

var LINE_M
var LINE_N
var model;
var heatmap_data = []
var training_data = Array.from({
    length: NUM_POINTS
}, () => ({
    'x': Math.random(),
    'y': Math.random()
}))

var LINE_M = rand(-0.5, 0.5)
var LINE_N = rand(0.3, 0.6)

training_data = training_data.map(point => {
    return { ...point,
        'side': point.x * LINE_M + LINE_N < point.y
    }
})

initModel()
initHeatMap()
update(training_data)
drawHeatmap(heatmap_data)



function initHeatMap(){
    heatmap_data = []
    for (let iy = 0; iy < RESOLUTION; iy++) {
        for (let ix = 0; ix < RESOLUTION; ix++) {
            heatmap_data.push({
                px: ix / RESOLUTION,
                py: (iy+1) / RESOLUTION,
                probability: 0.5
            })
        }
    }
}

function initModel() {
    model = tf.sequential({
        layers: [tf.layers.dense({
            units: 1,
            inputShape: [2],
            activation: 'sigmoid'
        })]
    });
    model.compile({
        loss: 'meanSquaredError',
        optimizer: tf.train.sgd(1)
    });
}

async function trainModel(episodes) {
    features = tf.tensor2d(training_data.map(p => [p.x, p.y]))
    targets = tf.tensor1d(training_data.map(p => p.side ? 0 : 1.0))
    for (let episode = 0; episode < episodes; episode++) {
        const h = await model.fit(features, targets, {
            epochs: 10
        });
        updateTrainingLossText(h.history.loss[0])
        console.log("Loss after Epoch " +  episode + " : " + h.history.loss[0]);
    }
}

async function calculateHeatmap(){
    const rawData = heatmap_data.map(d => [d.px, d.py])
    const t = tf.tensor2d(rawData, [rawData.length, 2])
    const probabilities = model.predict(t).dataSync()
    heatmap_data = heatmap_data.map((d, i) => ({...d, probability: DISCRETIZE ? probabilities[i] > 0.5 : probabilities[i]}))
    await tf.nextFrame()
    drawHeatmap(heatmap_data)
}

function updateTrainingLossText(loss){
    document.getElementById("training-loss").innerHTML = 'Training loss: ' + loss.toFixed(2)
}


document.getElementById("train").addEventListener("click", () => {
    trainModel(10)
    .then(() => calculateHeatmap())
});

document.getElementById("train-step").addEventListener("click", () => {
    trainModel(1)
    drawHeatmap(heatmap_data)
    calculateHeatmap()
});

document.getElementById("reset-model").addEventListener("click", () => {
    initModel()
    initHeatMap()
    drawHeatmap(heatmap_data)
});

function rand(min, max) {
    return Math.random() * (max - min) + min;
}