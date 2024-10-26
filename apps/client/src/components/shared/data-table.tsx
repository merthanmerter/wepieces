import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination as BasePagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGINATION_LIMIT } from "@app/server/src/lib/utils";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
  VisibilityState,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  ArrowDownNarrowWideIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
  Columns3Icon,
  FilterIcon,
  FilterXIcon,
  MinusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import HorizontalScrollArea from "./horizontal-scroll-area";

export interface DataTableProps<TData, TValue> {
  columns: DataTableColumnProps<TData, TValue>[];
  data: TData[];
  title?: React.ReactNode;
  nav?: {
    start?: React.ReactNode;
    end?: React.ReactNode;
  };
  meta?: DataTablePaginationProps;
  options?: {
    columnVisibility?: Partial<Record<keyof TData, boolean>>;
  };
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  title,
  nav,
  meta,
  options,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel<TData>(),
    initialState: {
      columnVisibility: options?.columnVisibility as VisibilityState,
    },
  });

  return (
    <React.Fragment>
      <div className='flex flex-col sm:flex-row mb-4 sm:items-center justify-between gap-2 sm:h-8'>
        {title}
        <div className='sm:ml-auto flex items-center gap-2 flex-wrap'>
          {nav?.start}
          <DataTableFilters
            columns={columns}
            modal={true}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'>
                <Columns3Icon />
                <span>Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  if (
                    column.columnDef.header &&
                    typeof column.columnDef?.header === "string"
                  ) {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }>
                        {column.columnDef?.header ?? column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  }
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {nav?.end}
        </div>
      </div>
      <HorizontalScrollArea>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={
                        (
                          header.column.columnDef.meta as {
                            className: string;
                          }
                        )?.className
                      }
                      key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn(
                        "h-10",
                        (cell.column.columnDef.meta as { className: string })
                          ?.className,
                      )}
                      key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </HorizontalScrollArea>
      <DataTablePagination {...meta} />
    </React.Fragment>
  );
}

const DEFAULT_LIMIT_OPTIONS = (params: URLSearchParams) =>
  [String(DEFAULT_PAGINATION_LIMIT), "50", "100", params.get("limit") ?? ""]
    .filter(Boolean)
    .reduce<string[]>((acc, curr) => {
      if (!acc.includes(curr)) acc.push(curr);
      return acc;
    }, []);

