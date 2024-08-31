import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MathJax from 'react-mathjax2';

const AutoGraderPage = () => {
    const [selectedFile, setSelectedFile] = useState(null); // Store the uploaded file
    const [gradingResult, setGradingResult] = useState(null); // Store the result from the API
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Store the uploaded image file
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        setIsLoading(true); // Set loading to true when submitting

        // Prepare the form data to send the file
        const formData = new FormData();
        formData.append('file', selectedFile); // Add the file to the form data

        try {
            // Call the API with the image file
            const response = await fetch('http://0.0.0.0:80/autograder', {
                method: 'POST',
                body: formData, // Send the form data (file)
            });

            const result = await response.json();
            setGradingResult(result); // Set the result when the API returns the data

            // Show a toast notification when grading is completed
            toast.success("Grading completed successfully!");
        } catch (error) {
            console.error('Error during API call:', error);
            toast.error("Grading failed. Please try again.");
        } finally {
            setIsLoading(false); // Stop loading after API call finishes
        }
    };

    // Split the response into individual questions
    const formatResponse = (response) => {
        const questions = response.split('\n\n').filter(Boolean);
        return questions.map((question, index) => (
            <MathJax.Context key={index}>
                <div>
                    <MathJax.Text text={question.trim()} />
                </div>
            </MathJax.Context>
        ));
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">AutoGrader</h2>

            {/* File Upload Section */}
            <div className="mb-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
            </div>

            {/* Display Image Preview */}
            {selectedFile && (
                <div className="mb-4">
                    <img
                        src={URL.createObjectURL(selectedFile)} // Use object URL to preview the image
                        alt="Preview"
                        className="w-64 h-64 object-cover border rounded-lg"
                    />
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`bg-indigo-600 text-white px-4 py-2 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Grading...' : 'Submit for Grading'}
            </button>

            {/* Toastify Notification Container */}
            <ToastContainer />

            {/* Display Grading Result */}
            {gradingResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">Grading Results:</h3>

                    <MathJax.Context>
                        <div className="grading-results">
                            {formatResponse(gradingResult.response)} {/* Render LaTeX formatted response */}
                        </div>
                    </MathJax.Context>
                </div>
            )}
        </div>
    );
};

export default AutoGraderPage;