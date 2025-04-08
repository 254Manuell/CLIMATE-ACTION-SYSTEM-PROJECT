"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SecurityLog from "@/app/components/security-log";

export default function ProfileManagePage() {
  const { user, updateUserProfile, updateUserEmail, deleteUserAccount, sendVerificationEmail } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateUserProfile(name);
      setSuccess("Profile updated successfully!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateUserEmail(email);
      setSuccess("Verification email sent to new address. Please verify to complete the change.");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendVerificationEmail();
      setSuccess("Verification email sent!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true);
      setError("");

      try {
        await deleteUserAccount();
        router.push("/signup");
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Update Profile
            </Button>
          </form>

          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter new email"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Update Email
            </Button>
          </form>

          {user && !user.emailVerified && (
            <div className="pt-4">
              <Button onClick={handleResendVerification} variant="outline" disabled={loading}>
                Resend Verification Email
              </Button>
            </div>
          )}

          <div className="pt-8">
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              disabled={loading}
              className="w-full"
            >
              Delete Account
            </Button>
          </div>

          <div className="mt-8">
            <SecurityLog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
