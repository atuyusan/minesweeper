(function () {
  'use strict';

  // determine position of bombs
  function setBombs() {
    var rands = [];
    while (rands.length < bombNum) {
      var rand = Math.floor(Math.random() * N * N);
      if (rands.indexOf(rand) ===  -1) {
        rands.push(rand);
      }
    }

    states = new Array(N);
    for (let i = 0; i < N; i++) {
      states[i] = new Array(N);
      for (let j = 0; j < N; j++) {
        states[i][j] = '';
      }
    }
    while (rands.length > 0) {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          if (i * N + j === rands[0]) {
            states[i][j] = 'bomb';
            rands.shift();
          }
        }
      }
    }
  }

  // calculate number of adjacent bombs
  function setNum() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        
        if (states[i][j] !== 'bomb') {
          states[i][j] = 0;
          
          for (let k = Math.max(i-1, 0); k <= Math.min(i+1, N-1); k++) {
            for (let l = Math.max(j-1, 0); l <= Math.min(j+1, N-1); l++) {
              if (states[k][l] === 'bomb') {
                states[i][j]++;
              }
            }
          }
          
          if (states[i][j] === 0) {
            states[i][j] = '';
          } else {
            states[i][j] = String(states[i][j]);
          }          
        }
      }
    }
  }
  
  // set state of the map
  function setState() {
    setBombs();    
    setNum();
  }

  // initialize the map
  function initMap() {
    while (map.firstChild) {
      map.removeChild(map.firstChild);
    }
    
    var table = document.createElement('table');
    
    for (let i=0; i < N; i++) {
      var row = table.insertRow(-1);
      for (let j=0; j < N; j++) {
        var id = 'cell' + String(i) + '-' + String(j);
        if (i === 0) {
          var th = document.createElement('th');
          th.classList.add('cell-front');
          th.setAttribute('id', id);
          row.appendChild(th);
        } else {
          var td = document.createElement('td');
          td.classList.add('cell-front');
          td.setAttribute('id', id);
          row.appendChild(td);
        }
      }
    }
    map.appendChild(table);  
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

  // open all cells
  function openAllCells() {
    var tmpCell;
    var tmpState;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        tmpCell = document.getElementById('cell' + String(i) + '-' + String(j));
        tmpState = states[i][j];
        openCell(tmpCell, tmpState);
      }
    }
  }

  // show image of bombs or flags
  function showImg(position, image) {
    img = document.createElement('img');
    img.setAttribute('src', './images/' + image + '.png');
    img.setAttribute('width', '30px');
    img.setAttribute('height', '30px');
    position.appendChild(img);
  }

  // open a cell if it is not opend
  function openCell(tmpCell, tmpState) {
    if (tmpCell.classList.contains('cell-front')) {
      tmpCell.classList.remove('cell-front');

      if (tmpState === 'bomb') {
        while (tmpCell.firstChild) {
          tmpCell.removeChild(tmpCell.firstChild);
        }
        tmpCell.classList.add('bomb');
        showImg(tmpCell, 'bomb');   
      } else {
        tmpCell.classList.add('cell-back');
        tmpCell.textContent = tmpState;
      }
      cnt++;     
    }
  }

  function openCellsAtOnce(x, y) {
    var stack;
    var check;
    var idx;
    var tmp;
    
    if (states[x][y] !== '') {
      return;
    }

    stack = [[x, y]];
    // 0: not checked, 1: checked
    check = [];
    for (let i = 0; i < N; i++) {
      tmp = [];
      for (let j = 0; j < N; j++) {
        tmp.push(0);
      }
      check.push(tmp);
    }

    while (stack.length > 0) {
      idx = stack.pop();
      x = idx[0];
      y = idx[1];
      check[x][y] = 1;
      for (let i = Math.max(0, x-1); i <= Math.min(x+1, N-1); i++) {
        for (let j = Math.max(0, y-1); j <= Math.min(y+1, N-1); j++) {
          openCell(document.getElementById('cell' + String(i) + '-' + String(j)), states[i][j]);
          if (states[i][j] === '' && check[i][j] === 0) {
            stack.push([i, j]);
          }
        }
      }
    }
  }

  // describe what happend when you open the cell
  function dig() {
    var cell;
    var state;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        cell = document.getElementById('cell' + String(i) + '-' + String(j));
        // click
        cell.addEventListener('click', function() {
          if (this.classList.contains('cell-front') === false) {
            return;
          }
          
          if(cnt === 0 && flag === 0) {
            countTime(Date.now());
            if (!settings.classList.contains('disabled')) {
              settings.classList.add('disabled');
              level.disabled = 'true';  // non active
            }
          }
          
          state = states[i][j];
          openCell(this, state);
          
          if (state === 'bomb') {
            // game over
            gameOver.classList.remove('hidden');
            reset.classList.remove('hidden');
            clearTimeout(timerId);
            openAllCells();
          } else if (state === '') {
            openCellsAtOnce(i, j);
          }
          // finish the game
          if (cnt === N * N - bombNum) {
            clearTimeout(timerId);
            finish.classList.remove('hidden');
            reset.classList.remove('hidden');          
          }
        });

        // right-click
        cell.addEventListener('contextmenu', function() {
          if (cnt === 0 && flag === 0) {
            countTime(Date.now());
          }
          flag++;
          showImg(this, 'flag');          
        });
      }
    }
  }

  // decide the size of the map and the number of bombs depending on the level
  function setLevel(level) {
    switch (level) {
      case '1':
        N = 9;
        bombNum = 10;
        break;
      case '2':
        N = 16;
        bombNum = 40;
        break;
      case '3':
        N = 22;
        bombNum = 99;
    }
  }

  // prepare for and play the game
  function playGame() {
    cnt = 0;
    flag = 0;
    initMap();
    setState();
    dig();
  }

  // reset game when you press reset button
  function resetGame() {    
    if (!finish.classList.contains('hidden')){
      finish.classList.add('hidden');
    }
    if (!gameOver.classList.contains('hidden')){
      gameOver.classList.add('hidden');
    }
    reset.classList.add('hidden');
    settings.classList.remove('disabled');
    level.disabled = ''; // activate
    updateTimer(0); 
  }

  var map = document.getElementById('map');
  var level = document.getElementById('level');
  var gameOver = document.getElementById('gameover');
  var finish = document.getElementById('finish');
  var reset = document.getElementById('reset');
  var timer = document.getElementById('timer');
  var settings = document.getElementById('settings');
  var timerId;
  var N = 9;
  var bombNum = 10;
  var states;
  var cnt;
  var flag;
  var img;

  // main
  (function() {
    playGame();
    
    // change level
    level.addEventListener('change', function() {
      if (settings.classList.contains('disabled')) {
        return;
      }
      setLevel(this.value);
      playGame();
    });
    
    // reset
    reset.addEventListener('click', function() {
      resetGame();
      playGame();
    });
  })();
})();
