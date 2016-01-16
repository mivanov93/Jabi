/* @author x0r */

function showTable(table, n) {
    for (var i = 0; i < n; i++) {
        var row = fillArray("_", n);
        for (var col = 0; col < n; col++) {
            if (table[col] == n - 1 - i) {
                row[col] = "*";
            }
        }
        console.log(row.join(""));
    }
}
function solveNqueens(table, n, iters) {
    function getRandPos(li, filt) {
        var r;
        do {
            r = Math.floor(Math.random() * n);
        } while (!filt(li[r]));
        return r;
    }
    function cmp(v) {
        return v > 0;
    }
    function cmp2(v) {
        return v === arrayMin(vconfs);
    }
    for (var k = 0; k < iters; k++) {
        var confs = findConflicts(table, n);
        if (arrSum(confs) === 0) {
            return table;
        }
        var col = getRandPos(confs, cmp);
        var vconfs = [];
        for (var row = 0; row < n; row++) {
            vconfs.push(hits(table, n, col, row));
        }
        table[col] = getRandPos(vconfs, cmp2);
    }
}

function solveAndShowNqueens(n) {
    showTable(solveNqueens(range(n), n, 1000), n);
}

function findConflicts(table, n) {
    var res = [];
    for (var col = 0; col < n; col++) {
        res.push(hits(table, n, col, table[col]));
    }
    return res;
}

function hits(table, n, col, row) {
    var total = 0;
    for (var i = 0; i < n; i++) {
        if (i === col) {
            continue;
        }
        if (table[i] === row || Math.abs(i - col) === Math.abs(table[i] - row))
        {
            total += 1;
        }
    }
    return total;
}

function arrSum(arr) {
    var sum = 0;
    for (var z = 0; z < arr.length; z++) {
        sum += arr[z];
    }
    return sum;
}

function fillArray(value, len) {
    if (len === 0)
        return [];
    var a = [value];
    while (a.length * 2 <= len)
        a = a.concat(a);
    if (a.length < len)
        a = a.concat(a.slice(0, len - a.length));
    return a;
}

function arrayMin(arr) {
    return arr.reduce(function (p, v) {
        return (p < v ? p : v);
    });
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}
solveAndShowNqueens(50);

console.log("default N=50, if you want you can call solveAndShowNqueens(n) with a different n")