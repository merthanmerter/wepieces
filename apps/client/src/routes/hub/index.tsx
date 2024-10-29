import MonthPicker from "@/components/shared/month-picker";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useRootContext } from "@/hooks";
import { postReportAtom } from "@/store/post-report";
import { useQuery } from "@tanstack/react-query";
import {
  Await,
  createFileRoute,
  defer,
  useRouter,
} from "@tanstack/react-router";
import { useAtom } from "jotai/react";
import { TrendingUpIcon, UsersRoundIcon } from "lucide-react";
import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

export const Route = createFileRoute("/hub/")({
  loader: ({ context: { proxy, store } }) => {
    const { year, month } = store.get(postReportAtom);
    return {
      data: defer(
        proxy.posts.chart.query({
          year,
          month,
        }),
      ),
    };
  },
  component: Page,
});

export default function Page() {
  const { data } = Route.useLoaderData();

  return (
    <React.Fragment>
      <h1 className='font-bold text-xl mb-4'>Hub Dashboard</h1>
      <div className='grid lg:grid-cols-[1fr_1fr] gap-4 items-start'>
        <Await
          promise={data}
          fallback={<BarChartSkeleton />}>
          {(data) => {
            return <BarChartComponent data={data} />;
          }}
        </Await>
        <ActiveUsersComponent />
      </div>
    </React.Fragment>
  );
}

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type ChartData = Awaited<typeof Route.types.loaderData.data>; // this is how we infer types from loader data

const getChartData = (data: ChartData) => {
  return data?.map((item) => ({
    day: new Date(item.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    total: item.total,
  }));
};

function BarChartComponent({ data }: { data: ChartData }) {
  const router = useRouter();
  const total = Number(data?.reduce((acc, curr) => acc + +curr.total, 0));

  /**
   * Demonstrates how to send custom
   * parameters to the loader function.
   *
   * - `postReportAtom` is subscribed to the store
   *   to track state changes.
   * - Subscription happens in: `./src/store/index.ts`
   * - Example use case: Instead of using query parameters,
   *   this approach allows stateful updates for
   *   tracking `month` and `year` data.
   *   In this example, we don't want to show user
   *   the query parameters in the URL and provide a
   *   global state management.
   *
   * @file './src/store/post-report.ts'
   */
  const [{ month, year }, setDate] = useAtom(postReportAtom);
  const onMonthChange = (newMonth: Date) => {
    setDate({
      month: newMonth.getMonth() + 1,
      year: newMonth.getFullYear(),
    });
    router.invalidate();
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-2'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              Total Posts
            </CardTitle>
            <CardDescription>Total number of posts created</CardDescription>
          </div>
          <MonthPicker
            currentMonth={new Date(year, month - 1, 1)}
            onMonthChange={onMonthChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={getChartData(data)}
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
          Total {total} {total > 1 ? "posts" : "post"} created this month.{" "}
          <TrendingUpIcon className='size-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing data for {month} / {year}
        </div>
      </CardFooter>
    </Card>
  );
}

function BarChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-2'>
          <div>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 mt-1 w-48' />
          </div>
          <Skeleton className='h-8 w-24' />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className='aspect-video w-full' />
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-3.5 w-32' />
      </CardFooter>
    </Card>
  );
}

function ActiveUsersComponent() {
  const context = useRootContext();
  const { data, status } = useQuery({
    queryKey: ["users"],
    queryFn: () => context.proxy.users.activeUsers.query(),
  });

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
          {status === "success" ? (
            data.map((user) => (
              <li
                key={user.id}
                className='flex items-center gap-2'>
                <div className='bg-green-500 rounded-full size-3 animate-pulse' />
                <span className='leading-none text-sm font-medium'>
                  {user.username}
                </span>
              </li>
            ))
          ) : (
            <div className='flex flex-col gap-2'>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  className='flex items-center gap-2'
                  key={idx}>
                  <Skeleton className='size-3 rounded-full' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
              ))}
            </div>
          )}
        </ul>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        {status === "success" && data?.length > 0 ? (
          <>
            Total {data?.length} active {data.length > 1 ? "users" : "user"}
          </>
        ) : (
          <Skeleton className='h-3 w-32 rounded-md' />
        )}
      </CardFooter>
    </Card>
  );
}
