"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "@/components/providers/ThemeProvider";
import { chartColors } from "@/utils/chartColors";

export default function ReactBarChart({
    data = [],
    xKey = "month",
    yKey = "amount",
    title = "",
    color = "#8B1E2D",
    height = 320,
    className = "",
    formatter,
    xAxisName = "",
    yAxisName = "",
    backgroundColor = "transparent",
    borderRadius = 8,
    barWidth = 28,
    loading = false,
}) {
    const chartRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const cardColors = chartColors(isDark);

    useEffect(() => {
        const c = chartColors(theme === "dark");
        if (loading || !chartRef.current || !data?.length) return;

        const dom = chartRef.current;
        const chart = echarts.init(dom, null, { renderer: 'canvas', devicePixelRatio: window.devicePixelRatio || 2 });

        const labels = data.map((item) => item[xKey]);
        const values = data.map((item) => Number(item[yKey]) || 0);

        const option = {
            backgroundColor,
            animationDuration: 500,

            title: title
                ? {
                    text: title,
                    left: 0,
                    top: 0,
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 600,
                        color: c.title,
                        fontFamily: "Manrope, sans-serif",
                    },
                }
                : undefined,

            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                textStyle: {
                    color: "#fff",
                    fontFamily: "Manrope, sans-serif",
                },
                formatter:
                    formatter ||
                    ((params) => {
                        const value = params[0]?.value ?? 0;
                        return `${params[0]?.name}<br/>${value}`;
                    }),
            },

            grid: {
                left: 18,
                right: 18,
                top: title ? 40 : 18,
                bottom: 22,
                containLabel: true,
            },

            xAxis: {
                type: "category",
                data: labels,

                axisLabel: {
                    color: c.axisLabel,
                    fontSize: 12,
                    fontFamily: "Manrope, sans-serif",
                    rotate: 0,
                },

                axisLine: {
                    lineStyle: {
                        color: c.axisLine,
                    },
                },

                axisTick: {
                    show: false,
                },

                name: xAxisName,
                nameLocation: "middle",
                nameGap: 26,

                nameTextStyle: {
                    color: c.axisName,
                    fontSize: 13,
                    fontFamily: "Manrope, sans-serif",
                },
            },

            yAxis: {
                type: "value",

                axisLabel: {
                    color: c.axisLabel,
                    fontSize: 12,
                    fontFamily: "Manrope, sans-serif",
                },

                axisLine: {
                    lineStyle: {
                        color: c.axisLine,
                    },
                },

                splitLine: {
                    lineStyle: {
                        color: c.splitLine,
                    },
                },

                name: yAxisName,

                nameTextStyle: {
                    color: c.axisName,
                    fontSize: 13,
                    fontFamily: "Manrope, sans-serif",
                },
            },

            series: [
                {
                    name: yKey,
                    type: "bar",
                    data: values,
                    barWidth,

                    itemStyle: {
                        color,
                        borderRadius: [
                            borderRadius,
                            borderRadius,
                            0,
                            0,
                        ],
                    },

                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor:
                                "rgba(59, 130, 246, 0.35)",
                        },
                    },

                    label: {
                        show: false,
                    },
                },
            ],
        };

        chart.setOption(option);

        const resizeObserver = new ResizeObserver(() => {
            chart.resize();
        });

        resizeObserver.observe(chartRef.current);

        return () => {
            resizeObserver.disconnect();
            if (dom && dom.isConnected) {
                try {
                    chart.dispose();
                } catch {}
            }
        };
    }, [
        backgroundColor,
        barWidth,
        borderRadius,
        color,
        data,
        formatter,
        loading,
        theme,
        title,
        xAxisName,
        xKey,
        yAxisName,
        yKey,
    ]);

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{
                width: "100%",
                height,
                backgroundColor: cardColors.cardBg,
                borderRadius: 12,
                boxShadow:
                    cardColors.cardShadow,
                padding: 8,
            }}
        >
            {loading ? (
                <div className="absolute inset-0 animate-pulse p-5">
                    {/* Title skeleton */}
                    {title && (
                        <div className="mb-5 h-4 w-32 rounded bg-gray-200" />
                    )}

                    {/* Chart area */}
                    <div className="flex h-[calc(100%-45px)] items-end justify-between gap-3 px-4 pb-8">
                        <div className="h-[35%] w-7 rounded-t bg-gray-200" />
                        <div className="h-[55%] w-7 rounded-t bg-gray-200" />
                        <div className="h-[45%] w-7 rounded-t bg-gray-200" />
                        <div className="h-[70%] w-7 rounded-t bg-gray-200" />
                        <div className="h-[50%] w-7 rounded-t bg-gray-200" />
                        <div className="h-[80%] w-7 rounded-t bg-gray-200" />
                        <div className="h-[60%] w-7 rounded-t bg-gray-200" />
                        <div className="h-[40%] w-7 rounded-t bg-gray-200" />
                    </div>

                    {/* X-axis skeleton */}
                    <div className="absolute bottom-4 left-8 right-8 h-px bg-gray-200" />

                    {/* Y-axis skeleton */}
                    <div className="absolute bottom-8 left-5 top-14 w-px bg-gray-200" />
                </div>
            ) : (
                <div
                    ref={chartRef}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            )}
        </div>
    );
}