import ApiTest from '@/components/ApiTest';

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Sähkön hinta -kojelauta</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
                Tämä on testisivu Fingrid API -integraatiolle. Se näyttää perustiedot sähkön kulutuksesta, tuotannosta, päästöistä ja säätösähkön hinnoista.
            </p>

            <ApiTest />
        </div>
    );
}