(function () {
  'use strict';
    
  // 盤面に爆弾を配置する関数
  function makeState(N, bombNum) {
    // 爆弾の位置を決定
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
        if (rands.length > 0 && i * N + j === rands[0]) {
          states[i][j] = 'bomb';
          rands.shift();
        } else {
          states[i][j] = '';
        }
      }
    }

    // 周囲の爆弾の数を計算
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

  // 盤面の初期状態を作る関数
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

  var board = document.getElementById('board');
  var gameOver = document.getElementById('gameover');
  var reset = document.getElementById('reset');

  function main() {
  
    var N = 3;
    var bombNum = 1;
    
    initBoard(N);
    var states = makeState(N, bombNum);
    
    // click
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        var square = document.getElementById('square' + String(i) + String(j));
        
        square.addEventListener('click', function() {
          var state = states[i][j];
          this.classList.remove('sq-front');
          
          if (state === 'bomb') {
            this.classList.add('bomb');
            var img = document.createElement('img');
            img.setAttribute('src', './images/bomb.png');
            img.setAttribute('width', '30px');
            img.setAttribute('height', '30px');
            this.appendChild(img);
            gameOver.classList.remove('hidden');
            reset.classList.remove('hidden');
          } else {
            this.classList.add('sq-back');
            this.textContent = state;
          }        
        });
      }
    }
    
    // reset
    reset.addEventListener('click', function() {    
      gameOver.classList.add('hidden');
      reset.classList.add('hidden');
      // table削除
      var tbl = document.getElementById('tbl');
      var tblParent = tbl.parentNode;
      tblParent.removeChild(tbl);
      
      main();
    });
  }
  
  main();
  
})();
