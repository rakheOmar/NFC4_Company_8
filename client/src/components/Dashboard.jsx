import React, { useEffect, useState } from 'react';
import {
  Bell,
  Clock,
  HardHat,
  Menu,
  Users,
  AlertTriangle,
} from 'lucide-react';

// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Local Imports
import Sidebar from './Sidebar'; // Import the new Sidebar component
import socket from '../socket.js';
import { useAuth } from '@/context/AuthContext';

// --- Main Dashboard Component ---
const Dashboard = () => {
  const { user } = useAuth();
  // Sidebar is open by default on desktop, closed on mobile.
  const [isSidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' && window.innerWidth > 1024
  );

  // --- STATE MANAGEMENT ---
  const [isCheckedIn, setIsCheckedIn] = useState(
    () =>
      typeof window !== 'undefined' &&
      localStorage.getItem(`isCheckedIn_${user?._id}`) === 'true'
  );

  const [team, setTeam] = useState(
    () =>
      (typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('teamData'))) || {
        online: 8,
        offline: 4,
      }
  );

  const [salaryData, setSalaryData] = useState(
    () =>
      (typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem(`salaryData_${user?._id}`))) || {
        thisMonth: 45500,
        attendance: '23/24',
        progress: 96,
        base: 40000,
        safetyBonus: 3000,
        overtime: 2500,
      }
  );

  const instructions = [
    {
      id: 1,
      title: 'Safety equipment check',
      status: 'completed',
      detail: 'Completed at 6:15 AM',
    },
    {
      id: 2,
      title: 'Coal extraction - Section B',
      status: 'progress',
      detail: 'In progress - 65% complete',
    },
    {
      id: 3,
      title: 'Equipment maintenance',
      status: 'scheduled',
      detail: 'Scheduled for 2:00 PM',
    },
  ];

  // --- EVENT HANDLERS ---
  const handleCheckIn = () => {
    if (!isCheckedIn && user?._id) {
      socket.emit('workerCheckIn', { workerId: user._id });
      setIsCheckedIn(true);
      localStorage.setItem(`isCheckedIn_${user?._id}`, 'true');

      // Optimistically update team status for immediate UI feedback
      setTeam((prevTeam) => {
        const newTeam = {
          online: prevTeam.online + 1,
          offline: Math.max(0, prevTeam.offline - 1),
        };
        localStorage.setItem('teamData', JSON.stringify(newTeam));
        return newTeam;
      });
    }
  };

  const handleCheckOut = () => {
    if (isCheckedIn && user?._id) {
      socket.emit('workerCheckOut', { workerId: user._id });
      setIsCheckedIn(false);
      localStorage.setItem(`isCheckedIn_${user?._id}`, 'false');

      // Optimistically update team status for immediate UI feedback
      setTeam((prevTeam) => {
        const newTeam = {
          online: Math.max(0, prevTeam.online - 1),
          offline: prevTeam.offline + 1,
        };
        localStorage.setItem('teamData', JSON.stringify(newTeam));
        return newTeam;
      });
    }
  };

  // --- SOCKET.IO EFFECT ---
  useEffect(() => {
    if (!user?._id) return;

    const handleWorkerCheckInUpdate = (data) => {
      // The team count is updated via socket to ensure all clients are in sync.
      // The optimistic update provides instant feedback to the user who clicked.
      setTeam((prevTeam) => {
        const newTeam = {
          online: prevTeam.online + 1,
          offline: Math.max(0, prevTeam.offline - 1),
        };
        localStorage.setItem('teamData', JSON.stringify(newTeam));
        return newTeam;
      });

      if (data.workerId === user._id) {
        setSalaryData((prevSalary) => {
          const [attended, total] = prevSalary.attendance.split('/').map(Number);
          const newAttended = attended + 1;
          const newSalary = {
            ...prevSalary,
            attendance: `${newAttended}/${total}`,
            thisMonth: prevSalary.thisMonth + 500, // Example increment
            progress: Math.round((newAttended / total) * 100),
          };
          localStorage.setItem(
            `salaryData_${user._id}`,
            JSON.stringify(newSalary)
          );
          return newSalary;
        });
      }
    };

    const handleWorkerCheckOutUpdate = (data) => {
      // The team count is updated via socket to ensure all clients are in sync.
      setTeam((prevTeam) => {
        const newTeam = {
          online: Math.max(0, prevTeam.online - 1),
          offline: prevTeam.offline + 1,
        };
        localStorage.setItem('teamData', JSON.stringify(newTeam));
        return newTeam;
      });
    };

    socket.on('workerCheckInUpdate', handleWorkerCheckInUpdate);
    socket.on('workerCheckOutUpdate', handleWorkerCheckOutUpdate);

    return () => {
      socket.off('workerCheckInUpdate', handleWorkerCheckInUpdate);
      socket.off('workerCheckOutUpdate', handleWorkerCheckOutUpdate);
    };
  }, [user?._id]);

  // --- RENDER ---
  return (
    <div className="min-h-screen w-full bg-slate-50 text-gray-800">
      <Sidebar
        user={user}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`main-content transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* --- Header --- */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white/80 p-4 backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold">Worker Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatarUrl} alt={user?.fullname} />
              <AvatarFallback>{user?.fullname?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* --- Main Content Grid --- */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {/* Shift Status Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Shift Status
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    isCheckedIn ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {isCheckedIn ? 'Active' : 'Inactive'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isCheckedIn
                    ? 'You are currently checked in.'
                    : 'You are not checked in.'}
                </p>
              </CardContent>
              <CardFooter>
                {isCheckedIn ? (
                  <Button
                    onClick={handleCheckOut}
                    variant="destructive"
                    className="w-full"
                  >
                    Check Out
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckIn}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Check In
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Safety Score Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Safety Score
                </CardTitle>
                <HardHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-sm text-muted-foreground">
                  Based on recent activity
                </p>
              </CardContent>
              <CardFooter>
                <Progress value={98} aria-label="98% safety score" />
              </CardFooter>
            </Card>

            {/* Team Members Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {team.online + team.offline}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-500 font-semibold">
                    {team.online} online
                  </span>
                  , {team.offline} offline
                </p>
              </CardContent>
            </Card>

            {/* Alerts Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-sm text-muted-foreground">
                  2 new, 1 pending review
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Work Instructions Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Work Instructions</CardTitle>
                <CardDescription>
                  Tasks assigned for your current shift.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instructions.map((inst) => (
                      <TableRow key={inst.id} className="text-sm">
                        <TableCell className="font-medium">
                          {inst.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inst.status === 'completed'
                                ? 'default'
                                : inst.status === 'progress'
                                ? 'secondary'
                                : 'outline'
                            }
                            className={
                              inst.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : inst.status === 'progress'
                                ? 'bg-orange-100 text-orange-800'
                                : ''
                            }
                          >
                            {inst.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{inst.detail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Salary & Attendance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Salary & Attendance</CardTitle>
                <CardDescription>
                  Your stats for the current pay period.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      This Month's Earnings
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{salaryData.thisMonth.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={salaryData.progress}
                    aria-label={`${salaryData.progress}% of attendance complete`}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-semibold">
                    {salaryData.attendance} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Salary</span>
                  <span>₹{salaryData.base.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Safety Bonus</span>
                  <span>₹{salaryData.safetyBonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overtime Pay</span>
                  <span>₹{salaryData.overtime.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
