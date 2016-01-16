/* @author x0r */

var percentOfMutations = 0.015;
var randomSubsetSize = 5;

function createCityList(n) {
    var cities = [];
    for (var i = 0; i < n; i++) {
        cities[i] = new City();
    }
    return cities;
}

function City() {
    this.x = Math.random() * 100;
    this.y = Math.random() * 100;
}

City.prototype.distTo = function (pointB)
{
    var dist = Math.sqrt(Math.pow(this.x - pointB.x, 2) + Math.pow(this.y - pointB.y, 2));
    return dist;
};


function Tour(cityList) {
    this.totalDist = 0;
    this.fitness = 0;
    this.cityList = cityList;
    this.tour = Array(cityList.length);
}

Tour.prototype.getFitness = function () {
    if (this.fitness === 0) {
        this.fitness = 1 / this.getTotalDist();
    }
    return this.fitness;
};

Tour.prototype.containsCity = function (city) {
    return this.tour.indexOf(city) !== -1;
};


Tour.prototype.setTourToRandom = function () {
    //random tour
    for (var cityIndex = 0; cityIndex < this.cityList.length; cityIndex++) {
        this.tour[cityIndex] = this.cityList[cityIndex];
    }
    shuffle(this.tour);
};

Tour.prototype.getTotalDist = function () {
    if (this.totalDist === 0) {
        for (var cityIndex = 0; cityIndex < this.tour.length; cityIndex++) {
            var fromCity = this.tour[cityIndex];
            var destinationCity;
            if (cityIndex + 1 < this.tour.length) {
                destinationCity = this.tour[cityIndex + 1];
            }
            else {
                destinationCity = this.tour[0];
            }
             this.totalDist  += fromCity.distTo(destinationCity);
        }
    }
    return this.totalDist;
};

function Population(cityList, popSize, init) {
    this.tours = Array(popSize);
    if (init) {
        for (var i = 0; i < popSize; i++) {
            var newTour = new Tour(cityList);
            newTour.setTourToRandom();
            this.tours[i] = newTour;
        }
    }
}

Population.prototype.getFittest = function () {
   // console.log(this.tours.length);
    var fittest = this.tours[0];
    for (var i = 1; i < this.tours.length; i++) {
        //console.log(typeof this.tours[i], "   ", i);
        if (fittest.getFitness() <= this.tours[i].getFitness()) {
            fittest = this.tours[i];
        }
    }
    return fittest;
};



function evolvePopulation(cityList, pop) {
    var newPopulation = new Population(cityList, pop.tours.length, false);

    //keep the best tour
    newPopulation.tours[0] = pop.getFittest();
    //console.log(pop.getFittest(),newPopulation.tours.length);


    for (var i = 1; i < newPopulation.tours.length; i++) {
        // choose parents
        var parent1 = getFittestFromRandomSubset(cityList, pop);
        var parent2 = getFittestFromRandomSubset(cityList, pop);
        // make child
        var child = makeChild(cityList, parent1, parent2);
        // add child to new pop
        newPopulation.tours[i] = child;
    }

    // Mutate the new population a bit to add some new genetic material
    for (i = 1; i < newPopulation.tours.length; i++) {
        mutatePop(newPopulation.tours[i]);
    }

    return newPopulation;
}


function makeChild(cityList, parent1, parent2) {
    // Create new child tour
    var child = new Tour(cityList);

    // Get start and end sub tour positions for parent1's tour
    var startPos = parseInt((Math.random() * parent1.tour.length));
    var endPos = parseInt((Math.random() * parent1.tour.length));

    // Loop and add the sub tour from parent1 to our child
    for (var i = 0; i < child.tour.length; i++) {
        // If our start position is less than the end position
        if (startPos < endPos && i > startPos && i < endPos) {
            child.tour[i] = parent1.tour[i];
        } // If our start position is larger
        else if (startPos > endPos) {
            if (!(i < startPos && i > endPos)) {
                child.tour[i] = parent1.tour[i];
            }
        }
    }

    // Loop through parent2's city tour
    for (i = 0; i < parent2.tour.length; i++) {
        // If child doesn't have the city add it
        if (!child.containsCity(parent2.tour[i])) {
            // Loop to find a spare position in the child's tour
            for (var ii = 0; ii < child.tour.length; ii++) {
                // Spare position found, add city
                if (child.tour[ii] == null) {
                    child.tour[ii] = parent2.tour[i];
                    break;
                }
            }
        }
    }
    return child;
}

// Mutate a tour by swapping random cities in it
function mutatePop(tourObj) {
    for (var tourPos1 = 0; tourPos1 < tourObj.tour.length; tourPos1++) {
        // percent chance to mutate
        if (Math.random() < percentOfMutations) {
            //get random city from the tour
            var tourPos2 = parseInt((tourObj.tour.length * Math.random()));

            //get the city refs
            var city1 = tourObj.tour[tourPos1];
            var city2 = tourObj.tour[tourPos2];

            // Swap them around
            tourObj.tour[tourPos2] = city1;
            tourObj.tour[tourPos1] = city2;
        }
    }
}

// select fitting individual to make a child
function getFittestFromRandomSubset(cityList, pop) {
    // Create the random subset
    var subsetPop = new Population(cityList, randomSubsetSize, false);

    //put a random subset of our pop in the tournament pop
    for (var i = 0; i < randomSubsetSize; i++) {
        var randomId = parseInt((Math.random() * pop.tours.length));
        subsetPop.tours[i] = pop.tours[randomId];
    }
    // Get the fittest tour
    //console.log(tournament.tours.length);
    var fittest = subsetPop.getFittest();
    return fittest;
}



//helper func
function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

var cityList = createCityList(40);
var pop = new Population(cityList, 50, true);
console.log("Starting distance: " + pop.getFittest().getTotalDist());

// Evolve population for 100 generations

for (var i = 0; i < 1000; i++) {
    pop = evolvePopulation(cityList, pop);
}
console.log("Solution: " + pop.getFittest().getTotalDist());
