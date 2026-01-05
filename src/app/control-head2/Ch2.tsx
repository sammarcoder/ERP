'use client'; // Add this if using Next.js 13+

import { useState, useEffect } from 'react';

// Define interfaces for API responses and component state
interface ControlHead1 {
    id: number;
    zHead1: string;
    createdAt?: string;
    updatedAt?: string;
}

interface MessageState {
    type: 'success' | 'error' | '';
    text: string;
}

interface FormData {
    zHead2: string;
    zHead1Id: number;
}

export default function Ch2() {
    // State for Control Head 1 values
    const [controlHead1List, setControlHead1List] = useState<ControlHead1[]>([]);

    // Form state
    const [selectedHead1Id, setSelectedHead1Id] = useState<string>('');
    const [head2Value, setHead2Value] = useState<string>('');

    // UI state
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<MessageState>({ type: '', text: '' });


useEffect(() => {
    const fetchControlHead1 = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://${window.location.hostname}:4000/api/z-control-head1/`);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const data = await response.json();
            setControlHead1List(data);
            
            // Auto-select first item if exists
            if (data.length > 0) {
                setSelectedHead1Id(data[0].id.toString());
            }
        } catch (error) {
            // ... error handling
        } finally {
            setLoading(false);
        }
    };

    fetchControlHead1();
}, []);



    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Form validation
        if (!selectedHead1Id) {
            setMessage({ type: 'error', text: 'Please select a Control Head 1' });
            return;
        }

        if (!head2Value.trim()) {
            setMessage({ type: 'error', text: 'Please enter a value for Control Head 2' });
            return;
        }

        // Prepare payload
        const payload: FormData = {
            zHead2: head2Value,
            zHead1Id: parseInt(selectedHead1Id)
        };
        alert({fk:selectedHead1Id.valueOf(), text: head2Value})
        try {
            setSubmitting(true);
            const response = await fetch('http://localhost:4000/api/z-control-head2/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to create Control Head 2');
            }

            // Success
            setMessage({
                type: 'success',
                text: 'Control Head 2 created successfully!'
            });

            // Reset form
            setHead2Value('');
            setSelectedHead1Id('');

        } catch (error: any) {
            console.error('Error creating control head 2:', error);
            setMessage({
                type: 'error',
                text: error?.message || 'Failed to create Control Head 2'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Control Head Management</h1>

            {/* Display message if any */}
            {message.text && (
                <div className={`p-4 mb-4 border-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <p>Loading Control Head 1 data...</p>
            ) : (
                <div className="bg-white p-6 rounded h-screen shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Create Control Head 2</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Control Head 1 Dropdown */}
                        <div className="mb-4">
                            <label className="block border-2 text-sm font-medium text-gray-700 mb-1">
                                Select Control Head 1
                            </label>
                            <select
                                className="w-full  px-3 py-2 border overflow-scroll border-gray-300  rounded-md"
                                value={selectedHead1Id}
                                onChange={(e) => setSelectedHead1Id(e.target.value)}
                                disabled={submitting}
                            >
                                {/* <option value="">Select Control Head 1</option> */}
                                {controlHead1List.map(head1 => (
                                    <option key={head1.id} value={head1.id}>
                                        {head1.zHead1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Control Head 2 Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Control Head 2
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={head2Value}
                                onChange={(e) => setHead2Value(e.target.value)}
                                placeholder="Enter Control Head 2 value"
                                disabled={submitting}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded-md text-white font-medium ${submitting
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : 'Create Control Head 2'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
