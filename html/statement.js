function statement(customer, movies, format = "text") {

    switch (format) {
        case "text":
            return textStatement();
        case "html":
            return htmlStatement();
    }

    function textStatement() {
        let result = `Rental Record for ${customer.name}\n`;
        for (let r of customer.rentals) {
            result += `\t${movieFor(r).title}\t${thisAmountFor(r)}\n`;
        }

        result += `Amount owed is ${totalAmount()}\n`;
        result += `You earned ${totalFrequentRentalPoints()} frequent renter points\n`;
        return result;
    }

    function htmlStatement() {
        let result = `<h1>Rental Record for ${customer.name}</h1>`;
        result += "<table>";
        for (let r of customer.rentals) {
            result += `<tr><td>${movieFor(r).title}</td><td>${thisAmountFor(r)}</td></tr>`;
        }
        result += "</table>";
        result += `<p>Amount owed is ${totalAmount()}</p>`;
        result += `<p>You earned ${totalFrequentRentalPoints()} frequent renter points</p>`;
        return result;
    }

    function totalAmount() {
        return customer.rentals.reduce((total, r) => total + thisAmountFor(r), 0);
    }

    function totalFrequentRentalPoints() {
        return customer.rentals.map(frequentRentalPointsFor).reduce((total, r) => total + r);
    }

    function frequentRentalPointsFor(r) {
        return movieFor(r).code === "new" && r.days > 2 ? 2 : 1;
    }

    function movieFor(r) {
        return movies[r.movieID];
    }

    function thisAmountFor(r) {
        switch (movieFor(r).code) {
            case "regular":
                return 2 + (r.days > 2 ? (r.days - 2) * 1.5 : 0);
            case "new":
                return r.days * 3;
            case "childrens":
                return 1.5 + (r.days > 3 ? (r.days - 3) * 1.5 : 0);
        }
    }
}

module.exports = statement;