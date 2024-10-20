import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookTextIcon, GithubIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className='grid h-dvh w-full justify-center items-center p-6 overflow-y-auto'>
      <div className='mx-auto container space-y-12'>
        <div className='block text-center'>
          <p
            className='text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
            from-red-500 via-purple-500 to-blue-500 animate-bg'>
            WEPIECES
          </p>
          <p className='mt-4 text-muted-foreground max-w-2xl mx-auto text-justify'>
            WEPIECES is a highly inspired application starter kit based on{" "}
            <a
              className='text-[#bb33ff]'
              href='https://create.t3.gg/'
              target='_blank'>
              create-t3-app
            </a>
            . It’s 100% production ready and built with technologies like Bun,
            Hono, Træfik, Docker, React, tRPC, Drizzle, Jotai, Zod, Tailwind,
            Jose, and more. The goal of this project is to provide a modern web
            application framework that doesn't require features like server-side
            rendering (SSR) or search engine optimization (SEO). It’s an ideal
            choice for fast and simple deployment using Docker or even Bun
            executables, requiring little to no configuration.
          </p>
          <Button
            className='mt-8'
            asChild>
            <Link to='/hub'>Enter to the hub</Link>
          </Button>
        </div>

        <div className='flex gap-4 items-center justify-center text-muted-foreground'>
          <a
            href='https://github.com/merthanmerter/wepieces'
            className='flex items-center gap-1 text-sm hover:text-foreground'>
            <GithubIcon className='h-4 w-4' /> Github
          </a>
          <a
            href='https://github.com/merthanmerter/wepieces'
            className='flex items-center gap-1 text-sm hover:text-foreground'>
            <BookTextIcon className='h-4 w-4' /> Docs
          </a>
        </div>
      </div>
    </div>
  );
}
