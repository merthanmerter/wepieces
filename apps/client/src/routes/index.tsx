import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <p className='mt-4 text-muted-foreground max-w-2xl mx-auto'>
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
            className='mt-8 font-bold bg-gradient-to-r 
            from-red-500 via-purple-500 to-blue-500 animate-bg
            hover:from-red-500/75 hover:via-purple-500/75 hover:to-blue-500/75'
            asChild>
            <Link to='/hub'>Enter to the hub</Link>
          </Button>
        </div>

        <div className='grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 text-xs select-none'>
          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#fbf0df]'>Bun</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Bun is an all-in-one JavaScript runtime & toolkit designed for
                speed, complete with a bundler, test runner, and
                Node.js-compatible package manager.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#e36002]'>Hono</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Fast, lightweight, built on Web Standards. Support for any
                JavaScript runtime.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#398ccb]'>tRPC</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                tRPC allows you to easily build & consume fully typesafe APIs
                without schemas or code generation.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#4b76dd]'>Træfik</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Simplify and automate the discovery, routing, and load balancing
                of microservices.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#1d63ed]'>Docker</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Docker helps developers build, share, run, and verify
                applications anywhere — without tedious environment
                configuration or management.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#58c4dc]'>React</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                React lets you build user interfaces out of individual pieces
                called components.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base bg-clip-text text-transparent bg-gradient-to-r from-[#b933f8] to-[#ffd32b]'>
                Vite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                A dev server that serves your source files over native ES
                modules, with rich built-in features and astonishingly fast Hot
                Module Replacement (HMR).
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base bg-clip-text text-transparent bg-gradient-to-r from-[#e7b30a] via-[#87b551] to-[#16b8a4]'>
                Tanstack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Headless, type-safe, & powerful utilities for Web Applications,
                Routing, State Management, Data Visualization, Datagrids/Tables,
                and more.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#a3a3a3]'>Jotai</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Build state by combining atoms and renders are automatically
                optimized based on atom dependency.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#c5f74f]'>
                Drizzle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Drizzle lets you build your project the way you want, without
                interfering with your project or structure.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base'>
                <span className='text-[#6293bc]'>PostgreSQL</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                PostgreSQL is a powerful, open source object-relational database
                system.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#274d82]'>Zod</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Zod is a TypeScript-first schema declaration and validation
                library.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#ffffff]'>Jose</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                jose is JavaScript module for JSON Object Signing and
                Encryption.
              </p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#38bdf8]'>
                Tailwind
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Most popular utility-first CSS framework.</p>
            </CardContent>
          </Card>

          <Card className='hover:bg-card/10 transition-colors duration-500 min-h-[180px]'>
            <CardHeader>
              <CardTitle className='text-base text-[#ffffff]'>
                ShadcnUI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Beautifully designed components that you can copy and paste into
                your apps.
              </p>
            </CardContent>
          </Card>
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
