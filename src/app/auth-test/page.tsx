"use client";

import { useUser } from '@auth0/nextjs-auth0/client';

export default function AuthTest() {
  const { user, error, isLoading } = useUser();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </div>
        
        <div>
          <strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}
        </div>
        
        {user && (
          <div>
            <strong>Email:</strong> {user.email}
            <br />
            <strong>Name:</strong> {user.name}
          </div>
        )}
        
        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {error.message}
          </div>
        )}
        
        <div className="mt-8">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-blue-600 text-white rounded mr-4"
          >
            Go to Dashboard
          </button>
          
          <button 
            onClick={() => window.location.href = '/api/auth/login'}
            className="px-4 py-2 bg-green-600 text-white rounded mr-4"
          >
            Login
          </button>
          
          <button 
            onClick={() => window.location.href = '/api/auth/logout'}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}