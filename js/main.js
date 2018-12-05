(function () {
  'use strict';

  // determine position of bombs
  function setBombs(x, y) {
    var rands = [];
    while (rands.length < bombNum) {
      var rand = Math.floor(Math.random() * N * N);
      if (rand !== x * N + y && rands.indexOf(rand) ===  -1) {
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
  function setState(i, j) {
    setBombs(i, j);
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
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
    timer.textContent = m + ':' + s;
  }

  // count elapsed time
  function countTime(startTime) {
    timerId = setTimeout(function() {
      updateTimer(Date.now() - startTime);
      countTime(startTime);
    }, 10);
  }

  // open all cells
  function openAll() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        open(i, j);
      }
    }
  }

  // show image of bombs or flags
  function addImg(position, image) {
    img = document.createElement('img');
    img.setAttribute('src', './images/' + image + '.png');
    img.setAttribute('width', '30px');
    img.setAttribute('height', '30px');
    position.appendChild(img);
  }

  // open a cell if it is not opend
  function openACell(x, y) {
    var cell1 = document.getElementById('cell' + String(x) + '-' + String(y));
    var tmpState = states[x][y];

    if (cell1.classList.contains('cell-front') === false) {
      return;
    }
            
    cell1.classList.remove('cell-front');
    
    if (tmpState === 'bomb') {
      while (cell1.firstChild) {
        cell1.removeChild(cell1.firstChild);
      }
      cell1.classList.add('bomb');
      addImg(cell1, 'bomb');
      gameOver.classList.remove('hidden');
      reset.classList.remove('hidden');
      clearTimeout(timerId);
      openAll();
      map.classList.add('disabled');
      map.disabled = 'true';
    } else {
      cell1.classList.add('cell-back');
      cell1.textContent = tmpState;
    }

    cnt++;
  }

  // decide which cell to open
  function open(x, y) {
    var stack;
    var check;
    var idx;
    var tmp;
 
    if (states[x][y] !== '') {
      openACell(x, y);
    } else {

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
          openACell(i, j);
          if (states[i][j] === '' && check[i][j] === 0) {
            stack.push([i, j]);
          }
        }
      }
    }
    }
  }

  // open all cells adjacent to the cell on which you double-click except for flag
  function openAtOnce(x, y) {
    var cell3 = document.getElementById('cell' + String(x) + '-' + String(y));
    var tmpFlag = 0;
    
    if (states[x][y] === '' || cell3.classList.contains('cell-front') === true) {
      return;
    }

    for (let i = Math.max(x-1, 0); i <= Math.min(x+1, N-1); i++) {
      for (let j = Math.max(y-1, 0); j <= Math.min(y+1, N-1); j++) {
        cell3 = document.getElementById('cell' + String(i) + '-' + String(j));
        if (cell3.firstChild) {
          if (cell3.firstChild.tagName === 'IMG') {
            tmpFlag++;
          }
        }
      }
    }

    if (states[x][y] === String(tmpFlag)) {
      for (let i = Math.max(x-1, 0); i <= Math.min(x+1, N-1); i++) {
        for (let j = Math.max(y-1, 0); j <= Math.min(y+1, N-1); j++) {
          cell3 = document.getElementById('cell' + String(i) + '-' + String(j));
          if (cell3.firstChild) {
            if (cell3.firstChild.tagName === 'IMG') {
              continue;
            }
          }
          open(i, j);
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

          if(cnt === 0 && flag === 0) {
            // start 
            setState(i, j);
            countTime(Date.now());
            if (!settings.classList.contains('disabled')) {
              settings.classList.add('disabled');
              level.disabled = 'true';  // non active
            }
          }
          
          state = states[i][j];
          open(i, j);
                    
          // finish the game
          if (cnt === N * N - bombNum) {
            clearTimeout(timerId);
            finish.classList.remove('hidden');
            reset.classList.remove('hidden');
            map.classList.add('disabled');
            map.disabled = 'true';
          }
        });

        // right-click
        cell.addEventListener('contextmenu', function() {
          if (map.disabled === 'true') {
            return;
          }
          if (cnt === 0 && flag === 0) {
            countTime(Date.now());
          }
          if (this.firstChild) {
            this.removeChild(this.firstChild);
            flag--;
          } else {
            addImg(this, 'flag');
            flag++;
          }
        });

        // double-click
        var clickCount = 0;
        var delay = 350;
        cell.addEventListener('click', function() {
          clickCount++;
          setTimeout(function() {
            if (clickCount >= 2) {
              openAtOnce(i, j);
            }
            clickCount = 0;
          }, delay);
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
    map.disabled = '';
    map.classList.remove('disabled');
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
