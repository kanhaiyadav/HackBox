import { GitHubContributionCalendar } from "@/types";

export default function ActivityHeatmap({ contributions }: { contributions: GitHubContributionCalendar }) {
  // Flatten all contribution days
  const allDays = contributions.weeks.flatMap(week => week.contributionDays);
  
// Group by month for labels
// Define interface for month string array
interface MonthLabels extends Array<string> {}

const months: MonthLabels = Array.from(new Set(
    allDays.map((day) => new Date(day.date).toLocaleString('default', { month: 'short' }))
));

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex mb-2">
          {months.map((month, index) => (
            <div key={month} className="text-xs text-gray-500" style={{ width: `${100 / months.length}%` }}>
              {month}
            </div>
          ))}
        </div>
        
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {allDays.map((day, index) => (
            <div 
              key={`${day.date}-${index}`}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: getColorForLevel(day.level),
                opacity: day.count > 0 ? 0.8 : 0.1
              }}
              title={`${day.date}: ${day.count} contributions`}
            />
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div 
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getColorForLevel(level) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

function getColorForLevel(level: number): string {
  const colors = [
    'rgb(235, 237, 240)',
    'rgb(155, 233, 168)',
    'rgb(64, 196, 99)',
    'rgb(48, 161, 78)',
    'rgb(33, 110, 57)'
  ];
  return colors[level] || colors[0];
}