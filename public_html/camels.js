/* @author x0r */

function solve(n)
{
    if (isSolved(n)) {
        console.log(n);
        return true;
    }
    var res = false;
    if (isPossiblePermA(n)) {
        res = solve(permA(n));
    }
    if (res)
        return ok(n);
    if (isPossiblePermB(n)) {
        res = solve(permB(n));
    }
    if (res)
        return ok(n);
    if (isPossiblePermC(n)) {
        res = solve(permC(n));
    }
    if (res)
        return ok(n);
    if (isPossiblePermD(n)) {
        res = solve(permD(n));
    }
    return res ? ok(n) : false;
}

function ok(n) {
    console.log(n);
    return true;
}

function isPossiblePermA(n) {
    var ind = n.indexOf(0);
    if (ind === 0)
        return false;
    return n[ind - 1] === 1;
}

function isPossiblePermB(n) {
    var ind = n.indexOf(0);
    if (ind < 2)
        return false;
    return n[ind - 2] === 1;
}

function isPossiblePermC(n) {
    var ind = n.indexOf(0);
    if (ind === n.length)
        return false;
    return n[ind + 1] === 2;
}

function isPossiblePermD(n) {
    var ind = n.indexOf(0);
    if (ind > n.length - 3)
        return false;
    return n[ind + 2] === 2;
}

function permA(an) {
    var n = an.slice();
    var ind = n.indexOf(0);
    n[ind] = n[ind - 1];
    n[ind - 1] = 0;
    return n;
}

function permB(an) {
    var n = an.slice();
    var ind = n.indexOf(0);
    n[ind] = n[ind - 2];
    n[ind - 2] = 0;
    return n;
}

function permC(an) {
    var n = an.slice();
    var ind = n.indexOf(0);
    n[ind] = n[ind + 1];
    n[ind + 1] = 0;
    return n;

}

function permD(an) {
    var n = an.slice();
    var ind = n.indexOf(0);
    n[ind] = n[ind + 2];
    n[ind + 2] = 0;
    return n;

}

function isSolved(n)
{
    for (var i = 0; i < (n.length - 1) / 2; i++)
    {
        if (n[i] !== 2)
            return false;
    }
    return n[i] === 0;
}

var k=[1,1,1,0,2,2,2];
solve(k);