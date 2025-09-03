import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GroupHub from "./productivity/GroupHub";
import { Users } from "lucide-react";

export default function GroupHubPage(){
  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Group Hub
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Collaborate with Friends</h1>
            <p className="text-gray-600">Create or join groups, and share notes, links, and files in one place.</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Shared Workspace</CardTitle>
              <CardDescription>Invite friends and keep all study resources together</CardDescription>
            </CardHeader>
            <CardContent>
              <GroupHub />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
