import { ReactNode } from 'react';
import { Network, Search, FileText, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NodeField } from './NodeField';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-lg border border-border hover:border-foreground transition-colors float-animation">
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
        <div className="text-foreground">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed w-full z-50 backdrop-blur-sm bg-background border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Network className="w-8 h-8 text-foreground transform rotate-45" />
                <Network className="w-8 h-8 text-muted-foreground absolute top-0 left-0 transform rotate-90" />
              </div>
              <span className="text-xl font-semibold">Brainly</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  navigate('/sign-in-page');
                }}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  navigate('/signup-page');
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 dot-grid">
        <NodeField />
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="relative max-w-3xl mx-auto text-center fade-up">
            <h1 className="text-4xl sm:text-6xl font-semibold mb-6">
              Your Digital <span className="italic font-serif">Second Brain</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              Store, organize, and manage all your important information in one place.
              Never lose track of valuable content again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  navigate('/signup-page');
                }}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Sign up for free
              </button>
              <button
                onClick={() => {
                  navigate('/sign-in-page');
                }}
                className="w-full sm:w-auto px-8 py-4 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
              >
                Sign in →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="w-6 h-6" />}
              title="Advanced Search"
              description="Find any piece of information instantly with powerful search capabilities."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Multiple Formats"
              description="Store PDFs, documents, and links in a unified, organized system."
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6" />}
              title="Rich Media Support"
              description="Save and organize YouTube videos, tweets, and other media effortlessly."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to enhance your digital memory?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their information management.
          </p>
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors">
            Sign up now
          </button>
        </div>
      </section>
    </div>
  );
}
