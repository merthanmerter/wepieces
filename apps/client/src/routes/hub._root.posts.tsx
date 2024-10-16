import DataTable from "@/components/base/data-table";
import Helmet from "@/components/base/helmet";
import PostsForm from "@/components/shared/posts-form";
import { helpers } from "@app/utils";
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { EllipsisIcon } from "lucide-react";
import React from "react";

export const Route = createFileRoute("/hub/_root/posts")({
  loaderDeps: ({ search }) => search,
  component: Page,
  loader: ({ context, deps: params }) => context.proxy.posts.list.query(params),
});

function Page() {
  const data = useLoaderData({ from: "/hub/_root/posts" });

  return (
    <React.Fragment>
      <Helmet meta={{ title: "Posts", description: "Posts list" }} />
      <DataTable
        title={<h1 className='font-bold text-xl'>Posts</h1>}
        nav={<PostsForm />}
        data={data.records}
        meta={data.meta}
        options={{
          columnVisibility: {
            createdAt: false,
            createdBy: false,
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
              <Link to={`/hub/posts/${row.original.id}`}>
                <EllipsisIcon className='h-4 w-4 cursor-pointer' />
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
            cell: ({ row }) => helpers.str(row.original.content).truncate(60),
          },
          {
            accessorKey: "createdBy",
            header: "Created By",
            meta: {
              type: "text",
              name: "createdBy",
              placeholder: "Created By",
              sortable: true,
            },
            cell: ({ row }) => row.original.createdBy.username,
          },
          {
            accessorKey: "updatedBy",
            header: "Updated By",
            meta: {
              type: "text",
              name: "updatedBy",
              placeholder: "Updated By",
              sortable: true,
            },
            cell: ({ row }) => row.original.updatedBy.username,
          },
          {
            accessorKey: "createdAt",
            header: "Created At",
            meta: {
              type: "date",
              name: "createdAt",
              placeholder: "Created At",
              sortable: true,
            },
            cell: ({ row }) => row.original.createdAt.toLocaleString(),
          },
          {
            accessorKey: "updatedAt",
            header: "Updated At",
            meta: {
              type: "date",
              name: "updatedAt",
              placeholder: "Updated At",
              sortable: true,
            },
            cell: ({ row }) => row.original.updatedAt.toLocaleString(),
          },
        ]}
      />
    </React.Fragment>
  );
}
