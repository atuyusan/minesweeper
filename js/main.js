(function () {
  'use strict';
  
  var board = document.getElementById('board');

  function makeBoard(table, N) {
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

  var states = [['1', '1', '1'],
                ['1', 'bomb', '1'],
                ['1', '1', '1']];

  var N = 3;
  var table = document.createElement('table');
  makeBoard(table, N);


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
        } else {
          this.classList.add('sq-back');
          this.textContent = state;
        }        
      });
    }
  }
  
})();
