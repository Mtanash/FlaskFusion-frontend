import { Button } from "@/components/ui/button";
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class MyErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>
            There was an error.
            <span role="img" aria-label="sad">
              😢
            </span>
          </h1>
          <p>
            Please try refreshing the page.
            <span role="img" aria-label="refresh">
              🔄
            </span>{" "}
            or click the button below to reload.
            <span role="img" aria-label="support">
              📞
            </span>
          </p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </>
      );
    }

    return this.props.children;
  }
}

export default MyErrorBoundary;
