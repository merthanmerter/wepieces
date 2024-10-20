import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hub/")({
  component: Page,
});

export default function Page() {
  return <div>Hello from hub</div>;
}
