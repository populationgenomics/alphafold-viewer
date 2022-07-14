import React from "react";
import { scaleBand, scaleLinear } from "d3";
import { TooltipAnchor } from "@gnomad/ui";

const colours = {
    Exons: "#00FF00",
    "Domains and annotations": "#964B00",
    "gnomAD missense": "#0000FF",
    "gnomAD LoF": "#FF0000",
    "ClinVar variants": "#FFA500",
};

function Track({ data, onClickFunction, selected }) {
    const yDomains = [
        "Exons",
        "gnomAD missense",
        "gnomAD LoF",
        "ClinVar variants",
        "Domains and annotations",
    ];

    const id = "track";
    const height = 300;
    const width = 1400;
    const margin = { left: 200, right: 40, top: 20, bottom: 60 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const yScale = scaleBand()
        .range([0, innerHeight])
        .domain(yDomains)
        .padding(0.05);

    const xScale = scaleLinear().range([0, innerWidth]).domain([0, 1863]);

    const renderTooltip = ({ d }) => {
        return <div>Position: {d}</div>;
    };

    return (
        <svg width={width} height={height}>
            {/* Main plot */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* x-axis */}
                <g id={`${id}-x-axis`}>
                    <line x2={`${innerWidth}`} stroke="black" />
                    <line
                        y1={`${innerHeight}`}
                        y2={`${innerHeight}`}
                        x2={`${innerWidth}`}
                        stroke="black"
                    />
                    {xScale.ticks().map((tick) => (
                        <g
                            key={tick}
                            transform={`translate(${xScale(
                                tick
                            )}, ${innerHeight})`}
                        >
                            <text
                                y={8}
                                transform="translate(0, 10)rotate(-45)"
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fontSize={14}
                                cursor="help"
                            >
                                {tick}
                            </text>
                            <line y2={6} stroke="black" />
                            <line y2={`-${innerHeight}`} stroke="lightgrey" />
                        </g>
                    ))}
                </g>

                {/* y-axis */}
                <g id={`${id}-y-axis`}>
                    <line y2={`${innerHeight}`} stroke="black" />
                    <line
                        x1={`${innerWidth}`}
                        y2={`${innerHeight}`}
                        x2={`${innerWidth}`}
                        stroke="black"
                    />
                    {yScale.domain().map((tick, index) => (
                        <g
                            key={tick}
                            transform={`translate(0, ${
                                yScale(tick) + yScale.bandwidth() / 2
                            })`}
                        >
                            <text
                                key={tick}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fontSize={14}
                                x={-8}
                                y={3}
                                onClick={
                                    tick !== "Domains and annotations" &&
                                    tick !== "Exons"
                                        ? () =>
                                              onClickFunction(
                                                  data
                                                      .filter(
                                                          (item) =>
                                                              item.type === tick
                                                      )
                                                      .map((item) => item.data),
                                                  colours[tick],
                                                  `${tick}`
                                              )
                                        : null
                                }
                                cursor={
                                    tick !== "Domains and annotations" &&
                                    tick !== "Exons"
                                        ? "pointer"
                                        : "default"
                                }
                                fontWeight={
                                    selected.includes(tick) ? "bold" : "normal"
                                }
                            >
                                {tick}
                            </text>
                            <line x2={-3} stroke="black" />
                        </g>
                    ))}
                </g>

                {/* Dots */}
                <g id={`${id}-data`}>
                    {data.map((item, index) => {
                        if (
                            item.type === "Exons" ||
                            item.type === "Domains and annotations"
                        ) {
                            return (
                                <TooltipAnchor
                                    key={`${item.type}-${index}-tooltip`}
                                    tooltipComponent={renderTooltip}
                                    d={`${item.data[0]}-${item.data[1]}`}
                                >
                                    <rect
                                        x={xScale(item.data[0])}
                                        y={
                                            yScale(item.type) +
                                            yScale.bandwidth() / 2 -
                                            10
                                        }
                                        height={20}
                                        width={xScale(
                                            item.data[1] - item.data[0]
                                        )}
                                        fill={
                                            item.type === "Exons"
                                                ? "green"
                                                : "brown"
                                        }
                                        stroke={
                                            selected.includes(
                                                `${item.type}-${index}`
                                            ) || selected.includes(item.type)
                                                ? "black"
                                                : null
                                        }
                                        strokeWidth={2.5}
                                        onClick={() =>
                                            onClickFunction(
                                                Array.from(
                                                    new Array(
                                                        item.data[1] -
                                                            item.data[0]
                                                    ),
                                                    (x, i) => i + item.data[0]
                                                ),
                                                item.type === "Exons"
                                                    ? "#00FF00"
                                                    : "#964B00",
                                                `${item.type}-${index}`
                                            )
                                        }
                                        cursor="pointer"
                                    />
                                </TooltipAnchor>
                            );
                        } else {
                            if (item.type === "gnomAD missense") {
                                return item.data.map((value, index) => (
                                    <TooltipAnchor
                                        key={`${item.type}-${index}-tooltip`}
                                        tooltipComponent={renderTooltip}
                                        d={value}
                                    >
                                        <circle
                                            cx={xScale(value)}
                                            cy={
                                                yScale(item.type) +
                                                yScale.bandwidth() / 2
                                            }
                                            r={5}
                                            stroke={
                                                selected.includes(
                                                    `${item.type}-${index}`
                                                ) ||
                                                selected.includes(item.type)
                                                    ? "black"
                                                    : null
                                            }
                                            strokeWidth={2.5}
                                            fill="blue"
                                            onClick={() =>
                                                onClickFunction(
                                                    [value],
                                                    "#0000FF",
                                                    `${item.type}-${index}`
                                                )
                                            }
                                            cursor="pointer"
                                        />
                                    </TooltipAnchor>
                                ));
                            } else if (item.type === "gnomAD LoF") {
                                return item.data.map((value, index) => (
                                    <TooltipAnchor
                                        key={`${item.type}-${index}-tooltip`}
                                        tooltipComponent={renderTooltip}
                                        d={value}
                                    >
                                        <rect
                                            x={xScale(value)}
                                            y={
                                                yScale(item.type) +
                                                yScale.bandwidth() / 2 -
                                                5
                                            }
                                            width={10}
                                            height={10}
                                            stroke={
                                                selected.includes(
                                                    `${item.type}-${index}`
                                                ) ||
                                                selected.includes(item.type)
                                                    ? "black"
                                                    : null
                                            }
                                            strokeWidth={2.5}
                                            fill="red"
                                            onClick={() =>
                                                onClickFunction(
                                                    [value],
                                                    "#FF0000",
                                                    `${item.type}-${index}`
                                                )
                                            }
                                            cursor="pointer"
                                        />
                                    </TooltipAnchor>
                                ));
                            } else {
                                return item.data.map((value, index) => {
                                    const middle = xScale(value);
                                    const vertPos =
                                        yScale(item.type) +
                                        yScale.bandwidth() / 2;
                                    return (
                                        <TooltipAnchor
                                            key={`${item.type}-${index}-tooltip`}
                                            tooltipComponent={renderTooltip}
                                            d={value}
                                        >
                                            <polygon
                                                points={`${middle} ${
                                                    vertPos + 10
                                                }, ${middle + 10} ${
                                                    vertPos - 10
                                                }, ${middle - 10} ${
                                                    vertPos - 10
                                                }`}
                                                stroke={
                                                    selected.includes(
                                                        `${item.type}-${index}`
                                                    ) ||
                                                    selected.includes(item.type)
                                                        ? "black"
                                                        : null
                                                }
                                                strokeWidth={2.5}
                                                fill="orange"
                                                onClick={() =>
                                                    onClickFunction(
                                                        [value],
                                                        "#FFA500",
                                                        `${item.type}-${index}`
                                                    )
                                                }
                                                cursor="pointer"
                                            />
                                        </TooltipAnchor>
                                    );
                                });
                            }
                        }
                    })}
                </g>
            </g>
        </svg>
    );
}

export default Track;
