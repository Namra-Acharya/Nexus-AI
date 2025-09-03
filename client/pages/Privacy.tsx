import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-gray max-w-none">
          <h2>Overview</h2>
          <p>
            We value your privacy. This policy explains what data we collect, how we use it, and your rights.
          </p>

          <h2>Information We Collect</h2>
          <ul>
            <li>Account data you provide (name, email) when you sign up.</li>
            <li>Usage data to improve performance and reliability.</li>
            <li>Content you create in tools like notes or groups, stored locally or in our database where applicable.</li>
          </ul>

          <h2>How We Use Information</h2>
          <ul>
            <li>Provide and improve our tools and features.</li>
            <li>Secure the platform and prevent abuse.</li>
            <li>Communicate account and service updates.</li>
          </ul>

          <h2>Data Storage and Security</h2>
          <p>
            We use industry-standard security practices. Some features store data only in your browser (e.g., local notes), while others store data on our servers. We do not sell your personal data.
          </p>

          <h2>Your Rights</h2>
          <ul>
            <li>Access, update, or delete your account information.</li>
            <li>Export or remove your content where supported.</li>
            <li>Contact us for privacy requests at support@nexus.example.</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            We may integrate third-party services (e.g., analytics, hosting). Their use is governed by their respective policies.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this policy to reflect improvements. Material changes will be announced in-app.
          </p>
        </div>
      </div>
    </Layout>
  );
}
