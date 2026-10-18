import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode; fallbackTitle?: string };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Page crashed:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">{this.props.fallbackTitle ?? "This page failed to load"}</h2>
        <p className="mt-2 break-words text-sm text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
        <Button className="mt-5 gap-2" variant="outline" onClick={() => this.setState({ error: null })}>
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
      </div>
    );
  }
}
