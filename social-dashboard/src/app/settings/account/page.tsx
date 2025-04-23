"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Building2, Globe } from 'lucide-react';

const accountData = {
  personal: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Philadelphia, PA',
    company: 'LaunchPad Philly',
    website: 'www.johnsmith.dev'
  },
  socialAccounts: {
    twitter: {
      username: '@johnsmith',
      connected: true,
      lastSync: '2025-04-23T10:30:00Z'
    },
    instagram: {
      username: '@john.codes',
      connected: true,
      lastSync: '2025-04-23T10:30:00Z'
    },
    linkedin: {
      username: 'john-smith-dev',
      connected: true,
      lastSync: '2025-04-23T10:30:00Z'
    }
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    dataSharing: false
  }
};

export default function AccountSettingsPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail className="w-5 h-5" />
              <span>{accountData.personal.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Phone className="w-5 h-5" />
              <span>{accountData.personal.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="w-5 h-5" />
              <span>{accountData.personal.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Building2 className="w-5 h-5" />
              <span>{accountData.personal.company}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Globe className="w-5 h-5" />
              <span>{accountData.personal.website}</span>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Connected Accounts</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                <span>{accountData.socialAccounts.twitter.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last synced: {formatDate(accountData.socialAccounts.twitter.lastSync)}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Connected
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span>{accountData.socialAccounts.instagram.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last synced: {formatDate(accountData.socialAccounts.instagram.lastSync)}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Connected
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <span>{accountData.socialAccounts.linkedin.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last synced: {formatDate(accountData.socialAccounts.linkedin.lastSync)}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <button
                className={`w-11 h-6 rounded-full transition-colors ${accountData.preferences.emailNotifications ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${accountData.preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <button
                className={`w-11 h-6 rounded-full transition-colors ${accountData.preferences.pushNotifications ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${accountData.preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Weekly Digest</span>
              <button
                className={`w-11 h-6 rounded-full transition-colors ${accountData.preferences.weeklyDigest ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${accountData.preferences.weeklyDigest ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Data Sharing</span>
              <button
                className={`w-11 h-6 rounded-full transition-colors ${accountData.preferences.dataSharing ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${accountData.preferences.dataSharing ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
