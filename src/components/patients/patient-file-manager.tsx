"use client";

import { FileText, Image as ImageIcon, File, Download, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientFile } from "@/lib/data/patient-db";

const FileIcon = ({ type }: { type: PatientFile['type'] }) => {
    switch (type) {
        case 'xray': return <ImageIcon className="w-5 h-5 text-purple-500" />;
        case 'report': return <FileText className="w-5 h-5 text-blue-500" />;
        case 'prescription': return <File className="w-5 h-5 text-green-500" />;
        default: return <File className="w-5 h-5 text-gray-500" />;
    }
};

export function PatientFileManager({ files }: { files: PatientFile[] }) {
    if (files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl bg-slate-50">
                <p className="text-slate-400 text-sm">No files uploaded</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100">
                            <FileIcon type={file.type} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">{file.name}</p>
                            <p className="text-xs text-slate-400">{file.date} • {file.size}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-green-600">
                            <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
