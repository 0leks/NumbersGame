
let lineChart = d3.select("#lineChart");
let height = 800;
let width = height/2;
let offsetx = 90;
let offsety = 10;
let x = d3.scaleLinear().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

let plotArea = lineChart.append("g").attr("transform", "translate(" + offsetx + ", " + offsety + ")");

let xAxis = plotArea.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(x));
let yAxis = plotArea.append("g")
    .call(d3.axisLeft(y));

let dotGroup = plotArea.append("g");
let xLine = null;
let xLineText = null;
let lastDate = 1;
let valueline = d3.line()
                .x(function(d) { return x(d.day); })
                .y(function(d) { return y(d.xp); });

let hovered = function(data) {
    xLine.datum([{"day":0, "xp":data.xp}, {"day":lastDate, "xp":data.xp}]).attr("d", valueline);
    xLineText.attr("x", x(0) + 5)
        .attr("y", y(data.xp) - 3)
        .text(data.player + ": " + data.xp);
    console.log(data);
}
let hoverReset = function() {
    xLine.datum([{"day":0, "xp":200000000}, {"day":lastDate, "xp":200000000}]).attr("d", valueline);
    xLineText.text("").attr("y", y(200000000));
}


d3.csv("data.csv").then( data => {
    console.log(data);
    let newData = [];
    let players = [];
    data.forEach(row => {
        let name = row.name;
        if( !players.includes(name) ) {
            players.push(name);
        }
        delete row.name;
        for( let key of Object.keys(row) ) {
            let obj = { 
                "player": name,
                "day": +key,
                "xp": +row[key]
            };
            newData.push(obj)
        }
    });
    console.log(newData);
    console.log(players);

    let dates = Object.keys(data[0]).filter( date => {
        return date != "name";
    });
    console.log(dates);
    lastDate = +dates[dates.length-1];
    x.domain([dates[0]-1, lastDate]);
    y.domain([150000000, 200000000]);

    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));
    

    players.forEach( player => {
        let data = newData.filter(d => {
            return d.player == player;
        });
        let pathSelection = dotGroup.selectAll("path." + player).data([data]);
        let pathEnterSelection = pathSelection.enter().append("path");
        pathSelection = pathSelection.merge(pathEnterSelection);
        pathSelection.attr("d", valueline).attr("stroke-width", 2)
                        .attr("class", d => d.player)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue");
    });

    xLine = dotGroup.append("path")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .datum([{"day":0, "xp":200000000}, {"day":dates[dates.length-1], "xp":200000000}])
        .attr("d", valueline);
    

    let circleSelection = dotGroup.selectAll("circle").data(newData);
    let enterSelection = circleSelection.enter().append("circle");
    circleSelection.exit().remove();
    circleSelection = circleSelection.merge(enterSelection);
    circleSelection.attr("cy", d => y(d.xp))
                    .attr("cx", d => x(d.day))
                    .attr("r", 5)
                    .attr("fill", "gray")
                    .attr("class", d => d.player)
                    .on("mouseover", d => hovered(d))
                    .on("mouseout", d => hoverReset());

    xLineText = dotGroup.append("text").text("asdf");
    

});