function DataTablePagination(props: Partial<DataTablePaginationProps>) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const params = React.useMemo(
    () => new URLSearchParams(search as [string, string][]),
    [search],
  );

  const handlePageChange = (page: number | undefined) => {
    navigate({
      to: `${pathname}`,
      search: {
        ...Object.fromEntries(params.entries()),
        limit,
        page,
      },
    });
  };

  const handleLimitChange = (limit: number) => {
    navigate({
      to: `${pathname}`,
      search: {
        ...Object.fromEntries(params.entries()),
        limit,
        page: 1,
      },
    });
  };

  const {
    page = 1,
    limit = DEFAULT_PAGINATION_LIMIT,
    total = 0,
    totalPages = 1,
  } = props;

  return (
    <div className='flex mt-3 items-center justify-between'>
      <div className='flex-1 text-xs text-muted-foreground flex items-center gap-2'>
        <Select
          value={params.get("limit") ?? DEFAULT_PAGINATION_LIMIT?.toString()}
          onValueChange={(value) => handleLimitChange(+value)}>
          <SelectTrigger className='w-min p-0 px-1.5 h-8 bg-background text-xs'>
            <SelectValue placeholder={DEFAULT_PAGINATION_LIMIT} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {DEFAULT_LIMIT_OPTIONS(params).map((limit) => (
                <SelectItem
                  value={limit}
                  key={limit}>
                  {limit}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <p className='hidden sm:block'>{`Showing ${(page - 1) * limit + 1} to ${Math.min(page * Number(limit), total)} of ${total} results`}</p>
      </div>

      <BasePagination className='flex-1 justify-end'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              type='button'
              className='hover:bg-foreground/5'
              size='sm'
              disabled={!props.hasPrev}
              onClick={() => {
                if (props.hasPrev) handlePageChange(Number(props.page) - 1);
              }}
            />
          </PaginationItem>

          {/* Always display the first page */}
          <PaginationItem className='hidden sm:block'>
            <PaginationLink
              type='button'
              className='hover:bg-foreground/5'
              size='sm'
              isActive={props.page === 1}
              onClick={() => {
                handlePageChange(1);
              }}>
              1
            </PaginationLink>
          </PaginationItem>

          {/* Ellipsis after the first page if more than 3 pages */}
          {totalPages > 3 && page > 3 && (
            <PaginationItem className='hidden sm:block'>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Display middle pages when applicable */}
          {Array.from(Array(totalPages).keys())
            .filter((page) => page !== 0 && page !== Number(totalPages) - 1)
            .map((page) => (
              <PaginationItem
                className='hidden sm:block'
                key={page}>
                <PaginationLink
                  type='button'
                  className='hover:bg-foreground/5'
                  size='sm'
                  isActive={page === page + 1}
                  onClick={() => {
                    handlePageChange(page + 1);
                  }}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

          {/* Ellipsis before the last page if necessary and more than 3 pages */}
          {totalPages > 3 && page < totalPages - 3 && (
            <PaginationItem className='hidden sm:block'>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Always display the last page if more than one page */}
          {totalPages > 1 && (
            <PaginationItem className='hidden sm:block'>
              <PaginationLink
                type='button'
                className='hover:bg-foreground/5'
                size='sm'
                isActive={props.page === props.totalPages}
                onClick={() => {
                  handlePageChange(props.totalPages);
                }}>
                {props.totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              className='hover:bg-foreground/5'
              size='sm'
              type='button'
              disabled={!props.hasNext}
              onClick={() => {
                if (props.hasNext) handlePageChange(Number(props.page) + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </BasePagination>
    </div>
  );
}

export type DataTablePaginationProps = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export interface DataTableFilterProps<TData, TValue> {
  columns: DataTableColumnProps<TData, TValue>[];
  className?: string;
  modal?: boolean;
}

const RANGE_INPUT_JOINER = "_-_";

export function DataTableFilters<TData, TValue>({
  className,
  columns,
  modal = false,
}: DataTableFilterProps<TData, TValue>) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const params = React.useMemo(
    () => new URLSearchParams(search as [string, string][]),
    [search],
  );
  const currentParams = React.useMemo(
    () => Object.fromEntries(params.entries()),
    [params],
  );

  const [open, setOpen] = React.useState(false);
  const [defaultValues, setDefaultValues] =
    React.useState<Record<string, FormDataEntryValue>>(currentParams);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    Object.entries(data).forEach(([key, value]) => {
      if (value && typeof value === "string") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    navigate({
      to: `${pathname}`,
      search: Object.fromEntries(params.entries()),
    });
    setOpen(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDefaultValues({ ...defaultValues, [e.target.name?.toString()]: value });
  }

  function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget.name?.includes(RANGE_INPUT_JOINER)) {
      const name = e.currentTarget.name?.split(RANGE_INPUT_JOINER);
      const newValues = structuredClone(defaultValues);
      name.forEach((n) => {
        delete newValues[n];
      });
      setDefaultValues(newValues);
      return;
    }

    const name = e.currentTarget.name?.toString();
    const newValues = structuredClone(defaultValues);
    delete newValues[name];
    setDefaultValues(newValues);
  }

  function onOpenChange(open: boolean) {
    setOpen(open);
    if (open) {
      setDefaultValues(currentParams);
    }
  }

  function handleSort(name: string, dir: "asc" | "desc" | "clear") {
    if (dir === "clear") {
      setDefaultValues((prev) => ({ ...prev, orderBy: "", ["orderDir"]: "" }));
    } else {
      setDefaultValues((prev) => ({
        ...prev,
        orderBy: name,
        ["orderDir"]: dir,
      }));
    }
  }

  function handleReset() {
    // Get the current value of limit
    const limit = params.get("limit");

    // Clear all parameters
    const newParams = new URLSearchParams();

    // Restore the limit parameter if it exists
    if (limit) newParams.set("limit", limit);

    // Update the URL with only the preserved parameters
    navigate({
      to: `${pathname}`,
      search: Object.fromEntries(newParams.entries()),
    });
    setDefaultValues({});
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}>
      <DialogTrigger asChild>
        <Button
          className={className}
          variant='outline'
          size='sm'>
          {Array.from(params.keys()).filter(
            (key) => key !== "limit" && key !== "page",
          ).length > 0 ? (
            <React.Fragment>
              <FilterXIcon /> <span>Filters</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FilterIcon /> <span>Filters</span>
            </React.Fragment>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg'>
        <form
          onChange={(e) => {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            setDefaultValues(data);
          }}
          onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Apply Filters</DialogTitle>
            <DialogDescription>
              Use the filters below to refine your search.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-2 py-4'>
            {columns.map((filter) => {
              if (isTextMeta(filter.meta)) {
                return (
                  <div
                    className='flex gap-1.5 items-center justify-between'
                    key={filter.meta.name}>
                    <Input
                      placeholder={filter.meta.placeholder}
                      name={filter.meta.name}
                      value={defaultValues[filter.meta.name]?.toString() ?? ""}
                      onChange={handleChange}
                      className='col-span-3'
                    />
                    {defaultValues[filter.meta.name] && (
                      <Button
                        type='button'
                        name={filter.meta.name}
                        onClick={handleRemove}
                        variant='outline'
                        size='icon'
                        className='col-span-1 flex-shrink-0'>
                        <XIcon className='size-4' />
                      </Button>
                    )}
                    <SortMenu
                      defaultValues={defaultValues}
                      handleSort={handleSort}
                      filter={filter}
                    />
                  </div>
                );
              }

              if (isRangeMeta(filter.meta)) {
                return (
                  <div
                    className='flex gap-1.5 items-center justify-between'
                    key={filter.meta.name?.join("_")}>
                    <Input
                      name={filter.meta.name[0]}
                      placeholder={filter.meta.placeholder[0]}
                      value={
                        defaultValues[filter.meta.name[0]]?.toString() ?? ""
                      }
                      onChange={handleChange}
                      className='col-span-3'
                    />
                    <MinusIcon className='h-5 w-5' />
                    <Input
                      name={filter.meta.name[1]}
                      placeholder={filter.meta.placeholder[1]}
                      value={
                        defaultValues[filter.meta.name[1]]?.toString() ?? ""
                      }
                      onChange={handleChange}
                      className='col-span-3'
                    />
                    {(defaultValues[filter.meta.name[0]] ??
                      defaultValues[filter.meta.name[1]]) && (
                      <Button
                        type='button'
                        name={filter.meta.name?.join(RANGE_INPUT_JOINER)}
                        onClick={handleRemove}
                        variant='outline'
                        size='icon'
                        className='col-span-1 flex-shrink-0'>
                        <XIcon className='size-4' />
                      </Button>
                    )}
                    <SortMenu
                      defaultValues={defaultValues}
                      handleSort={handleSort}
                      filter={filter}
                    />
                  </div>
                );
              }

              if (isSelectMeta(filter.meta)) {
                return (
                  <div
                    className='flex gap-1.5 items-center justify-between'
                    key={filter.meta.name}>
                    <input
                      type='hidden'
                      name={filter.meta.name}
                      readOnly
                      value={defaultValues[filter.meta.name]?.toString() ?? ""}
                    />
                    <Select
                      value={defaultValues[filter.meta.name]?.toString() ?? ""}
                      onValueChange={(value) => {
                        if (filter.meta && "name" in filter.meta) {
                          setDefaultValues({
                            ...defaultValues,
                            [filter.meta.name?.toString()]: value,
                          });
                        }
                      }}>
                      <SelectTrigger
                        className={
                          defaultValues[filter.meta.name]?.toString()
                            ? ""
                            : "text-muted-foreground"
                        }>
                        <SelectValue placeholder={filter.meta.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {filter.meta.options?.map((option) => (
                            <SelectItem
                              value={option.value}
                              key={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {defaultValues[filter.meta.name] && (
                      <Button
                        type='button'
                        onClick={() => {
                          if (filter.meta && "name" in filter.meta) {
                            setDefaultValues({
                              ...defaultValues,
                              [filter.meta.name?.toString()]: "",
                            });
                          }
                        }}
                        variant='outline'
                        size='icon'
                        className='col-span-1 flex-shrink-0'>
                        <XIcon className='size-4' />
                      </Button>
                    )}
                    <SortMenu
                      defaultValues={defaultValues}
                      handleSort={handleSort}
                      filter={filter}
                    />
                  </div>
                );
              }

              if (isDateMeta(filter.meta)) {
                return (
                  <div
                    className='flex gap-1.5 items-center justify-between'
                    key={filter.meta.name}>
                    <Input
                      name={filter.meta.name}
                      placeholder={filter.meta.placeholder}
                      type='date'
                      value={defaultValues[filter.meta.name]?.toString() ?? ""}
                      onChange={handleChange}
                      className='col-span-3'
                    />
                    {defaultValues[filter.meta.name] && (
                      <Button
                        type='button'
                        name={filter.meta.name?.toString()}
                        onClick={handleRemove}
                        variant='outline'
                        size='icon'
                        className='col-span-1 flex-shrink-0'>
                        <XIcon className='size-4' />
                      </Button>
                    )}
                    <SortMenu
                      defaultValues={defaultValues}
                      handleSort={handleSort}
                      filter={filter}
                    />
                  </div>
                );
              }

              if (isSortOnlyMeta(filter.meta)) {
                return (
                  <div
                    className='flex gap-1.5 items-center justify-between'
                    key={filter.meta.name}>
                    <Input
                      readOnly
                      placeholder={"Sort by " + filter.meta.placeholder}
                      name={filter.meta.name}
                      className='col-span-3 text-foreground'
                    />
                    {defaultValues[filter.meta.name] && (
                      <Button
                        type='button'
                        name={filter.meta.name?.toString()}
                        onClick={handleRemove}
                        variant='outline'
                        size='icon'
                        className='col-span-1 flex-shrink-0'>
                        <XIcon className='size-4' />
                      </Button>
                    )}
                    <SortMenu
                      defaultValues={defaultValues}
                      handleSort={handleSort}
                      filter={filter}
                    />
                  </div>
                );
              }
            })}
          </div>
          <DialogFooter className='mt-2'>
            <Button
              type='button'
              variant='destructive'
              size='sm'
              className='mt-2 sm:mt-0 sm:ml-auto'
              onClick={handleReset}>
              Clear All
            </Button>
            <Button
              type='submit'
              size='sm'>
              Apply
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SortMenu<T, V>({
  defaultValues,
  handleSort,
  filter,
}: SortMenuProps<T, V>) {
  if (!filter.meta || !("sortable" in filter.meta) || !filter.meta.sortable)
    return null;
  return (
    <React.Fragment>
      <input
        type='hidden'
        name='orderBy'
        readOnly
        value={defaultValues.orderBy?.toString() ?? ""}
      />
      <input
        type='hidden'
        name='orderDir'
        readOnly
        value={defaultValues.orderDir?.toString() ?? ""}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type='button'
            variant={
              defaultValues.orderBy?.toString() === filter.accessorKey
                ? "default"
                : "outline"
            }
            size='icon'
            className={"col-span-1 flex-shrink-0"}>
            {defaultValues.orderBy === filter.accessorKey &&
              defaultValues.orderDir === "asc" && (
                <ArrowUpNarrowWideIcon className='size-4' />
              )}
            {defaultValues.orderBy === filter.accessorKey &&
              defaultValues.orderDir === "desc" && (
                <ArrowDownNarrowWideIcon className='size-4' />
              )}
            {defaultValues.orderBy !== filter.accessorKey && (
              <ArrowUpDownIcon className='size-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className={
                defaultValues.orderBy === filter.accessorKey &&
                defaultValues.orderDir === "asc"
                  ? "bg-muted font-semibold"
                  : ""
              }
              onClick={() => handleSort(filter.accessorKey?.toString(), "asc")}>
              <span>Ascending</span>
              <DropdownMenuShortcut>
                <ArrowUpNarrowWideIcon className='size-4' />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={
                defaultValues.orderBy === filter.accessorKey &&
                defaultValues.orderDir === "desc"
                  ? "bg-muted font-semibold"
                  : ""
              }
              onClick={() => handleSort(filter.accessorKey.toString(), "desc")}>
              <span>Descending</span>
              <DropdownMenuShortcut>
                <ArrowDownNarrowWideIcon className='size-4' />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={
                !(
                  defaultValues.orderDir &&
                  defaultValues.orderBy === filter.accessorKey
                )
              }
              onClick={() =>
                handleSort(filter.accessorKey.toString(), "clear")
              }>
              <span>Clear</span>
              <DropdownMenuShortcut>
                <TrashIcon className='size-4' />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </React.Fragment>
  );
}

interface BaseMeta {
  className?: string;
}

type TextMeta = BaseMeta & {
  type: "text";
  name: string;
  placeholder: string;
  sortable?: boolean;
};

type RangeMeta = BaseMeta & {
  type: "range";
  name: [string, string];
  placeholder: [string, string];
  sortable?: boolean;
};

type SelectMeta = BaseMeta & {
  type: "select";
  name: string;
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
  sortable?: boolean;
};

type DateMeta = BaseMeta & {
  type: "date";
  name: string;
  placeholder: string;
  sortable?: boolean;
};

type SortOnlyMeta = BaseMeta & {
  type: "sort-only";
  name: string;
  placeholder: string;
  sortable?: boolean;
};

type FallbackMeta = BaseMeta & {
  type?: undefined;
};

type ColumnMeta =
  | TextMeta
  | RangeMeta
  | SelectMeta
  | DateMeta
  | SortOnlyMeta
  | FallbackMeta;

type BaseColumn<T, V> = ColumnDef<T, V> & {
  accessorKey: keyof T;
  header: string;
  meta?: ColumnMeta;
  initialState?: TableOptions<T>["initialState"];
};

export type DataTableColumnProps<T, V = unknown> = BaseColumn<T, V> & {
  meta?: ColumnMeta;
};

export interface SortMenuProps<T, V> {
  defaultValues: Record<string, FormDataEntryValue>;
  handleSort: (name: string, dir: "asc" | "desc" | "clear") => void;
  filter: DataTableColumnProps<T, V>;
}

function isTextMeta(meta?: ColumnMeta): meta is TextMeta {
  if (!meta) return false;
  return meta.type === "text";
}

function isRangeMeta(meta?: ColumnMeta): meta is RangeMeta {
  if (!meta) return false;
  return meta.type === "range";
}

function isSelectMeta(meta?: ColumnMeta): meta is SelectMeta {
  if (!meta) return false;
  return meta.type === "select";
}

function isDateMeta(meta?: ColumnMeta): meta is DateMeta {
  if (!meta) return false;
  return meta.type === "date";
}

function isSortOnlyMeta(meta?: ColumnMeta): meta is SortOnlyMeta {
  if (!meta) return false;
  return meta.type === "sort-only";
}
