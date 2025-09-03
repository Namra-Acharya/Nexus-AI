import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";

export default function QuickExport(){
  const [title, setTitle] = useState("Untitled");
  const [text, setText] = useState("");

  const exportPDF = async () => {
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    const margin = 40; const width = 515;
    doc.setFontSize(16); doc.text(title, margin, 60);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text || '', width);
    doc.text(lines, margin, 90);
    doc.save(`${title || 'note'}.pdf`);
  };

  const exportDOCX = async () => {
    const paragraphs = (text || '').split(/\n+/).map(t=> new Paragraph(t));
    const doc = new Document({ sections:[{ children:[ new Paragraph({ text: title, heading: 'Heading1' as any }), ...paragraphs ] }] });
    const blob = await Packer.toBlob(doc);
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${title || 'note'}.docx`; a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportMD = () => {
    const blob = new Blob([`# ${title}\n\n${text}`], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${title || 'note'}.md`; a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Quick Export</CardTitle>
        <CardDescription>Paste AI answers or notes → export to PDF / DOCX / Markdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
          <Textarea rows={10} value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your content here..." />
          <div className="flex flex-wrap gap-2">
            <Button variant="brand" onClick={exportPDF}>Export PDF</Button>
            <Button variant="brand" onClick={exportDOCX}>Export DOCX</Button>
            <Button variant="outline" onClick={exportMD}>Export Markdown</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
