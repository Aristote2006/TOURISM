
import React from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md mb-4">
        <Link to="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homepage
        </Link>
      </div>
      <AuthForm />
    </div>
  );
}
