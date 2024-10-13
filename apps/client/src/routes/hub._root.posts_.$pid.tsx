import Helmet from "@/components/base/helmet";
import DangerZone from "@/components/shared/danger-zone";
import PostsForm from "@/components/shared/posts-form";
import { useRootContext } from "@/hooks";
import { strops } from "@/lib";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/hub/_root/posts/$pid")({
  component: Page,
  loader: ({ context, params: { pid } }) =>
    context.proxy.posts.find.query({ id: pid }),
});

function Page() {
  const data = useLoaderData({ from: "/hub/_root/posts/$pid" });
  const context = useRootContext();

  const deleteFn = async () => {
    await context.proxy.posts.delete.mutate({ id: data.id });
  };

  return (
    <React.Fragment>
      <Helmet
        meta={{
          title: data.title,
          description: strops(data.content).truncate(150),
        }}
      />
      <div className='flex mb-4 items-center justify-between gap-2 h-8'>
        <h1 className='font-bold text-xl'>{data.title}</h1>
        <div className='ml-auto space-x-2 h-8'>
          <PostsForm initialValues={data} />
        </div>
      </div>
      <div className='grid lg:grid-cols-2 gap-4 items-start lg:grid-cols-[2.5fr_1fr]'>
        {data.content && <p className='text-justify'>{data.content}</p>}
        <div className='space-y-4'>
          <div className='border rounded-md text-sm overflow-hidden'>
            <div className='bg-popover p-4 border-b'>Summary</div>
            <div className='p-4'>
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
