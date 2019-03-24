
// A global object that can listen to property changes
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        // Read scheme color
        if (properties.schemecolor) {
            var schemeColor = properties.schemecolor.value.split(' ');
            schemeColor = schemeColor.map(function(c) {
                return Math.ceil(c * 255);
            });
            properties.schemeColor = schemeColor;
        }
    }
};

var loop;
var canvas;
var canvasCtx;
var audioSamples = [];
var bgtype = 2; //1-color, 2-img
var images = ["img/1.jpg","img/2.jpg"];

window.onload = function() {
    setupCanvasElem();
    setupCanvasBackground(0);

    window.wallpaperRegisterAudioListener(wallpaperAudioListener);
    window.onresize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    /*
    loop = setTimeout(function tick() {
        run();
        timerId = setTimeout(tick, 10); 
    }, 10);
    */
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    window.requestAnimationFrame(run);
}
/**
 * setup canvas variable and canvas context variable for use
 * and set canvas height and width
 */
function setupCanvasElem(){
    canvas = document.querySelector('canvas');
    canvasCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
/**
 * set background image of canvas to image from images array
 * @param {int} index - index of picture from images array
 */
function setupCanvasBackground(index){
    canvas.style.backgroundImage = "url('"+images[index]+"')";
    canvas.style.backgroundPosition = "center";
    canvas.style.backgroundRepeat = "no-repeat";
    canvas.style.backgroundSize = "cover";
}
/**
 * add wallpaperEngine audioListener to page
 * set our audioSamples array to 'listened array'
 * display audio position on page
 * @param {Array} audioArray 
 */
function wallpaperAudioListener(audioArray) {
    var fpsElement = document.getElementById('AudioDisplay');
    fpsElement.textContent = audioArray[0];
    audioSamples = audioArray;
}
function run() {
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    window.requestAnimationFrame(run);
    //***************************************CLEAR AREA**************************************
    if(bgtype == 1){
        canvasCtx.fillStyle = 'rgb(0,0,0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    }else if(bgtype == 2){
        canvasCtx.clearRect(0,0,canvas.width,canvas.height);
    }
    //***************************************DRAW BARS***************************************
    drawPeaks2();

}
//red-blue peaks
function drawPeaks1(){
    canvasCtx.fillStyle = 'rgb(255,0,0)';//LEFT HALF SIDE IS RED
    let barWidth = (canvas.width / 128.0);
    let halfCount = audioSamples.length / 2;
    for (let i = 0; i < halfCount; ++i) {
        let height = canvas.height * audioSamples[i];
        canvasCtx.fillRect(barWidth * i, canvas.height - height, barWidth, height);
    }
    canvasCtx.fillStyle = 'rgb(0,0,255)'; //RIGHT HALF SIDE IS BLUE
    for (let i = halfCount; i < audioSamples.length; ++i) {
        let height = canvas.height * audioSamples[191 - i];
        canvasCtx.fillRect(barWidth * i, canvas.height - height, barWidth, height);
    }
}
//rainbow peaks
function drawPeaks2(){
    let barWidth = (canvas.width / 128.0);
    let leftArr = audioSamples.slice(0,64);//0 incl - 64 not incl
    let rightArr = audioSamples.slice(64,128);//64 incl - 128 not incl
    
    leftArr.sort();
    rightArr.sort(myCompare);

    for (let i = 0; i < leftArr.length; i++) {
        let height = canvas.height * leftArr[i];

        canvasCtx.fillStyle = getVaporRGB(63-i,height);

        canvasCtx.fillRect(barWidth * i, canvas.height - height, barWidth, height);
    }
    for (let i = 0; i < rightArr.length; i++) {
        let height = canvas.height * rightArr[i];
                
        canvasCtx.fillStyle = getVaporRGB(i,height);

        canvasCtx.fillRect(barWidth *(64+i), canvas.height - height, barWidth, height);
    }
}
function getVaporRGB(i,height){
    //let r = height*3 + (64/(i+1));
    let r = height*0.4*(255/(2*(i+1)));
    //let g = 255 * ((i+1)/64);
    let g = 255/height*((i+1)*0.2);
    let b = 100+i;
    return "rgb(" + r + "," + g + "," + b + ")";
}
function myCompare(a, b) {
    return b - a;
}



