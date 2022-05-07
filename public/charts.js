const ctx = document.getElementById('hourly');
const hourlyChart = new Chart(ctx, {
    // type: 'line',
    data: hourlydata,
    options: {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                align: 'end'
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
            hover: {
                mode: "nearest",
                intersect: true,
            },
        },
        bezierCurve: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'TIME'
                }
            },
            y: {
                beginAtZero: false,
                display: false
            },
        }
    }
});

const ctx2 = document.getElementById('daily');
const dailyChart = new Chart(ctx2, {
    // type: 'line',
    data: dailydata,
    options: {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                align: 'end'
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
            hover: {
                mode: "nearest",
                intersect: true,
            },
        },
        bezierCurve: true,
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'DATE'
                }
            },
            y: {
                display: false,
                beginAtZero: false
            },
        }
    }
})