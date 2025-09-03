import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function Support() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Support</h1>
        <p className="text-sm text-gray-500 mb-8">We’re here to help you get the most from Nexus.</p>

        <div className="prose prose-gray max-w-none">
          <h2>Get Help</h2>
          <p>
            Check FAQs, report a bug, or request a feature. Our team responds as quickly as possible.
          </p>
          <ul>
            <li>Email: support@nexus.example</li>
            <li>Response time: within 2 business days</li>
          </ul>

          <h2>Common Topics</h2>
          <ul>
            <li>Account access and password issues</li>
            <li>Using Smart Notes, Converters, and Calculators</li>
            <li>Group collaboration and sharing</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:support@nexus.example">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
