import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    return (
        <div className='w-full text-center p-5'>
            <h1>Register Page</h1>
            <button
                className='bg-blue-400 p-6'>
                Register
            </button>
        </div>
    );
};

export default Register;
