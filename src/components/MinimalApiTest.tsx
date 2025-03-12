'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MinimalApiTest() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Test with the simplest possible endpoint
    const testNotifications = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const response = await fetch('/api/fingrid/notifications/active');

            if (!response.ok) {
                const errorData = await response.text();
                setError(`HTTP Error ${response.status}: ${errorData}`);
            } else {
                const data = await response.json();
                setResponse(data);
            }
        } catch (err) {
            setError(`Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    // Test the environment variables endpoint
    const testEnv = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const response = await fetch('/api/test-env');

            if (!response.ok) {
                const errorData = await response.text();
                setError(`HTTP Error ${response.status}: ${errorData}`);
            } else {
                const data = await response.json();
                setResponse(data);
            }
        } catch (err) {
            setError(`Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    // Direct test of the dataset
    const testDataset = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            // Test dataset 193 (electricity consumption)
            const response = await fetch('/api/fingrid/datasets/193/data/latest');

            if (!response.ok) {
                const errorData = await response.text();
                setError(`HTTP Error ${response.status}: ${errorData}`);
            } else {
                const data = await response.json();
                setResponse(data);
            }
        } catch (err) {
            setError(`Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>API Connection Test</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:gap-2">
                        <Button onClick={testNotifications} disabled={loading}>
                            {loading ? 'Testing...' : 'Test Notifications API'}
                        </Button>
                        <Button onClick={testEnv} variant="outline" disabled={loading}>
                            Check Environment
                        </Button>
                        <Button onClick={testDataset} variant="secondary" disabled={loading}>
                            Test Dataset API
                        </Button>
                    </div>

                    {error && (
                        <div className="p-4 mt-4 bg-red-50 text-red-900 rounded-md border border-red-200">
                            <h3 className="font-medium">Error</h3>
                            <pre className="text-xs mt-2 whitespace-pre-wrap">{error}</pre>
                        </div>
                    )}

                    {response && (
                        <div className="p-4 mt-4 bg-green-50 text-green-900 rounded-md border border-green-200">
                            <h3 className="font-medium">Success!</h3>
                            <pre className="text-xs mt-2 whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
                        </div>
                    )}

                    <div className="p-4 mt-4 bg-gray-50 text-gray-900 rounded-md border border-gray-200">
                        <h3 className="font-medium">Debugging Hints</h3>
                        <ul className="mt-2 text-sm space-y-1 list-disc pl-4">
                            <li>Make sure your .env.local file exists in the project root</li>
                            <li>Check that FINGRID_API_KEY is set correctly without quotes</li>
                            <li>Restart Next.js server after changing .env.local</li>
                            <li>Try the direct test script: <code>node scripts/direct-test.js</code></li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}