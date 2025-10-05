import React from "react";

interface Activity {
  id: number;
  action: string;
  hash: string;
  timestamp: number | Date;
  status: 'pending' | 'completed' | 'failed';
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
            No activities yet
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300">
            Perform actions above to see them appear here in real-time
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-4 bg-black/40 border border-white/10 rounded-lg text-white">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              activity.status === 'completed' ? 'bg-green-400' :
              activity.status === 'pending' ? 'bg-yellow-300' : 'bg-red-400'
            }`} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  {activity.action}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  activity.status === 'completed' ? 'bg-green-500/20 text-green-200 border-green-400/40' :
                  activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-100 border-yellow-300/40' : 'bg-red-500/20 text-red-200 border-red-400/40'
                }`}>
                  {activity.status}
                </span>
              </div>

              <div className="mt-1 flex items-center space-x-2 text-xs text-white/80">
                <span>{(activity.timestamp instanceof Date ? activity.timestamp : new Date(activity.timestamp)).toLocaleTimeString()}</span>
                <span>•</span>
                <span className="font-mono truncate text-white">{activity.hash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
