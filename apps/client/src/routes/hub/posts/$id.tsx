import DangerZone from "@/components/shared/danger-zone";
import Helmet from "@/components/shared/helmet";
import HorizontalScrollArea from "@/components/shared/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useRootContext } from "@/hooks";
import { ActionDispatch } from "@/lib/dispatches";
import { createFileRoute } from "@tanstack/react-router";
import { TableIcon } from "lucide-react";
import React from "react";
import PostsForm from "../../../components/forms/posts";

export const Route = createFileRoute("/hub/posts/$id")({
  component: Page,
  loader: ({ context, params: { id } }) =>
    context.proxy.posts.find.query({ id }),
});

function Page() {
  const data = Route.useLoaderData();
  const { proxy } = useRootContext();

  const [action, updateAction] = React.useReducer(
    ActionDispatch<{ view: "default" | "table" }>,
    { view: "default" },
  );

  const deleteFn = async () => {
    await proxy.posts.delete.mutate({ id: data.id });
  };

  const rows = [
    {
      name: "Title",
      value: data.title,
      description: "Title of the post",
    },
    {
      name: "Content",
      value: data.content,
      description: "Content of the post",
    },
  ] as const;

  return (
    <React.Fragment>
      <Helmet
        meta={{
          title: data.title,
          description: data.content?.slice(0, 150) + "...",
        }}
      />
      <div className='flex mb-4 items-center justify-between gap-2 h-8'>
        <h1 className='font-bold text-xl'>{data.title}</h1>
        <div className='ml-auto h-8 flex items-center gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() =>
              updateAction({
                view: action.view === "default" ? "table" : "default",
              })
            }>
            <TableIcon className='size-4' />
            Change View
          </Button>
          <PostsForm initialValues={data} />
        </div>
      </div>
      <div className='grid lg:grid-cols-2 gap-4 items-start lg:grid-cols-[2.5fr_1fr]'>
        {action.view === "default" ? (
          data.content && <p className='text-justify'>{data.content}</p>
        ) : (
          <HorizontalScrollArea>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
                {rows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row.name === "Content"
                        ? row.value?.slice(0, 60) + "..."
                        : row.value}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </HorizontalScrollArea>
        )}
        <div className='space-y-4'>
          <div className='border rounded-md text-sm overflow-hidden'>
            <div className='bg-muted px-3 py-2.5 border-b'>Summary</div>
            <div className='p-3'>
              This post was created by <b>{data.createdBy.username}</b> in{" "}
              <b>{data.createdAt.toLocaleString()}</b> and last updated by{" "}
              <b>{data.updatedBy.username} </b> in{" "}
              <b>{data.updatedAt.toLocaleString()}</b>
            </div>
          </div>
          <DangerZone mutationFn={deleteFn} />
        </div>
      </div>
    </React.Fragment>
  );
}
