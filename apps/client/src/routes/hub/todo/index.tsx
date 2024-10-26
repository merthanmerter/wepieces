import { ButtonGroup } from "@/components/shared/button-group";
import Helmet from "@/components/shared/helmet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRootContext } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  todoInsertSchema,
  todoQuerySchema,
} from "@app/server/src/api/routers/todo/definitions";
import { nanoid } from "@app/server/src/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import {
  CheckSquareIcon,
  Loader2Icon,
  SquareIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/hub/todo/")({
  validateSearch: zodSearchValidator(todoQuerySchema),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.proxy.todo.list.query(deps),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  const { search } = useLocation();
  const navigate = Route.useNavigate();
  const { proxy } = useRootContext();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(todoInsertSchema),
    values: {
      title: "",
      type: "personal" as const,
    },
  });

  const addMutation = useMutation({
    mutationFn: () => {
      // optimistic update
      data.unshift({
        ...data[0],
        ...form.getValues(),
        id: nanoid(),
        completed: false,
      });

      // actual add
      const values = form.getValues();
      return proxy.todo.add.mutate({
        title: values.title,
        type: values.type,
      });
    },
    onSuccess: () => {
      form.reset();
      router.invalidate(); // or we won't be able to update/delete
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      // optimistic update
      data.splice(
        data.findIndex((todo) => todo.id === id),
        1,
      );
      // actual delete
      return proxy.todo.delete.mutate({ id });
    },
    // onSuccess: () => {
    // router.invalidate(); // we don't need this
    // },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => {
      // optimistic update
      data.forEach((todo) => {
        if (todo.id === id) {
          todo.completed = completed;
        }
      });
      // actual update
      return proxy.todo.complete.mutate({ id, completed });
    },
    // onSuccess: () => {
    // router.invalidate(); // we don't need this
    // },
  });

  const handleSubmit = form.handleSubmit(() => addMutation.mutate());

  return (
    <section className='max-w-lg mx-auto'>
      <Helmet meta={{ title: "Todo", description: "Todo list" }} />
      <h1 className='font-bold text-xl mb-4'>Todo List</h1>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className='space-y-3 flex flex-col'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='personal'>Personal</SelectItem>
                    <SelectItem value='team'>Team</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className='mt-2 ml-auto'
            type='submit'
            size='sm'
            disabled={addMutation.isPending}>
            {addMutation.isPending ? (
              <React.Fragment>
                <Loader2Icon className='size-4 animate-spin' />
              </React.Fragment>
            ) : (
              "Add Todo"
            )}
          </Button>
        </form>
      </Form>

      <React.Fragment>
        <div className='mt-8 mb-2 flex gap-2 items-center justify-end text-xs'>
          <ButtonGroup>
            <Button
              variant='outline'
              className={cn(
                search.type ? "text-muted-foreground" : "bg-muted",
                "w-[5rem]",
              )}
              size='sm'
              onClick={() =>
                navigate({
                  to: "/hub/todo",
                  search: { type: undefined },
                })
              }>
              All
            </Button>
            <Button
              variant='outline'
              className={cn(
                search.type !== "team" ? "text-muted-foreground" : "bg-muted",
                "w-[5rem]",
              )}
              size='sm'
              onClick={() =>
                navigate({
                  to: "/hub/todo",
                  search: { type: "team" },
                })
              }>
              Team
            </Button>
            <Button
              variant='outline'
              className={cn(
                search.type !== "personal"
                  ? "text-muted-foreground"
                  : "bg-muted",
                "w-[5rem]",
              )}
              size='sm'
              onClick={() =>
                navigate({ to: "/hub/todo", search: { type: "personal" } })
              }>
              Personal
            </Button>
          </ButtonGroup>
        </div>

        {router.state.location.pathname === location.pathname && // to prevent loading on page change
        router.state.isLoading ? (
          <div className='flex items-center justify-center h-16'>
            <Loader2Icon className='size-5 animate-spin text-muted-foreground' />
          </div>
        ) : (
          data?.length > 0 && (
            <ul
              id='todo-list'
              className='border p-2 rounded-md relative'>
              {data.map((todo) => (
                <li
                  key={todo.id}
                  className='flex items-center gap-4 border-b border-dashed py-1.5 last:border-b-0'>
                  <div className='grid items-center'>
                    {/* <Checkbox
                    disabled={completeMutation.isPending}
                    checked={todo?.completed ?? false}
                    onCheckedChange={() => {
                      completeMutation.mutate({
                        id: todo.id,
                        completed: !todo.completed,
                      });
                    }}
                  /> */}
                    <Button
                      size='icon'
                      variant='ghost'
                      className='ml-auto'
                      onClick={() => {
                        completeMutation.mutate({
                          id: todo.id,
                          completed: !todo.completed,
                        });
                      }}>
                      {todo.completed ? (
                        <CheckSquareIcon className='size-5' />
                      ) : (
                        <SquareIcon className='size-5' />
                      )}
                    </Button>
                  </div>
                  <span>
                    {todo.type === "personal" ? (
                      <UserIcon className='size-5' />
                    ) : (
                      <UsersIcon className='size-5' />
                    )}
                  </span>
                  <span className={cn(todo.completed && "line-through")}>
                    {todo.title.length > 20 ? (
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            todo.completed && "line-through",
                            "text-left whitespace-nowrap overflow-hidden max-w-[20ch] text-ellipsis",
                          )}>
                          {todo.title}
                        </PopoverTrigger>
                        <PopoverContent className='text-sm'>
                          {todo.title}
                        </PopoverContent>
                      </Popover>
                    ) : (
                      todo.title
                    )}
                  </span>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='ml-auto flex-shrink-0'
                    type='button'
                    onClick={() => deleteMutation.mutate(todo.id)}>
                    <TrashIcon className='size-5' />
                  </Button>
                </li>
              ))}
            </ul>
          )
        )}
      </React.Fragment>
    </section>
  );
}
