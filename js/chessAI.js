$(document).ready(function () {
  var minimaxDepth = 2;
  var restart = false;
  var aiFirst = false;
  initGame();

  function initGame() {
    var aiFirst = false;
    $("#board").hide();
    $("#gameover").hide();
    $("#restart").hide();
    $("#start1").hide();
    $("#start2").hide();

    $("#difficulty").show();

    $(".easy").click(function () {
      setDepth();
      minimaxDepth = 1;
      console.log(minimaxDepth);
    });

    $(".hard").click(function () {
      setDepth();
      minimaxDepth = 3;
      console.log(minimaxDepth);
    });

    $(".normal").click(function () {
      setDepth();
      minimaxDepth = 2;
      console.log(minimaxDepth);
    });

    function setDepth() {
      $("#difficulty").hide();
      $("#board").show();
      $("#restart").show();
      $("#start1").show();
      $("#start2").show();
    }
  }

  $(".restartGame").click(function () {
    board.clear();
    board.start();
    game.reset();
    aiFirst = false;
    restart = true;
    initGame();
  });

  $(".StartGame1").click(function () {
    restart = false;
    aiFirst = true;
    $("#start1").hide();
    $("#start2").hide();
    window.setTimeout(makeAImove, 250);
  });
  $(".StartGame2").click(function () {
    restart = false;
    aiFirst = false;
    $("#start1").hide();
    $("#start2").hide();
    window.setTimeout(makeRandomMove, 250);
  });
  var board,
    game = new Chess();

  var positionCount;

  // uses the minimax algorithm with alpha beta pruning to caculate the best move
  var calculateBestMove = function () {
    var possibleNextMoves = game.moves();
    if (game.in_checkmate() === true) {
      $("#gameover").show();
      $("#gameover").html("Game over! Checkmate");
      return;
    } else if (game.in_threefold_repetition() === true) {
      $("#gameover").show();
      $("#gameover").html("Game over! Threefold_repetition");
      return;
    } else if (game.insufficient_material() === true) {
      $("#gameover").show();
      $("#gameover").html("Game over! Insufficient_material");
      return;
    } else if (game.half_moves >= 100) {
      $("#gameover").show();
      $("#gameover").html("Game over! 50 move-rule");
      return;
    }
    var bestMove = -9999;
    var bestMoveFound;

    for (var i = 0; i < possibleNextMoves.length; i++) {
      var possibleNextMove = possibleNextMoves[i];
      game.move(possibleNextMove);
      var value = minimax(minimaxDepth, -10000, 10000, false);
      game.undo();
      if (value >= bestMove) {
        bestMove = value;
        bestMoveFound = possibleNextMove;
      }
    }
    return bestMoveFound;
  };

  // minimax with alhpha-beta pruning and search depth d = 3 levels
  var minimax = function (depth, alpha, beta, isMaximisingPlayer) {
    positionCount++;

    if (depth === 0) {
      if (aiFirst === false) return -evaluateBoard(game.board());
      else if (aiFirst === true) return evaluateBoard(game.board());
    }

    var possibleNextMoves = game.moves();
    var numPossibleMoves = possibleNextMoves.length;

    if (isMaximisingPlayer) {
      var bestMove = -9999;
      for (var i = 0; i < numPossibleMoves; i++) {
        game.move(possibleNextMoves[i]);
        bestMove = Math.max(
          bestMove,
          minimax(depth - 1, alpha, beta, !isMaximisingPlayer)
        );
        game.undo();
        alpha = Math.max(alpha, bestMove);
        if (beta <= alpha) {
          return bestMove;
        }
      }
    } else {
      var bestMove = 9999;
      for (var i = 0; i < numPossibleMoves; i++) {
        game.move(possibleNextMoves[i]);
        bestMove = Math.min(
          bestMove,
          minimax(depth - 1, alpha, beta, !isMaximisingPlayer)
        );
        game.undo();
        beta = Math.min(beta, bestMove);
        if (beta <= alpha) {
          return bestMove;
        }
      }
    }

    return bestMove;
  };

  // the evaluation function for minimax
  var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
      }
    }
    return totalEvaluation;
  };

  var reverseArray = function (array) {
    return array.slice().reverse();
  };

  var whitePawnEval = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ];

  var blackPawnEval = reverseArray(whitePawnEval);

  var knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  ];

  var whiteBishopEval = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  ];

  var blackBishopEval = reverseArray(whiteBishopEval);

  var whiteRookEval = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
  ];

  var blackRookEval = reverseArray(whiteRookEval);

  var evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  ];

  var whiteKingEval = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
  ];

  var blackKingEval = reverseArray(whiteKingEval);

  var getPieceValue = function (piece, x, y) {
    if (piece === null) {
      return 0;
    }

    var absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);

    if (piece.color === "w") {
      return absoluteValue;
    } else {
      return -absoluteValue;
    }
  };

  var getAbsoluteValue = function (piece, isWhite, x, y) {
    if (piece.type === "p") {
      return 10 + (isWhite ? whitePawnEval[y][x] : blackPawnEval[y][x]);
    } else if (piece.type === "r") {
      return 50 + (isWhite ? whiteRookEval[y][x] : blackRookEval[y][x]);
    } else if (piece.type === "n") {
      return 30 + knightEval[y][x];
    } else if (piece.type === "b") {
      return 30 + (isWhite ? whiteBishopEval[y][x] : blackBishopEval[y][x]);
    } else if (piece.type === "q") {
      return 90 + evalQueen[y][x];
    } else if (piece.type === "k") {
      return 900 + (isWhite ? whiteKingEval[y][x] : blackKingEval[y][x]);
    }
  };

  var makeAImove = function () {
    if (restart) return;
    positionCount = 0;
    var d = new Date().getTime();
    var bestMove = calculateBestMove();
    var d2 = new Date().getTime();
    var moveTime = d2 - d;
    $("#time").text(moveTime / 1000 + "s");
    $("#position-count").text(positionCount);

    game.move(bestMove);

    board.position(game.fen());
    if (!restart) window.setTimeout(makeRandomMove, 250);
    console.log("AI");
  };

  function makeRandomMove() {
    if (restart) return;
    var possibleMoves = game.moves();
    if (game.in_checkmate() === true) {
      $("#gameover").show();
      $("#gameover").html("Game over! Checkmate");
      return;
    } else if (game.in_threefold_repetition() === true) {
      $("#gameover").show();
      $("#gameover").html("Game over! Threefold_repetition");
      return;
    } else if (game.insufficient_material() === true) {
      $("#gameover").show();
      $("#gameover").html("Game over! Insufficient_material");
      return;
    } else if (game.half_moves >= 100) {
      $("#gameover").show();
      $("#gameover").html("Game over! 50 move-rule");
      return;
    }
    // game over
    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);

    board.position(game.fen());
    if (!restart) window.setTimeout(makeAImove, 250);
    console.log("Random");
  }

  var onDrop = function (source, target, piece) {
    removeGreySquares();
    console.log("Drop here");
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: "q",
    });

    // illegal move
    if (move === null) return "snapback";

    // make legal move for black AI player
  };

  var onMouseoverSquare = function (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  };

  var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
  };

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  var onSnapEnd = function () {
    board.position(game.fen());
  };

  var cfg = {
    position: "start",
    onSnapEnd: onSnapEnd,
  };

  board = ChessBoard("board", cfg);
});
