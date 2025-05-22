import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
      <h1 className="text-7xl font-bold text-primary mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you were looking for. Please check the URL or
        navigate back to the dashboard.
      </p>
      <Button asChild size="lg">
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}