// control Time and trys;
let timeLeft = 180;
let NumperOfTrys = 20;
let continueWork = false;
// **************************************
let stopTimer;
let againDiv = document.createElement("div");
let againSpan = document.createElement("span");
let againText = document.createTextNode("Time Over");
let gameOverDiv = document.createElement("div");
let gameOverText = document.createTextNode("Game Over");
let continueSpan = document.createElement("span");

continueSpan.innerHTML = "Continue";
continueSpan.classList.add("rounded-pill");
continueSpan.classList.add("continue");


againSpan.innerHTML = "Try again";
againSpan.classList.add("rounded-pill");
againDiv.appendChild(againSpan);
let gameOverSpan = againSpan.cloneNode(true);


againDiv.prepend(againText);
againDiv.classList.add("again");


gameOverDiv.appendChild(gameOverSpan);

gameOverDiv.prepend(gameOverText);
gameOverDiv.classList.add("game-over");

let continueSpan1 = continueSpan.cloneNode(true);

if (continueWork) {
    againDiv.appendChild(continueSpan);
    gameOverDiv.appendChild(continueSpan1);
};


document.querySelector(".control-buttons span").onclick = function () {
    
    let yourName = prompt("whats Your Name ? ");

    if (yourName == null || yourName == "") {
        document.querySelector(".name span").innerHTML = "Unknown";
    } else {
        document.querySelector(".name span").innerHTML = yourName;
    }
    document.getElementById("start").play();
    document.querySelector(".control-buttons").remove();

    stopTimer = setInterval(updateTimer, 1000);

    function updateTimer() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
    
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
    
        document.getElementById("timer").textContent = minutes + ":" + seconds;
    
        timeLeft--;
    
        if (timeLeft < 0 ) {
            clearInterval(stopTimer);
            document.getElementById("timer").textContent = " Time Over !";
            document.body.appendChild(againDiv);
        }
    };
};

againSpan.onclick = function () {
    location.reload(true);
};
gameOverSpan.onclick = function () {
    location.reload(true);
};
continueSpan.onclick = function () {
    againDiv.remove();
};
continueSpan1.onclick = function () {
    gameOverDiv.remove();
};

let duration = 1000;

let blocksContainer = document.querySelector(".memory-game-blocks");

let blocks = Array.from(blocksContainer.children);

let orderRange = [...Array(blocks.length).keys()];

shuffle(orderRange);

blocks.forEach((block, index) => {

    block.style.order = orderRange[index];

    block.addEventListener("click" , function () {
        flipBlock(block);
    })
});


function flipBlock(select) {
    
    select.classList.add("is-flipped");

    let allFlippedBlocks = blocks.filter(flippedblock => flippedblock.classList.contains("is-flipped"));

    if (allFlippedBlocks.length === 2) {
        stopclicking();

        checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
    }
}

function stopclicking() {

    blocksContainer.classList.add("no-clicking");

    setTimeout(() => {
        
        blocksContainer.classList.remove("no-clicking");

    },duration);
}

document.addEventListener("DOMContentLoaded", function () {
let tasksSection = document.querySelector(".tasks");

// استرجاع بيانات الفائزين من localStorage
let winners = JSON.parse(localStorage.getItem("winners")) || [];

// ترتيب الفائزين بناءً على الوقت المتبقي من الأعلى إلى الأدنى
winners.sort((a, b) => b.time - a.time);

// عرض أعلى 5 فائزين فقط
winners.slice(0, 5).forEach(winner => {
    if (winner && winner.name && winner.time !== undefined) {  // تحقق من وجود القيم
        let taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        taskItem.classList.add("container");
        taskItem.textContent = `Winner: ${winner.name} ------- The remaining time: ${winner.time} Second`;
        
        tasksSection.appendChild(taskItem);
    }
});
});

function checkMatchedBlocks(firstBlock, secondBlock) {

let triesElement = document.querySelector(".tries span");

if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.getElementById("success").play();

    let allMatched = blocks.every(block => block.classList.contains("has-match"));
    
    if (allMatched) {
        clearInterval(stopTimer);

        let playerName = document.querySelector(".name span").textContent;
        let currentTime = timeLeft;

        let winnerData = { name: playerName, time: currentTime };

        let winners = JSON.parse(localStorage.getItem("winners")) || [];

        winners.push(winnerData);

        // ترتيب الفائزين بناءً على الوقت المتبقي من الأعلى إلى الأدنى
        winners.sort((a, b) => b.time - a.time);

        // حفظ الفائزين في localStorage بعد الترتيب
        localStorage.setItem("winners", JSON.stringify(winners));

        // عرض أعلى 5 فائزين فقط
        let tasksSection = document.querySelector(".tasks");
        tasksSection.innerHTML = ""; // مسح المحتويات القديمة

        winners.slice(0, 5).forEach(winner => {
            if (winner && winner.name && winner.time !== undefined) {  // تحقق من وجود القيم
                let taskItem = document.createElement("div");
                taskItem.classList.add("task-item");
                taskItem.classList.add("container");
                taskItem.textContent = `Winner: ${winner.name} ------- The remaining time: ${winner.time} Second`;
                
                tasksSection.appendChild(taskItem);
            }
        });

        showConfetti();

    }

    } else {
        triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

        setTimeout(() => {
            firstBlock.classList.remove("is-flipped");
            secondBlock.classList.remove("is-flipped");

        }, duration);
        
        document.getElementById("fail").play();

        if (triesElement.innerHTML == NumperOfTrys) {
            setTimeout(() => {
                document.body.appendChild(gameOverDiv);
            }, 400);
        }
    }
};
function shuffle(array){
    let current = array.length,
        temp,
        random;
    while (current > 0) {
        random = Math.floor(Math.random() * current);

        current--;

        temp = array[current];

        array[current] = array[random];

        array[random] = temp;
    }
    return array;
};

function showConfetti() {
    
    var d = 15 * 1000;
    var animationEnd = Date.now() + d;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
        return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / d);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // ****************************************************
    var end = Date.now() + (15 * 1000);

// go Buckeyes!
var colors = ['#bb0000', '#ffffff'];

(function frame() {
    confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors
    });
    confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors
    });

    if (Date.now() < end) {
    requestAnimationFrame(frame);
    }
    }());
}
