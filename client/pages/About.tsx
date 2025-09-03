import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">About Nexus</h1>
        <p className="text-sm text-gray-500 mb-8">Built to help students study smarter with AI-powered tools.</p>

        <div className="prose prose-gray max-w-none">
          <h2>Our Mission</h2>
          <p>
            Empower learners with fast, reliable tools for calculations, conversions, research, and collaboration.
          </p>

          <h2>What We Offer</h2>
          <ul>
            <li>AI assistance for research and writing</li>
            <li>Smart productivity tools like To‑Do and Global Search</li>
            <li>Converters, calculators, and study aids</li>
          </ul>

          <h2>Values</h2>
          <ul>
            <li>Privacy-first design</li>
            <li>Mobile performance and accessibility</li>
            <li>Continuous improvement</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
