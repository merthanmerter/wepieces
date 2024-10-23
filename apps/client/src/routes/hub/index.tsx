import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { TrendingUpIcon, UsersRoundIcon } from "lucide-react";
import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

export const Route = createFileRoute("/hub/")({
  component: Page,
  loader: async ({ context }) => {
    const [posts, users] = await Promise.all([
      context.proxy.posts.chart.query(),
      context.proxy.users.activeUsers.query(),
    ]);
    return { posts, users };
  },
});

export default function Page() {
  return (
    <React.Fragment>
      <h1 className='font-bold text-xl mb-4'>Hub Dashboard</h1>
      <div className='grid grid-cols-[3fr_1fr] gap-4 items-start'>
        <BarChartComponent />
        <ActiveUsersComponent />
      </div>
    </React.Fragment>
  );
}

function BarChartComponent() {
  const { posts: data } = useLoaderData({ from: "/hub/" });

  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const chartData = data?.map((item) => ({
    day: new Date(item.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    total: item.total,
  }));

  const total = Number(data?.reduce((acc, curr) => acc + +curr.total, 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Posts</CardTitle>
        <CardDescription>Total number of posts created</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='day'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey='total'
              fill='var(--color-total)'
              radius={8}>
              <LabelList
                position='top'
                offset={12}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Total {total} {total > 1 ? "posts" : "post"} created this week.{" "}
          <TrendingUpIcon className='size-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing data for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
}

function ActiveUsersComponent() {
  const { users: data } = useLoaderData({ from: "/hub/" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <UsersRoundIcon className='size-5' /> Active Users
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='flex flex-col gap-2'>
          {data.map((user) => (
            <li
              key={user.id}
              className='flex items-center gap-2'>
              <div className='bg-green-500 rounded-full size-3 animate-pulse' />
              <span className='leading-none text-sm font-medium'>
                {user.username}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        Total {data.length} active {data.length > 1 ? "users" : "user"}
      </CardFooter>
    </Card>
  );
}
