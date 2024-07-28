'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { File, UserIcon, TrendingUp, SearchIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";

export default function Page() {
  
  
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--primary))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--primary) / 0.2)",
    },
  };

  return (
    <main className="flex-1 space-y-8 p-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between p-4 border-b">
            <CardTitle className="font-bold mb-2">Blogs</CardTitle>
            <File className="w-6 h-6" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-3xl font-bold">10,928</div>
            <p className="text-primary text-sm">12% more than previous week</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between p-4 border-b">
            <CardTitle className="font-bold mb-2">Comments</CardTitle>
            <UserIcon className="w-6 h-6" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-3xl font-bold">10,928</div>
            <p className="text-primary text-sm">12% more than previous week</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between p-4 border-b">
            <CardTitle className="font-bold mb-2">Likes</CardTitle>
            <UserIcon className="w-6 h-6" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-3xl font-bold">10,928</div>
            <p className="text-primary text-sm">12% more than previous week</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between p-4 border-b">
            <CardTitle className="font-bold mb-2">Followers</CardTitle>
            <UserIcon className="w-6 h-6" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-3xl font-bold">10,928</div>
            <p className="text-primary text-sm">12% more than previous week</p>
          </CardContent>
        </Card>
      </section>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart - Multiple</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="desktop" fill={chartConfig.desktop.color} radius={4} />
                <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bloggers</CardTitle>
            <div className="relative ml-auto mb-4">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4" />
              <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-10" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-8">
            {/* Map over bloggers data if available */}
            {[
              { name: 'Olivia Martin', email: 'olivia.martin@email.com', earnings: '+$1,999.00', initials: 'OM' },
              { name: 'Jackson Lee', email: 'jackson.lee@email.com', earnings: '+$39.00', initials: 'JL' },
              { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', earnings: '+$299.00', initials: 'IN' },
              { name: 'William Kim', email: 'will@email.com', earnings: '+$99.00', initials: 'WK' },
              { name: 'Sofia Davis', email: 'sofia.davis@email.com', earnings: '+$39.00', initials: 'SD' },
            ].map((blogger, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                  <AvatarFallback>{blogger.initials}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">{blogger.name}</p>
                  <p className="text-sm text-muted-foreground">{blogger.email}</p>
                </div>
                <div className="ml-auto font-medium">{blogger.earnings}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
