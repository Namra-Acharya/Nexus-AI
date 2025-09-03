import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-gray max-w-none">
          <h2>Agreement</h2>
          <p>
            By using this website, you agree to these terms. If you do not agree, do not use the service.
          </p>

          <h2>Use of Service</h2>
          <ul>
            <li>Do not misuse the tools or attempt to disrupt the service.</li>
            <li>You are responsible for content you create and share.</li>
            <li>We may update features and interfaces without prior notice.</li>
          </ul>

          <h2>Accounts</h2>
          <ul>
            <li>Keep your credentials secure and do not share them.</li>
            <li>We may suspend accounts that violate policies or laws.</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            Content, branding, and software are owned by us or our licensors. You retain rights to your own content.
          </p>

          <h2>Disclaimers</h2>
          <p>
            The service is provided “as is.” We do not guarantee uninterrupted availability or error-free operation.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we are not liable for indirect or consequential damages.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, contact support@nexus.example.
          </p>
        </div>
      </div>
    </Layout>
  );
}
