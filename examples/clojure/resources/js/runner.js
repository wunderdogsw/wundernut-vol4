var runVisualization = function() {
    visualizeStep();
};

var step = 0;

var foundWords = {};

// default 182, 200, 87
// current 112, 229, 32
// visited 204, 204, 204
// next 229, 229, 0

var visualizeStep = function() {
    $('td').removeClass();
    resetColors();

    var stepData = data[step];
    var currentStepName = stepData['currentStep'];
    $('#block-' + currentStepName).addClass('current');
    setBlockColor(getBlockByName(currentStepName), 0.439, 0.898, 0.125);

    var nextSteps = stepData['nextSteps'];
    nextSteps.forEach(function(nextStep) {
        $('#block-' + nextStep).addClass('next');
        setBlockColor(getBlockByName(nextStep), 1, 1, 0);
    });
    
    var visited = stepData['visited'];
    visited.forEach(function(visitedStep) {
        $('#block-' + visitedStep).addClass('visited');
        setBlockColor(getBlockByName(visitedStep), 0.898, 0.898, 0.898);
    });

    var letters = stepData['letters'];
    $('.letters').html(letters)

    var stepsToCheckSize = parseInt(stepData['stepsToCheckSize']);
    $('.steps-to-check').html(createBlobs(stepsToCheckSize));

    var possibleWordsCount = parseInt(stepData['possibleWordsCount']);
    $('.possible-words').html(createBlobs(possibleWordsCount));
    
    var result = stepData['result'];
    result.forEach(function(word) {
        foundWords[word] = true;
    });
    var foundWordsList = [];
    for (var word in foundWords) {
        foundWordsList.push(word);
    }
    $('.result').html(foundWordsList.join(", "));

    $('.step').html(step + 1);
    
    step++;
    setTimeout(visualizeStep, 200);
};

var createBlobs = function(count) {
    var small = "";
    if (count > 30) {
        small = " small";
    }

    var blobs = ""
    
    for (var i = 0; i < count; i++) {
        blobs = blobs + '<div class="blob' + small +'"></div>';
    }
    blobs = blobs + '<div class="clear-both"></div>';
    return blobs;
};
