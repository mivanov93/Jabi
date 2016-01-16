/* @author x0r */

var a = [];
var how = 2;
var t = 0;
var x, y;

function rand(n) {
    return Math.max((Math.floor(Math.random() * n)) % n, 1);
}

function crSorted() {
    return crLinear().sort();
}

function crLinear() {
    var linear = [];
    for (var i = 0; i < how; i++) {
        for (var j = 0; j < how; j++) {
            linear.push(a[i][j]);
        }
    }
    return linear;
}

function init() {
    for (var i = 0; i < how; i++) {
        for (var j = 0; j < how; j++) {
            if (typeof a[i] === 'undefined') {
                a[i] = [];
            }
            a[i][j] = rand(100);
        }
    }
    x = rand(how);
    y = rand(how);
    a[x][y] = 0;
    sol = crSorted();
}

function isSolved() {
    var thisSol = crLinear();
    for (var i = 0; i < sol.length; i++) {
        if (sol[i] !== thisSol[i]) {
            return false;
        }
    }
    return true;
}

function move(dx, dy)
{
    if (t < 20) {
        console.log('trying', dx, dy);
        t++;
    }
    if ((x + dx) >= 0 && (x + dx) < a.length && (y + dy) >= 0 && (y + dy) < a.length)
    {
        a[x][y] = a[x + dx][y + dy];
        a[x + dx][y + dy] = 0;
        x += dx;
        y += dy;
        if (t < 20) {
            console.log('ok', dx, dy);
            t++;
        }
        return true;
    }
    if (t < 20) {
        console.log('failed', dx, dy);
        t++;
    }
    return false;
}

function ok(v) {
    if (v === true) {
        console.log('solved');
    }
    return true;
}

function solve() {
    if (isSolved()) {
        return ok(true);
    }
    if (move(0, 1)) {
        if (solve()) {
            return ok();
        }
        else {
            move(0, -1);
        }
    }
    if (move(1, 0)) {
        if (solve()) {
            return ok();
        }
        else {
            move(-1, 0);
        }
    }
    if (move(0, -1)) {
        if (solve()) {
            return ok();
        }
        else {
            move(0, 1);
        }
    }
    if (move(-1, 0)) {
        if (solve()) {
            return ok();
        }
        else {
            move(1, 0);
        }
    }
    return false;
}
init();
console.log(a);
solve();