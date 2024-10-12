import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hub/_root/")({
  component: Page,
});

export default function Page() {
  return <div>Hello</div>;
}
