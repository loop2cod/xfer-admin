'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { admin, logout } = useAuth();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-base">
              You don&apos;t have permission to access this resource.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {admin && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Signed in as:</p>
                <p className="font-medium text-gray-900">{admin.email}</p>
                <p className="text-sm text-gray-600 capitalize">Role: {admin.role.replace('_', ' ')}</p>
              </div>
            )}
            
            <div className="text-sm text-gray-600">
              <p>This action requires additional permissions or a higher access level.</p>
              <p className="mt-2">Contact your system administrator if you believe this is an error.</p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleGoHome}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
              
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>

              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}