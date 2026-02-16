import { useEffect, useState } from 'react';
import { applicationService } from '@/services/application.service';
import { Card } from '@/components/common/Card/Card';

interface TimelineEvent {
  status: string;
  timestamp: string;
  notes?: string;
}

interface Application {
  _id: string;
  applicationId: string;
  schemeName: string;
  status: string;
  submittedAt: string;
  timeline: TimelineEvent[];
}

export const ApplicationTracker = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app._id}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{app.schemeName}</h3>
              <p className="text-sm text-gray-600">Application ID: {app.applicationId}</p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(app.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
              {app.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {app.timeline && app.timeline.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-semibold mb-2">Timeline</h4>
              <div className="space-y-2">
                {app.timeline.map((event: TimelineEvent, idx: number) => (
                  <div key={idx} className="flex gap-2 text-sm">
                    <span className="text-gray-500">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </span>
                    <span>-</span>
                    <span className="font-medium">{event.status}</span>
                    {event.notes && <span className="text-gray-600">: {event.notes}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}

      {applications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No applications submitted yet
        </div>
      )}
    </div>
  );
};