import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

const App = () => {
  const [experimentList, setExperimentList] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBoundingBox, setShowBoundingBox] = useState(false);

  useEffect(() => {
    // Fetch experiment list on load
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    // Replace with actual API call
    const experiments = await fetch("/api/experiments").then((res) => res.json());
    setExperimentList(experiments);
  };

  const fetchChartData = async (experimentId) => {
    // Replace with actual API call
    const data = await fetch(`/api/chart-data/${experimentId}`).then((res) =>
      res.json()
    );
    setChartData(data);
  };

  const fetchImages = async (folderPath) => {
    // Replace with actual API call
    const imageList = await fetch(`/api/images?path=${folderPath}`).then((res) =>
      res.json()
    );
    setImages(imageList);
  };

  const handleExperimentChange = (event) => {
    const selected = event.target.value;
    setSelectedExperiment(selected);
    fetchChartData(selected);
  };

  const drawChart = () => {
    const svg = d3.select("#chart").attr("width", 600).attr("height", 400);
    svg.selectAll("*").remove(); // Clear previous chart

    const xScale = d3.scaleTime().domain(d3.extent(chartData, (d) => d.time)).range([0, 600]);
    const yScale = d3.scaleLinear().domain([0, d3.max(chartData, (d) => d.value)]).range([400, 0]);

    const line = d3
      .line()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value));

    svg.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", line);

    svg.append("g").call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")));
    svg.append("g").call(d3.axisLeft(yScale));
  };

  useEffect(() => {
    if (chartData.length) drawChart();
  }, [chartData]);

  return (
    <div className="app">
      <header>
        <h1>Machine Learning Dashboard</h1>
      </header>
      <main>
        <div className="controls">
          <label>
            Select Experiment:
            <select onChange={handleExperimentChange}>
              {experimentList.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={showBoundingBox}
              onChange={(e) => setShowBoundingBox(e.target.checked)}
            />
            Show Bounding Box
          </label>
        </div>
        <div className="chart-container">
          <svg id="chart"></svg>
        </div>
        <div className="image-viewer">
          {images.length > 0 && (
            <img
              src={images[currentImageIndex]}
              alt={`Frame ${currentImageIndex}`}
              style={{ border: showBoundingBox ? "2px solid red" : "none" }}
            />
          )}
          <button
            onClick={() =>
              setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
            }
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                Math.min(prev + 1, images.length - 1)
              )
            }
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
