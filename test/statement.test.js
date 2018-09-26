const statement = require('../html/statement');

class CustomerBuilder {
    constructor() {
        this.rentials = []
    }

    withName(name) {
        this.name = name;
        return this;
    }

    withRental(rentials) {
        this.rentials.push(rentials);
        return this;
    }

    build() {
        return {
            name: this.name,
            rentals: this.rentials
        }
    }
}

function The() {
    return {
        Customer: function () {
            return new CustomerBuilder();
        }
    }
}

function movieList() {
    return {
        F001: {
            title: "Ran",
            code: "regular"
        },
        F002: {
            title: "Trois Couleurs: Bleu",
            code: "regular"
        },
        F003: {
            title: "The Predator",
            code: "new"
        },
        F004: {
            title: "Ice Age",
            code: "childrens"
        }
    }
}

test('regular movie for one day costs 2', () => {

    let customer = The().Customer().withName("John")
        .withRental({"movieID": "F001", "days": 1}).build();


    let report = statement(customer, movieList());

    expect(report).toBe("Rental Record for John\n" +
        "\tRan\t2\n" +
        "Amount owed is 2\n" +
        "You earned 1 frequent renter points\n");
});

test('new movie cost 3 for any amount of days', () => {


    let customer = The().Customer().withName("John")
        .withRental({movieID: "F003", days: 1}).build();


    let report = statement(customer, movieList());

    expect(report).toBe("Rental Record for John\n" +
        "\tThe Predator\t3\n" +
        "Amount owed is 3\n" +
        "You earned 1 frequent renter points\n");
});

test('when customer take new movie more than 2 days he earns extra points', () => {


    let customer = The().Customer().withName("John")
        .withRental({"movieID": "F003", "days": 3}).build();


    let report = statement(customer, movieList());

    expect(report).toBe("Rental Record for John\n" +
        "\tThe Predator\t9\n" +
        "Amount owed is 9\n" +
        "You earned 2 frequent renter points\n");
});

test('children movie for one day', () => {

    let customer = The().Customer().withName("John")
        .withRental({"movieID": "F004", "days": 1}).build();


    let report = statement(customer, movieList());

    expect(report).toBe("Rental Record for John\n" +
        "\tIce Age\t1.5\n" +
        "Amount owed is 1.5\n" +
        "You earned 1 frequent renter points\n");
});

test('children movie for 4 days', () => {

    let customer = The().Customer().withName("John")
        .withRental({"movieID": "F004", "days": 4}).build();


    let report = statement(customer, movieList());

    expect(report).toBe("Rental Record for John\n" +
        "\tIce Age\t3\n" +
        "Amount owed is 3\n" +
        "You earned 1 frequent renter points\n");
});

test('regular movie for 3 days', () => {

    let customer = The().Customer().withName("John")
        .withRental({"movieID": "F001", "days": 3}).build();

    let report = statement(customer, movieList());

    expect(report).toBe("Rental Record for John\n" +
        "\tRan\t3.5\n" +
        "Amount owed is 3.5\n" +
        "You earned 1 frequent renter points\n");
});

test('for 2 movies you get 2 frequent renter point', () => {

    let customer = The().Customer().withName("martin")
        .withRental({"movieID": "F001", "days": 3})
        .withRental({"movieID": "F002", "days": 1})
        .build();

    let report = statement(customer, movieList());

    expect(report).toBe("Rental Record for martin\n" +
        "\tRan\t3.5\n" +
        "\tTrois Couleurs: Bleu\t2\n" +
        "Amount owed is 5.5\n" +
        "You earned 2 frequent renter points\n");
});