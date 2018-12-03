(function () {
  'use strict';
    
  // set bombs
  function makeState(N, bombNum) {
    // determine position of bombs
    var rands = [];
    while (rands.length < bombNum) {
      var rand = Math.floor(Math.random() * N * N);
      if (rands.indexOf(rand) ===  -1) {
        rands.push(rand);
      }
    }

    var states = new Array(N);
    for (var i = 0; i < N; i++) {
      states[i] = new Array(N);
      for (var j = 0; j < N; j++) {
        states[i][j] = '';
      }
    }
    while (rands.length > 0) {
      for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
          if (i * N + j === rands[0]) {
            states[i][j] = 'bomb';
            rands.shift();
          }
        }
      }
    }

    // calculate number of adjacent bombs
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        
        if (states[i][j] !== 'bomb') {
          states[i][j] = 0;
          
          for (var k = Math.max(i-1, 0); k <= Math.min(i+1, N-1); k++) {
            for (var l = Math.max(j-1, 0); l <= Math.min(j+1, N-1); l++) {
              if (states[k][l] === 'bomb') {
                states[i][j]++;
              }
            }
          }
          
          if (states[i][j] === '0') {
            states[i][j] = '';
          } else {
            states[i][j] = String(states[i][j]);
          }
          
        }
      }
    }

    return states;
  }

  // initialize state of board
  function initBoard(N) {
    var table = document.createElement('table');
    table.setAttribute('id', 'tbl');
    
    for (var i=0; i < N; i++) {
      var row = table.insertRow(-1);
      for (var j=0; j < N; j++) {
        var id = 'square' + String(i) + String(j);
        if (i === 0) {
          var th = document.createElement('th');
          th.classList.add('sq-front');
          th.setAttribute('id', id);
          row.appendChild(th);
        } else {
          var td = document.createElement('td');
          td.classList.add('sq-front');
          td.setAttribute('id', id);
          row.appendChild(td);
        }
      }
    }
    board.appendChild(table);  
  }

  // turn over all squares
  function open(states, N) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        var square = document.getElementById('square' + String(i) + String(j));
        var state = states[i][j];

        if (square.classList.contains('sq-front')) {
          square.classList.remove('sq-front');

          if (state === 'bomb') {
            while (square.firstChild) {
              square.removeChild(square.firstChild);
            }
            square.classList.add('bomb');
            var img = document.createElement('img');
            img.setAttribute('src', './images/bomb.png');
            img.setAttribute('width', '30px');
            img.setAttribute('height', '30px');
            square.appendChild(img);
          } else {
            square.classList.add('sq-back');
            square.textContent = state;
          }
        }
      }
    }
  }

  // show elapsed time in suitable format
  function updateTimer(t) {
    var d = new Date(t);
    var m = d.getMinutes();
    var s = d.getSeconds();
    var ms = d.getMilliseconds();
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
    ms = ('00' + ms).slice(-3);
    timer.textContent = m + ':' + s + '.' + ms;
  }

  // count elapsed time
  function countTime(startTime) {
    timerId = setTimeout(function() {
      updateTimer(Date.now() - startTime);
      countTime(startTime);
    }, 10);
  }

  var board = document.getElementById('board');
  var gameOver = document.getElementById('gameover');
  var finish = document.getElementById('finish');
  var reset = document.getElementById('reset');
  var timer = document.getElementById('timer');
  var timerId;

  function main() {
    var N = 4;
    var bombNum = 2;
    var states;
    var cnt = 0;
    var flag = 0;
    var img;
    
    initBoard(N);
    states = makeState(N, bombNum);
        
    // play game
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        var square = document.getElementById('square' + String(i) + String(j));
        // click
        square.addEventListener('click', function() {
          if (this.classList.contains('sq-front') === false) {
            return;
          }
          
          if(cnt === 0 && flag === 0) {
            countTime(Date.now());
          }
          cnt++;
          
          var state = states[i][j];
          this.classList.remove('sq-front');

          if (state === 'bomb') {
            while (this.firstChild) {
              this.removeChild(this.firstChild);
            }
            this.classList.add('bomb');
            img = document.createElement('img');
            img.setAttribute('src', './images/bomb.png');
            img.setAttribute('width', '30px');
            img.setAttribute('height', '30px');
            this.appendChild(img);
            gameOver.classList.remove('hidden');
            reset.classList.remove('hidden');
            clearTimeout(timerId);
            // turn over all squares
            open(states, N);
          } else {
            this.classList.add('sq-back');
            this.textContent = state;
            // finish the game
            if (cnt === N * N - bombNum) {
              clearTimeout(timerId);
              finish.classList.remove('hidden');
              reset.classList.remove('hidden');
            }
          } 
        });

        // right-click
        square.addEventListener('contextmenu', function() {
          if (cnt === 0 && flag === 0) {
            countTime(Date.now());
          }
          flag++;
          
          img = document.createElement('img');
          img.setAttribute('src', 'images/flag.png');
          img.setAttribute('width', '30px');
          img.setAttribute('height', '30px');
          this.appendChild(img);
        });
      }
    }
    
    // reset
    reset.addEventListener('click', function() {
      if (!finish.classList.contains('hidden')){
        finish.classList.add('hidden');
      }
      if (!gameOver.classList.contains('hidden')){
        gameOver.classList.add('hidden');
      }
      reset.classList.add('hidden');
      updateTimer(0);
      // delete table
      var tbl = document.getElementById('tbl');
      var tblParent = tbl.parentNode;
      tblParent.removeChild(tbl);
      
      main();
    });
  }
  
  main();

})();
