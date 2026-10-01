export function chartColors(isDark = false) {
    if (isDark) {
        return {
            cardBg: "#172033",
            cardShadow: "0 2px 8px rgb(0 0 0 / 0.35)",
            title: "#e8eef7",
            text: "#e8eef7",
            subtleText: "#8d9bb0",
            legend: "#94a3b8",
            axisLabel: "#94a3b8",
            axisName: "#cbd5e1",
            axisLine: "#334155",
            splitLine: "#1e293b",
            surface: "#131c2e",
            surfaceBorder: "#26344c",
            skeleton: "#26344c",
            skeletonAlt: "#1c2740",
            tooltipBg: "#1e2942",
            tooltipText: "#e8eef7",
        };
    }

    return {
        cardBg: "#fff",
        cardShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
        title: "#111827",
        text: "#111827",
        subtleText: "#6b7280",
        legend: "#374151",
        axisLabel: "#374151",
        axisName: "#1f2937",
        axisLine: "#e5e7eb",
        splitLine: "#f3f4f6",
        surface: "#f9fafb",
        surfaceBorder: "#f3f4f6",
        skeleton: "#e5e7eb",
        skeletonAlt: "#f3f4f6",
        tooltipBg: "#fff",
        tooltipText: "#333",
    };
}
