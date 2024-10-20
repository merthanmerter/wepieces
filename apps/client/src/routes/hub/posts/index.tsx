import DataTable from "@/components/shared/data-table";
import Helmet from "@/components/shared/helmet";
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import React from "react";
import PostsForm from "../../../components/forms/posts";

export const Route = createFileRoute("/hub/posts/")({
  loaderDeps: ({ search }) => search,
  component: Page,
  loader: ({ context, deps: params }) => context.proxy.posts.list.query(params),
});

function Page() {
  const data = useLoaderData({ from: "/hub/posts/" });

  return (
    <React.Fragment>
      <Helmet meta={{ title: "Posts", description: "Posts list" }} />
      <DataTable
        title={<h1 className='font-bold text-xl'>Posts</h1>}
        nav={{ end: <PostsForm /> }}
        data={data.records}
        meta={data.meta}
        options={{
          columnVisibility: {
            createdAt: false,
            updatedAt: false,
            createdBy: false,
            updatedBy: false,
          },
        }}
        columns={[
          {
            id: "action",
            accessorKey: "id",
            header: "",
            meta: {
              className: "w-10",
            },
            cell: ({ row }) => (
              <Link
                to='/hub/posts/$id'
                params={{ id: row.original.id }}>
                <ArrowUpRightIcon className='h-4 w-4 cursor-pointer' />
              </Link>
            ),
          },
          {
            accessorKey: "title",
            header: "Title",
            meta: {
              type: "text",
              name: "title",
              placeholder: "Title",
              sortable: true,
            },
          },
          {
            accessorKey: "content",
            header: "Content",
            cell: ({ row }) => row.original.content?.slice(0, 60) + "...",
          },
          {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => row.original.createdAt.toLocaleString(),
          },
          {
            accessorKey: "updatedAt",
            header: "Updated",
            cell: ({ row }) => row.original.updatedAt.toLocaleString(),
          },
        ]}
      />
    </React.Fragment>
  );
}
