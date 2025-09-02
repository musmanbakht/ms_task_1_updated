import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PublicationsWordChart = ({
  data = [
    { text: "Machine Learning", value: 15 },
    { text: "Deep Learning", value: 12 },
    { text: "Neural Networks", value: 10 },
    { text: "Computer Vision", value: 8 },
    { text: "Natural Language", value: 7 },
    { text: "Artificial Intelligence", value: 6 },
    { text: "Data Mining", value: 5 },
    { text: "Pattern Recognition", value: 4 },
    { text: "Algorithm", value: 6 },
    { text: "Classification", value: 4 },
    { text: "Optimization", value: 3 },
    { text: "Feature", value: 5 },
  ],
}) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(containerRef.current).selectAll(".tooltip").remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 350;

    // Create tooltip
    const tooltip = d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
      .style("z-index", "1000")
      .style("opacity", 0);

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Sort data by value and create font scale
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const maxValue = d3.max(sortedData, (d) => d.value);
    const minValue = d3.min(sortedData, (d) => d.value);

    // Font size scale
    const fontScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range([12, 48]);

    // Color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(sortedData.map((d) => d.text))
      .range([
        "#3b82f6",
        "#ef4444",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
        "#06b6d4",
        "#f97316",
        "#84cc16",
        "#ec4899",
        "#6366f1",
      ]);

    // Enhanced positioning algorithm with better collision detection
    function positionWords(words) {
      const positions = [];
      const padding = 30;
      const usableWidth = width - padding * 2;
      const usableHeight = height - padding * 2;

      // Helper function to get more accurate text dimensions
      function getTextDimensions(text, fontSize) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = `bold ${fontSize}px Arial Black, sans-serif`;
        const metrics = context.measureText(text);
        return {
          width: metrics.width + 10, // Add some padding
          height: fontSize + 5, // Add some padding
        };
      }

      // Helper function to check if two rectangles overlap
      function rectanglesOverlap(rect1, rect2) {
        return !(
          rect1.right < rect2.left ||
          rect2.right < rect1.left ||
          rect1.bottom < rect2.top ||
          rect2.bottom < rect1.top
        );
      }

      words.forEach((word, i) => {
        const fontSize = fontScale(word.value);
        const dimensions = getTextDimensions(word.text, fontSize);
        const wordWidth = dimensions.width;
        const wordHeight = dimensions.height;

        let placed = false;
        let attempts = 0;
        const maxAttempts = 200;

        while (!placed && attempts < maxAttempts) {
          let x, y;

          if (i === 0) {
            // Place first (largest) word in center
            x = width / 2;
            y = height / 2;
          } else {
            // Progressive placement strategy - start with good spots, expand search area
            const searchRadius = Math.min(
              20 + attempts * 5, // Start small, grow with attempts
              Math.min(usableWidth, usableHeight) / 2
            );

            if (attempts < 50) {
              // Try placement near existing words first (natural clustering)
              if (positions.length > 0) {
                const existingWord =
                  positions[Math.floor(Math.random() * positions.length)];
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * searchRadius + 60;
                x = existingWord.x + Math.cos(angle) * distance;
                y = existingWord.y + Math.sin(angle) * distance;
              } else {
                x = width / 2 + (Math.random() - 0.5) * searchRadius;
                y = height / 2 + (Math.random() - 0.5) * searchRadius;
              }
            } else if (attempts < 100) {
              // Try systematic grid with jitter
              const cols = Math.ceil(Math.sqrt(words.length * 2));
              const cellWidth = usableWidth / cols;
              const cellHeight =
                usableHeight / Math.ceil((words.length * 2) / cols);
              const gridIndex = attempts - 50;
              const col = gridIndex % cols;
              const row = Math.floor(gridIndex / cols);

              x =
                padding +
                col * cellWidth +
                cellWidth / 2 +
                (Math.random() - 0.5) * cellWidth * 0.3;
              y =
                padding +
                row * cellHeight +
                cellHeight / 2 +
                (Math.random() - 0.5) * cellHeight * 0.3;
            } else {
              // Final phase: random placement anywhere
              x =
                padding +
                wordWidth / 2 +
                Math.random() * (usableWidth - wordWidth);
              y =
                padding +
                wordHeight / 2 +
                Math.random() * (usableHeight - wordHeight);
            }
          }

          // Ensure word stays within bounds
          x = Math.max(
            padding + wordWidth / 2,
            Math.min(width - padding - wordWidth / 2, x)
          );
          y = Math.max(
            padding + wordHeight / 2,
            Math.min(height - padding - wordHeight / 2, y)
          );

          // Create bounding rectangle for current word
          const currentRect = {
            left: x - wordWidth / 2,
            right: x + wordWidth / 2,
            top: y - wordHeight / 2,
            bottom: y + wordHeight / 2,
          };

          // Check collision with all existing words
          let collision = false;
          for (const pos of positions) {
            const existingRect = {
              left: pos.x - pos.wordWidth / 2,
              right: pos.x + pos.wordWidth / 2,
              top: pos.y - pos.wordHeight / 2,
              bottom: pos.y + pos.wordHeight / 2,
            };

            if (rectanglesOverlap(currentRect, existingRect)) {
              collision = true;
              break;
            }
          }

          if (!collision) {
            positions.push({
              ...word,
              x,
              y,
              fontSize,
              wordWidth,
              wordHeight,
            });
            placed = true;
          }

          attempts++;
        }

        // Emergency placement if all attempts failed
        if (!placed) {
          console.warn(
            `Could not place word "${word.text}" without overlap after ${maxAttempts} attempts`
          );
          // Place it anyway, but try to minimize overlap
          let bestX = width / 2;
          let bestY = height / 2;
          let minOverlap = Infinity;

          // Try a few random positions and pick the one with least overlap
          for (let emergency = 0; emergency < 20; emergency++) {
            const testX =
              padding +
              wordWidth / 2 +
              Math.random() * (usableWidth - wordWidth);
            const testY =
              padding +
              wordHeight / 2 +
              Math.random() * (usableHeight - wordHeight);

            let totalOverlap = 0;
            const testRect = {
              left: testX - wordWidth / 2,
              right: testX + wordWidth / 2,
              top: testY - wordHeight / 2,
              bottom: testY + wordHeight / 2,
            };

            for (const pos of positions) {
              const existingRect = {
                left: pos.x - pos.wordWidth / 2,
                right: pos.x + pos.wordWidth / 2,
                top: pos.y - pos.wordHeight / 2,
                bottom: pos.y + pos.wordHeight / 2,
              };

              if (rectanglesOverlap(testRect, existingRect)) {
                const overlapWidth =
                  Math.min(testRect.right, existingRect.right) -
                  Math.max(testRect.left, existingRect.left);
                const overlapHeight =
                  Math.min(testRect.bottom, existingRect.bottom) -
                  Math.max(testRect.top, existingRect.top);
                totalOverlap += overlapWidth * overlapHeight;
              }
            }

            if (totalOverlap < minOverlap) {
              minOverlap = totalOverlap;
              bestX = testX;
              bestY = testY;
            }
          }

          positions.push({
            ...word,
            x: bestX,
            y: bestY,
            fontSize,
            wordWidth,
            wordHeight,
          });
        }
      });

      return positions;
    }

    const positionedWords = positionWords(sortedData);

    // Draw words
    svg
      .selectAll("text")
      .data(positionedWords)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .style("font-size", (d) => `${d.fontSize}px`)
      .style("font-family", "Arial Black, sans-serif")
      .style("font-weight", "bold")
      .style("fill", (d) => colorScale(d.text))
      .style("cursor", "pointer")
      .style("transition", "all 0.2s ease")
      .text((d) => d.text)
      .on("mouseenter", function () {
        // Light hover effect
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseleave", function () {
        // Hide tooltip and reset all highlights
        tooltip.style("opacity", 0);

        // Reset all words to original font sizes
        svg
          .selectAll("text")
          .style("opacity", 1)
          .style("font-size", (d) => `${d.fontSize}px`);
      })
      .on("click", function (event, d) {
        event.stopPropagation();

        // Reset all other words to original sizes
        svg
          .selectAll("text")
          .style("opacity", 1)
          .style("font-size", (d) => `${d.fontSize}px`);

        // Highlight clicked word by increasing font size
        const currentFontSize = d3.select(this).style("font-size");
        const newFontSize = parseFloat(currentFontSize) * 1.1;
        d3.select(this)
          .style("opacity", 0.8)
          .style("font-size", `${newFontSize}px`);

        // Position and show tooltip
        const containerRect = container.getBoundingClientRect();
        const x = event.clientX - containerRect.left + 15;
        const y = event.clientY - containerRect.top - 10;

        tooltip
          .style("left", x + "px")
          .style("top", y + "px")
          .style("opacity", 1).html(`
            <div>
              <strong>${d.text}</strong><br/>
              Frequency: ${d.value}
            </div>
          `);
      });

    // Add entrance animation
    svg
      .selectAll("text")
      .style("opacity", 0)
      .transition()
      .delay((d, i) => i * 50)
      .duration(500)
      .style("opacity", 1);
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col min-w-0 break-words w-full mb-3 shadow-lg rounded bg-white"
    >
      <div className="rounded-t mb-0 px-2 py-5 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-gray-500 mb-1 text-xs font-semibold">
              Overview
            </h6>
            <h2 className="text-gray-800 text-xl font-semibold">
              Common Words In Publications
            </h2>
          </div>
        </div>
      </div>
      <div className="p-2 relative">
        <svg ref={svgRef} style={{ width: "100%", height: 350 }} />
      </div>
    </div>
  );
};

export default PublicationsWordChart;
