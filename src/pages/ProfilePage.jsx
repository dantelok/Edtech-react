import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
    const [teacherName, setTeacherName] = useState('');
    const [teacherClass, setTeacherClass] = useState('');
    const [teacherSubject, setTeacherSubject] = useState('');

    useEffect(() => {
        // Fetch the teacher's information (this is mock data, replace with API or state management)
        const fetchProfileData = () => {
            // Replace this with your actual data-fetching logic
            const profileData = {
                name: 'John Doe',
                class: '5A, 5B',
                subject: 'Mathematics'
            };

            setTeacherName(profileData.name);
            setTeacherClass(profileData.class);
            setTeacherSubject(profileData.subject);
        };

        fetchProfileData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Teacher Profile</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-xl mb-2"><strong>Name:</strong> {teacherName}</p>
                <p className="text-xl mb-2"><strong>Class:</strong> {teacherClass}</p>
                <p className="text-xl mb-2"><strong>Subject:</strong> {teacherSubject}</p>
            </div>
        </div>
    );
};

export default ProfilePage;