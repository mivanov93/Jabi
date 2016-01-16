(function () {
    var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

    floor = Math.floor, min = Math.min;


    /*
     Default comparison function to be used
     */

    defaultCmp = function (x, y) {
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    };


    /*
     Insert item x in list a, and keep it sorted assuming a is sorted.
     
     If x is already in a, insert it to the right of the rightmost x.
     
     Optional args lo (default 0) and hi (default a.length) bound the slice
     of a to be searched.
     */

    insort = function (a, x, lo, hi, cmp) {
        var mid;
        if (lo == null) {
            lo = 0;
        }
        if (cmp == null) {
            cmp = defaultCmp;
        }
        if (lo < 0) {
            throw new Error('lo must be non-negative');
        }
        if (hi == null) {
            hi = a.length;
        }
        while (lo < hi) {
            mid = floor((lo + hi) / 2);
            if (cmp(x, a[mid]) < 0) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
    };


    /*
     Push item onto heap, maintaining the heap invariant.
     */

    heappush = function (array, item, cmp) {
        if (cmp == null) {
            cmp = defaultCmp;
        }
        array.push(item);
        return _siftdown(array, 0, array.length - 1, cmp);
    };


    /*
     Pop the smallest item off the heap, maintaining the heap invariant.
     */

    heappop = function (array, cmp) {
        var lastelt, returnitem;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        lastelt = array.pop();
        if (array.length) {
            returnitem = array[0];
            array[0] = lastelt;
            _siftup(array, 0, cmp);
        } else {
            returnitem = lastelt;
        }
        return returnitem;
    };


    /*
     Pop and return the current smallest value, and add the new item.
     
     This is more efficient than heappop() followed by heappush(), and can be
     more appropriate when using a fixed size heap. Note that the value
     returned may be larger than item! That constrains reasonable use of
     this routine unless written as part of a conditional replacement:
     if item > array[0]
     item = heapreplace(array, item)
     */

    heapreplace = function (array, item, cmp) {
        var returnitem;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        returnitem = array[0];
        array[0] = item;
        _siftup(array, 0, cmp);
        return returnitem;
    };


    /*
     Fast version of a heappush followed by a heappop.
     */

    heappushpop = function (array, item, cmp) {
        var _ref;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        if (array.length && cmp(array[0], item) < 0) {
            _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
            _siftup(array, 0, cmp);
        }
        return item;
    };


    /*
     Transform list into a heap, in-place, in O(array.length) time.
     */

    heapify = function (array, cmp) {
        var i, _i, _j, _len, _ref, _ref1, _results, _results1;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        _ref1 = (function () {
            _results1 = [];
            for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--) {
                _results1.push(_j);
            }
            return _results1;
        }).apply(this).reverse();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            i = _ref1[_i];
            _results.push(_siftup(array, i, cmp));
        }
        return _results;
    };


    /*
     Update the position of the given item in the heap.
     This function should be called every time the item is being modified.
     */

    updateItem = function (array, item, cmp) {
        var pos;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        pos = array.indexOf(item);
        if (pos === -1) {
            return;
        }
        _siftdown(array, 0, pos, cmp);
        return _siftup(array, pos, cmp);
    };


    /*
     Find the n largest elements in a dataset.
     */

    nlargest = function (array, n, cmp) {
        var elem, result, _i, _len, _ref;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        result = array.slice(0, n);
        if (!result.length) {
            return result;
        }
        heapify(result, cmp);
        _ref = array.slice(n);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            elem = _ref[_i];
            heappushpop(result, elem, cmp);
        }
        return result.sort(cmp).reverse();
    };


    /*
     Find the n smallest elements in a dataset.
     */

    nsmallest = function (array, n, cmp) {
        var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        if (n * 10 <= array.length) {
            result = array.slice(0, n).sort(cmp);
            if (!result.length) {
                return result;
            }
            los = result[result.length - 1];
            _ref = array.slice(n);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                elem = _ref[_i];
                if (cmp(elem, los) < 0) {
                    insort(result, elem, 0, null, cmp);
                    result.pop();
                    los = result[result.length - 1];
                }
            }
            return result;
        }
        heapify(array, cmp);
        _results = [];
        for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            _results.push(heappop(array, cmp));
        }
        return _results;
    };

    _siftdown = function (array, startpos, pos, cmp) {
        var newitem, parent, parentpos;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        newitem = array[pos];
        while (pos > startpos) {
            parentpos = (pos - 1) >> 1;
            parent = array[parentpos];
            if (cmp(newitem, parent) < 0) {
                array[pos] = parent;
                pos = parentpos;
                continue;
            }
            break;
        }
        return array[pos] = newitem;
    };

    _siftup = function (array, pos, cmp) {
        var childpos, endpos, newitem, rightpos, startpos;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        endpos = array.length;
        startpos = pos;
        newitem = array[pos];
        childpos = 2 * pos + 1;
        while (childpos < endpos) {
            rightpos = childpos + 1;
            if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
                childpos = rightpos;
            }
            array[pos] = array[childpos];
            pos = childpos;
            childpos = 2 * pos + 1;
        }
        array[pos] = newitem;
        return _siftdown(array, startpos, pos, cmp);
    };

    Heap = (function () {
        Heap.push = heappush;

        Heap.pop = heappop;

        Heap.replace = heapreplace;

        Heap.pushpop = heappushpop;

        Heap.heapify = heapify;

        Heap.updateItem = updateItem;

        Heap.nlargest = nlargest;

        Heap.nsmallest = nsmallest;

        function Heap(cmp) {
            this.cmp = cmp != null ? cmp : defaultCmp;
            this.nodes = [];
        }

        Heap.prototype.push = function (x) {
            return heappush(this.nodes, x, this.cmp);
        };

        Heap.prototype.pop = function () {
            return heappop(this.nodes, this.cmp);
        };

        Heap.prototype.peek = function () {
            return this.nodes[0];
        };

        Heap.prototype.contains = function (x) {
            return this.nodes.indexOf(x) !== -1;
        };

        Heap.prototype.replace = function (x) {
            return heapreplace(this.nodes, x, this.cmp);
        };

        Heap.prototype.pushpop = function (x) {
            return heappushpop(this.nodes, x, this.cmp);
        };

        Heap.prototype.heapify = function () {
            return heapify(this.nodes, this.cmp);
        };

        Heap.prototype.updateItem = function (x) {
            return updateItem(this.nodes, x, this.cmp);
        };

        Heap.prototype.clear = function () {
            return this.nodes = [];
        };

        Heap.prototype.empty = function () {
            return this.nodes.length === 0;
        };

        Heap.prototype.size = function () {
            return this.nodes.length;
        };

        Heap.prototype.clone = function () {
            var heap;
            heap = new Heap();
            heap.nodes = this.nodes.slice(0);
            return heap;
        };

        Heap.prototype.toArray = function () {
            return this.nodes.slice(0);
        };

        Heap.prototype.insert = Heap.prototype.push;

        Heap.prototype.top = Heap.prototype.peek;

        Heap.prototype.front = Heap.prototype.peek;

        Heap.prototype.has = Heap.prototype.contains;

        Heap.prototype.copy = Heap.prototype.clone;

        return Heap;

    })();

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            return define([], factory);
        } else if (typeof exports === 'object') {
            return module.exports = factory();
        } else {
            return root.Heap = factory();
        }
    })(this, function () {
        return Heap;
    });

}).call(this);


