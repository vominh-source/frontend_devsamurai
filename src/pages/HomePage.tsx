import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  // Check URL params to show profile view
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'profile') {
      setShowProfile(true);
    }
  }, [searchParams]);

  const handleBackToHome = () => {
    setShowProfile(false);
    navigate('/dashboard');
  };

  // Extract name from email if name is not available
  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      // Extract name from email (part before @)
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (showProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackToHome}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your account details and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name (extracted from email)</label>
                  <p className="text-gray-900">{getUserDisplayName()}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Account creation and activity details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Created</label>
                  <p className="text-gray-900">{formatDate(user?.createdAt)}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-gray-900">{formatDate(user?.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {getUserDisplayName()}! 👋
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Great to see you back. Here's what's happening with your account.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button onClick={() => setShowProfile(true)}>
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">Active</div>
              <p className="text-sm text-gray-600">Your account is in good standing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Member Since</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatDate(user?.createdAt)}
              </div>
              <p className="text-sm text-gray-600">Registration date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {user?.name ? '100%' : '80%'}
              </div>
              <p className="text-sm text-gray-600">
                {user?.name ? 'Complete!' : 'Add your name to complete'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Info Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <p className="text-gray-900">{getUserDisplayName()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
