import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import StudentAnalysis from '../components/StudentAnalysis';

const StudentAnalysisPage = () => {
    const [data, setData] = useState([]); // Store the parsed Excel data
    const [students, setStudents] = useState([]); // Store student names (rows)
    const [columns, setColumns] = useState([]); // Store columns of data (e.g., Exam 1, Attendance, etc.)

    // Handle Excel file import and parsing
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0]; // Select the first sheet
            const sheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(sheet, { header: 1 });

            const headers = jsonData[0]; // First row will be the column headers
            const studentData = jsonData.slice(1); // The rest will be student rows

            // Set the columns and students
            setColumns(headers); // Store all columns
            setStudents(studentData.map(row => row[0])); // First column is the student name
            setData(studentData); // Store the full data
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Student Performance Analysis</h2>

            {/* File Upload Section */}
            <div className="mb-4">
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
            </div>

            {/* Pass the parsed data to the StudentAnalysis component */}
            {students.length > 0 && data.length > 0 && (
                <StudentAnalysis students={students} columns={columns} data={data} />
            )}
        </div>
    );
};

export default StudentAnalysisPage;