import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HistogramDistribution } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'stacked-bar-plot';

ngOnInit() {
console.log(d3);

const hist: HistogramDistribution[] = [ 
    { "dateRange" : "2019-12-11" ,total: 450, delivered : 200, undeliverable:150, enroute:25, expired:75},
    { "dateRange" : "2019-12-12" ,total: 1000, delivered : 300, undeliverable:250, enroute:300,expired:150},
    { "dateRange" : "2019-12-13" ,total: 3000, delivered : 2000, undeliverable:100, enroute:900,expired:0},
    { "dateRange" : "2019-12-14" ,total: 5500, delivered : 3500, undeliverable:500, enroute:500,expired:1000},
    { "dateRange" : "2019-12-15" ,total: 5000, delivered : 2000, undeliverable:1000, enroute:1500,expired:500},
    { "dateRange" : "2019-12-16" ,total: 2000, delivered : 1000, undeliverable:150, enroute:50,expired:800},
    { "dateRange" : "2019-12-17" ,total: 450, delivered : 150, undeliverable:150, enroute:100,expired:50}];

this.drawSvg(hist);

}

 drawSvg( data: HistogramDistribution[] ): void {


 const margin = {top: 60, right: 10, bottom: 60, left: 60};
 const width = 960 - margin.right - margin.left;
 const height = 600 - margin.top - margin.bottom;



 const svg = d3.select("body").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);
  
              const g = svg.append("g");
              g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
              
              // set x scale
              const x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1).paddingOuter(0.5).align(0.1);
              
              // set y scale
              const y = d3.scaleLinear().rangeRound([height, 0]);
              
              // set the colors
              const z = d3.scaleOrdinal().range([ "msgdelivered" ,  "msgundelivered","msgenroute","msgexpired" ]);
              const keys = [ "delivered", "undeliverable", "enroute", "expired" ];
              
              x.domain(data.map(function(d) { return d.dateRange; }));
              y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
              z.domain(keys);
              
              
              // Define the div for the tooltip
              let div = d3.select("body").append("div")	
                  .attr("class", "tooltip")				
                  .style("opacity", 0);
              
              
              g.append("g")
              .selectAll("g")
              .data(d3.stack().keys(keys)(data))
              .enter().append("g")
              .attr("class", function(d) { 
                return z(d.key);
               })
              .selectAll("rect")
                  .data(function(d) { return d; })
                  .enter().append("rect")
                  .attr("x", function(d) { 
                    return x(d.data.dateRange); }
                    )
                  .attr("y", function(d) { 
                    return y(d[1]); }
                    )
                  .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                  .attr("width", x.bandwidth())
                  .attr('y', (d: any) => {
                    return y(d[1])
                  })
                  .on("mouseover", function(d) {	
                    const hist:HistogramDistribution = this.__data__.data
                    const xPosition = d3.mouse(this)[0] -5;
                    const yPosition = (d3.mouse(this)[1] - 5 );
              
                    div.transition()		
                        .duration(10)		
                        .style("opacity", .9);		
                        div.html( "<span>"+ "Date : "  + hist.dateRange +"</span><br>" +
                        "<span>"+ "Delivered : "  + hist.delivered +"</span><br>" + 
                        "<span>"+ "Undeliverable : "  + hist.undeliverable +"</span><br>" + 
                        "<span>"+ "Expired : "  + hist.expired +"</span><br>" + 
                        "<span>"+ "Enroute : "  + hist.enroute +"</span><br>" + 
                        "<span>"+ "Total : "  + hist.total +"</span>"
                        )	
                        .style("left", (d3.event.pageX) - 45 + "px")		
                        .style("top", (d3.event.pageY - 100) + "px");	
                    }
                  )
                  .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                  })
                  .on("mousemove", function(d) {
                    
                   const hist:HistogramDistribution = this.__data__.data
                   const xPosition = d3.mouse(this)[0] - 5;
                   const yPosition = ( d3.mouse(this)[1] - 5 );
              
                   div.transition()		
                        .duration(10)		
                        .style("opacity", .9);		
                        div.html( "<span>"+ "Date : "  + hist.dateRange +"</span><br>" +
                        "<span>"+ "Delivered : "  + hist.delivered +"</span><br>" + 
                        "<span>"+ "Undeliverable : "  + hist.undeliverable +"</span><br>" + 
                        "<span>"+ "Expired : "  + hist.expired +"</span><br>" + 
                        "<span>"+ "Enroute : "  + hist.enroute +"</span><br>" + 
                        "<span>"+ "Total : "  + hist.total +"</span>"
                        )	
                        .style("left", (d3.event.pageX) - 45 + "px")		
                        .style("top", (d3.event.pageY - 100) + "px");	
                    }
              
                  );
              
            
                 // d3.timeDay.every(4)
            
              g.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + height + ")")
                  .transition()
                  .duration(1000)
                  .call(d3.axisBottom(x).ticks(5))
                  .selectAll("text")	
                    .style("text-anchor", "middle")
                    .attr("dx", "3em")
                    .attr("dy", "1em")
                    .attr("transform", "rotate(30)");
                  
              
              g.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).ticks())
                .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start");
              
              const legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice())
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
              
              legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("class", function(d) { 
                  return z(d);
                });
              
              legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) { 
                 return d.charAt(0).toUpperCase() + d.slice(1) ; });
              
                // text label for the x axis
                // svg.append("text")             
                //     .attr("transform",
                //           "translate(" + (width/2) + " ," + 
                //                          (height + margin.top + 20) + ")")
                //     .style("text-anchor", "middle")
                //     .text("Date");
              
                  // text label for the y axis
                  g.append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 0 - margin.left)
                      .attr("x",0 - (height / 2))
                      .attr("dy", "1em")
                      .style("text-anchor", "middle")
                      .text("Count");


}

}
