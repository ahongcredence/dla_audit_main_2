import Card from "../components/Card";
import BarChartComponent from "../components/dashboard/BarChart";
import KeyStats from "../components/dashboard/KeyStats";
import PieChartComponent from "../components/dashboard/PieChart";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-[90%] px-[5%]">
        {/* <div className="mb-8">
          <h1 className="mb-2">Analytics Dashboard</h1>
          <p>
            Real-time network traffic analysis and system metrics overview.
          </p>
        </div> */}

        {/* Main dashboard row - charts and key stats */}
        <div className="flex h-[350px] gap-6">
          {/* Charts section - wider containers */}
          <div className="h-full flex-[2.5]">
            <PieChartComponent />
          </div>

          <div className="h-full flex-[2.5]">
            <BarChartComponent />
          </div>

          {/* Key stats section - narrower container */}
          <div className="h-full flex-[3]">
            <KeyStats />
          </div>
        </div>

        {/* Additional info row */}
        <Card header={{ title: "Dashboard Features" }} className="mt-8">
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="mb-2 font-medium">Traffic Distribution</h4>
              <p>
                Pie chart showing the breakdown of accepted, rejected, and
                pending network traffic.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Monthly Trends</h4>
              <p>
                Bar chart displaying traffic patterns over the past 6 months
                with accept/reject ratios.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium">System Metrics</h4>
              <p>
                Key performance indicators including network stats, health
                status, and traffic density.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
