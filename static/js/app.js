/* initialize a default page with one subject ID */

function init() {

  // select selDataset from index.html
  var selector = d3.select("#selDataset");

  // insert all subject IDs as options to select
  d3.json("samples.json").then((d) => {

    // grab all subject IDs
    var subjectIDs = d.names;

    // append all subject IDs as options
    subjectIDs.forEach((subjectID) => {
      selector.append("option").text(subjectID).property("value", subjectID);

    });

    // create chart and metadata panel with default subject ID
    buildCharts(subjectIDs[0]);
    buildPanel(subjectIDs[0]);

  });
}

/* create a function to build the bar and bubble charts */

function buildCharts(subjectID) {
  d3.json("samples.json").then((data) => {

    // grab the data we need
    var samples = data.samples;
    // filter based on current selection
    var filterID = samples.filter(object => object.id == subjectID);
    var metadataID = filterID[0];

    console.log(filterID)
    console.log(metadataID)

    var otu_ids = metadataID.otu_ids;
    var sample_values = metadataID.sample_values;
    var otu_labels = metadataID.otu_labels;

    // create a horizontal bar chart to display the top 10 OTUs found in that individual

    // top 10 values
    var yAxis_slice = otu_ids.slice(0,10).reverse()
    var yAxis = yAxis_slice.map(otu_id => `OTU ${otu_id}`);  // label with "OTU"
    
    console.log(yAxis_slice)
    console.log(yAxis)

    // sample values of top 10
    var xAxis = sample_values.slice(0,10).reverse()

    console.log(xAxis)

    // labels of top 10
    var barText = otu_labels.slice(0,10).reverse()

    console.log(barText)

    // create trace
    var trace1 =
      {y: yAxis,
      x: xAxis,
      text: barText,
      type: "bar",
      orientation: "h"
    };

    var dataToPlot = [trace1];

    // create bar layout
    var layout = {
      title: "Top 10 OTUs",
      yaxis: {title: "OTU ID"},
      width: 600,
      height: 700,
      margin: {l: 100, r: 100, b: 50, t: 50}
    };

    // create new plot, with bar id from index.html
    Plotly.newPlot("bar", dataToPlot, layout);

    // create a bubble chart that displays each sample

    // create trace
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };
    
    var dataToPlot2 = [trace2];
    
    // create bubble layout
    var layout2 = {
      xaxis: {title: "OTU ID"},
      showlegend: false,
      height: 600,
      width: 1000,
      hovermode: "closest"
    };

    // create new plot, with bubble id from index.html
    Plotly.newPlot('bubble', dataToPlot2, layout2);
    
  });

}

// get metadata and populate panel with key value pairs
function buildPanel(subjectID) {

  d3.json("samples.json").then((d) => {

    // grab the metadata for the sample
    var metadata = d.metadata;

    // filter based on current selection
    var filterID = metadata.filter(object => object.id == subjectID);
    var metadataID = filterID[0];

    console.log(filterID)
    console.log(metadataID)

    // select the panel body and clear the contents
    var panelBody = d3.select("#sample-metadata");
    panelBody.html("");

    // display metadata key-value pairs
    Object.entries(metadataID).forEach(([key, value]) => {
      panelBody
      .append("h6")   // want text to be relatively small
      .text(`${key}: ${value}`);   // want text to display key : value

    });

  });

}

/* Update all of the plots any time that a new sample is selected */

// the optionChanged function will update the subject ID when selected in the dropdown
function optionChanged(newSub) {

  buildCharts(newSub); // update charts
  buildPanel(newSub); // update panel

}

init();