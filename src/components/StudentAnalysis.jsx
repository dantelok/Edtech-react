import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(...registerables, ChartDataLabels, zoomPlugin);

const categories = ["Exam Results", "Attendance", "Good/Bad Marks"];
const subjects = ["Chinese", "English", "Mathematics", "LS", "Physics", "Chemistry"];

const StudentAnalysis = ({ students, columns, data }) => {
    const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
    const [selectedSubject, setSelectedSubject] = useState(""); // Track selected subject
    const [selectedStudent, setSelectedStudent] = useState(""); // Track selected student
    const [chartType, setChartType] = useState('line'); // Track selected chart type

    // Handle student selection for chart
    const handleStudentSelection = (e) => {
        setSelectedStudent(e.target.value);
    };

    // Handle category selection
    const handleCategorySelection = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubject(""); // Reset subject when changing category
    };

    // Handle subject selection
    const handleSubjectSelection = (e) => {
        setSelectedSubject(e.target.value);
    };

    // Prepare chart data based on the selected category and student
    const chartData = {
        labels: [],
        datasets: [],
    };

    if (selectedStudent) {
        const studentRow = data.find(row => row[0] === selectedStudent);
        if (studentRow) {
            if (selectedCategory === "Exam Results" && selectedSubject) {
                // Display exam results for selected subject
                const subjectColumns = columns.filter(col => col.startsWith(selectedSubject));
                chartData.labels = subjectColumns; // Use the test/exam types as labels
                chartData.datasets.push({
                    label: `${selectedStudent} - ${selectedSubject}`,
                    data: subjectColumns.map(col => studentRow[columns.indexOf(col)]),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                });
            } else if (selectedCategory === "Attendance") {
                // Display attendance
                const attendanceColumns = columns.filter(col => col.startsWith("Attendance"));
                chartData.labels = attendanceColumns; // Use months as labels
                chartData.datasets.push({
                    label: `${selectedStudent} - Attendance`,
                    data: attendanceColumns.map(col => studentRow[columns.indexOf(col)]),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                });
            } else if (selectedCategory === "Good/Bad Marks") {
                // Display good/bad marks with custom labels for semesters
                chartData.labels = ["Sem 1", "Sem 2"];
                const goodColumns = columns.filter(col => col.includes("Good Mark"));
                const badColumns = columns.filter(col => col.includes("Bad Mark"));

                if (chartType === 'bar') {
                    chartData.datasets.push({
                        label: `${selectedStudent} - Good Marks`,
                        data: goodColumns.map(col => studentRow[columns.indexOf(col)]),
                        backgroundColor: 'rgba(0, 200, 0, 0.2)',
                        borderColor: 'rgba(0, 200, 0, 1)',
                        borderWidth: 2,
                    });
                    chartData.datasets.push({
                        label: `${selectedStudent} - Bad Marks`,
                        data: badColumns.map(col => studentRow[columns.indexOf(col)]),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        borderColor: 'rgba(255, 0, 0, 1)',
                        borderWidth: 2,
                    });
                } else if (chartType === 'line') {
                    chartData.datasets.push({
                        label: `${selectedStudent} - Good Marks`,
                        data: goodColumns.map(col => studentRow[columns.indexOf(col)]),
                        backgroundColor: 'rgba(0, 200, 0, 0.2)',
                        borderColor: 'rgba(0, 200, 0, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(0, 200, 0, 1)',
                    });
                    chartData.datasets.push({
                        label: `${selectedStudent} - Bad Marks`,
                        data: badColumns.map(col => studentRow[columns.indexOf(col)]),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        borderColor: 'rgba(255, 0, 0, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(255, 0, 0, 1)',
                    });
                }
            }
        }
    }

    // Handle chart type change
    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const chartOptions = {
        plugins: {
            datalabels: {
                color: '#000', // Set data label color
                anchor: 'end',
                align: 'top',
                font: {
                    size: 10, // Set font size
                },
                formatter: (value) => `${value}`, // Format the data labels
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, // Enable zooming with mouse wheel
                    },
                    pinch: {
                        enabled: true, // Enable zooming with pinch gesture
                    },
                    mode: 'xy', // Enable zooming in both x and y directions
                },
                pan: {
                    enabled: true, // Enable panning
                    mode: 'xy',
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            {/* Student Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Student:</label>
                <select
                    value={selectedStudent || ""}
                    onChange={handleStudentSelection}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">-- Select Student --</option>
                    {students.map((student, index) => (
                        <option key={index} value={student}>
                            {student}
                        </option>
                    ))}
                </select>
            </div>

            {/* Category Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Category:</label>
                <select
                    value={selectedCategory}
                    onChange={handleCategorySelection}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">-- Select Category --</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Subject Selection (only if "Exam Results" is selected) */}
            {selectedCategory === "Exam Results" && (
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Select Subject:</label>
                    <select
                        value={selectedSubject || ""}
                        onChange={handleSubjectSelection}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="">-- Select Subject --</option>
                        {subjects.map((subject, index) => (
                            <option key={index} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Chart Type Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Chart Type:</label>
                <select
                    value={chartType}
                    onChange={handleChartTypeChange}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                </select>
            </div>

            {/* Chart Display */}
            <div className="chart-container mb-4">
                {selectedStudent && selectedCategory && chartData.datasets.length > 0 && (
                    chartType === 'line' ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <Bar data={chartData} options={chartOptions} />
                    )
                )}
            </div>
        </div>
    );
};

export default StudentAnalysis;