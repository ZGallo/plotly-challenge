// Display the default plot
function init(){
  
  // Read samples.json 
  d3.json("data/samples.json").then((jsonObject) =>{
    // console.log(jsonObject);  
        
    // add all of the IDs to the drop down menu
    d3.select("#selDataset").selectAll("option")
      .data(jsonObject.samples)
      .enter()
      .append('option')
      .html(samples => samples.id);
    
    plotlyPlot("940", "Barplot");  

    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePlotly);
    d3.selectAll("#selPlot").on("change", updatePlotly)
  });  
};

init();

function plotlyPlot(id, plotValue){
  
  d3.json("data/samples.json").then((jsonObject) =>{
   
    ////////////////////       DEMOGRAPHIC INFO     \\\\\\\\\\\\\\\\\\\\\\\\
    
    var metadata = jsonObject.metadata.filter(data => data.id.toString() === id)
    // console.log(metadata)

    // Reseting the table
    d3.select("#sample-metadata").html("");

    //iterating through the desired metadata dictionary
    Object.entries(metadata[0]).forEach(([key,value])=> {
      // console.log([key,value]);
      d3.select("#sample-metadata")
      .append('div')
      .text(`${key}: ${value}`)
    })
    

    ////////////////////       CHARTING VARIABLES     \\\\\\\\\\\\\\\\\\\\\\\\\
    
    var filteredData = jsonObject.samples.filter(data => data.id.toString() === id);
    // console.log(filteredData)
    // console.log(jsonObject) 
    
    var sample_values = filteredData[0].sample_values  
    // console.log(sample_values);

    var otu_ids = filteredData[0].otu_ids
    var otu_labels = filteredData[0].otu_labels
    
    // zipping sample values and OTU ids so that I can know which ID belongs to which value when sorting
    // index 0 = sample_values ; index 1 = OTU_id
    var zip = sample_values.map((sv, i) =>{
      return [sv, otu_ids[i], otu_labels[i]]
    });
    
    // console.log(zip);

    //sorting by sample values
    var clean_data = zip.sort((a, b) => b[0] - a[0]).slice(0,10).reverse();
    // console.log(clean_data);
    
    sampleValues = clean_data.map(object => object[0]);
    // console.log(x_axis);

    outIDs = clean_data.map(object => `OTU ${object[1]}`);
    // console.log(y_axis)

    hover_text = clean_data.map(object => object[2]);
  
    /////////////////////       BAR & PIE CHART     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    if (plotValue === 'Barplot'){
     // Trace1 for bar charts
     var trace1 = {
        x: sampleValues,
        y: outIDs,
        text: hover_text,
        type: "bar",
        orientation: "h"
      };
    }
    else {
      var trace1 = {
        values: sampleValues,
        labels: outIDs,
        hovertext: hover_text,
        type: "pie",
      };
    }
   
    // data
    var data = [trace1];
   
   // Apply the group bar mode to the layout
    var layout = {
      title: `Top 10 OTU IDs for ID ${id}`
    };

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("plot", data, layout);

    
    /////////////////////       BUBBLE CHART     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    // Create the Trace for bubble chart
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
          size: sample_values,
          color: otu_ids,
      },
      text: otu_labels
    };

    var data2 = [trace2];

    var layout2 = {
        title: `OTU ID ${id}`
    };

    // Plot the chart to a div tag with id "bubble"
    Plotly.newPlot("bubble", data2, layout2);

    /////////////////////       GAUGE CHART     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\


  });
};


// This function is called when a dropdown menu item is selected
function updatePlotly() {
  
  // Read samples.json 
  d3.json("data/samples.json").then((jsonObject) =>{
  
    // Use D3 to select the dropdown menu for IDs
    var datasetID = d3.select("#selDataset").property("value");
        
    // Assign the value of the dropdown menu option (id) to a variable
    var plotValue = d3.select("#selPlot").property("value")
    console.log(plotValue);

    plotlyPlot(datasetID, plotValue);
        
  });
};  