(function (window,Math,console) {

    function solve() {

        var startTwoDimArray = createTwoDimArray([0, 3, 8, 4, 1, 7, 2, 6, 5]);
        var finalTwoDimArray = createTwoDimArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);

        var initBoardObject = new BoardObject(startTwoDimArray);
        var finalBoardObject = new BoardObject(finalTwoDimArray);


        var openList = new Heap(function (boardStateX, boardStateY) {
            return boardStateX.f - boardStateY.f;
        });
        var closeList = [];

        openList.push(initBoardObject);
        initBoardObject.isOpened = true;

        var board;
        var neighborsArr;

        while (!openList.empty()) {

            board = openList.pop(); // pop the board which has the minimum f value

            closeList.push(board);  // we are going to inspect this board now

            if (board.isEqualTo(finalBoardObject)) {
                break;
            }

            neighborsArr = board.getNeighbors(); // get legal moves

            for (var i = 0; i < neighborsArr.length; i++) {
                var n = neighborsArr[i];

                // skip inspected boards
                var skip = false;
                for (var j = 0; j < closeList.length; j++) {
                    if (closeList[j].isEqualTo(n)) {
                        skip = true;
                        break;
                    }
                }
                if (skip) {
                    continue;
                }

                var ng = board.g + 1;

                if (!n.isOpened || ng < n.g) {
                    n.g = ng;
                    n.h = n.h || calculateHeuristic(n.board);
                    n.f = n.g + n.h;
                    n.par = board;

                    if (!n.isOpened) {
                        openList.push(n);
                        n.isOpened = true;
                    } else {
                        openList.updateItem(n);
                    }
                }
            }
        }

        var moves = 0;
        while (true) {
            if (board.par !== null) {
                moves++;
                board = board.par;
            } else {
                break;
            }
        }

        console.log("Moves so far: ", moves);
    }

    function calculateHeuristic(arr) {

        var h = 0;
        var value;

        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {

                value = i * 3 + j;
                if (arr[i][j] !== value) {

                    var c, d;
                    for (var k = 0; k < arr.length; k++) {
                        for (var l = 0; l < arr[k].length; l++) {
                            if (arr[k][l] === value) {
                                c = k;
                                d = l;
                                break;
                            }
                        }
                    }

                    h += Math.abs(i - c) + Math.abs(j - d);
                }

            }
        }

        return h;
    }

    function BoardObject(twoDimArr) {
        this.board = twoDimArr;
        this.f = 0; // score
        this.g = 0; // distance
        this.h = 0; // heuristics
        this.isOpened = false;
        this.par = null;
    }

    BoardObject.prototype.getNeighbors = function () {
        var arr = [], toPush = [];

        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {

                if (this.board[i][j] === 0) { // get coordinates of 0
                    if (i === 0) {
                        if (j === 0) {
                            toPush.push([0, 0, 0, 1], [0, 0, 1, 0]);
                        }
                        else if (j === 1) {
                            toPush.push([0, 1, 0, 0], [0, 1, 0, 2], [0, 1, 1, 1]);
                        }
                        else {
                            toPush.push([0, 2, 0, 1], [0, 2, 1, 2]);
                        }
                    } else if (i === 1) {
                        if (j === 0) {
                            toPush.push([1, 0, 0, 1], [1, 0, 1, 1], [1, 0, 2, 0]);
                        }
                        else if (j === 1) {
                            toPush.push([1, 1, 0, 1], [1, 1, 1, 2], [1, 1, 2, 1], [1, 1, 1, 0]);
                        }
                        else {
                            toPush.push([1, 2, 0, 2], [1, 2, 1, 1], [1, 2, 2, 2]);
                        }
                    } else {
                        if (j === 0) {
                            toPush.push([2, 0, 1, 0], [2, 0, 2, 1]);
                        }
                        else if (j === 1) {
                            toPush.push([2, 1, 2, 0], [2, 1, 1, 1], [2, 1, 2, 2]);
                        }
                        else {
                            toPush.push([2, 2, 1, 2], [2, 2, 2, 1]);
                        }
                    }
                    for (i = 0; i < toPush.length; i++) {
                        arr.push(this.getNewBoard.apply(this, toPush[i]));
                    }

                    return arr;
                }
            }
        }
        console.error('cant find 0');
        return arr;
    };

    BoardObject.prototype.isEqualTo = function (another) {
        for (var i = 0; i < another.board.length; i++) {
            for (var j = 0; j < another.board[i].length; j++) {
                if (another.board[i][j] !== this.board[i][j]) {
                    return false;
                }
            }
        }
        return true;
    };

    BoardObject.prototype.getNewBoard = function (x0, y0, x, y) {
        var newArr = [];
        for (var i = 0; i < this.board.length; i++) {
            newArr[i] = this.board[i].slice();
        }

        newArr[x0][y0] = newArr[x][y];
        newArr[x][y] = 0;

        return new BoardObject(newArr, 0);
    };


    function createTwoDimArray(arr) {
        var newArr = [[], [], []];
        for (var i = 0; i < arr.length; i++) {
            newArr[Math.floor(i / 3)][i % 3] = arr[i];
        }

        return newArr;
    }

    window.SolvePuzzle = {
        solve: solve
    };

})(window,Math,console);