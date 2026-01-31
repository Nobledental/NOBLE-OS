'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, FileImage, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Asset {
    id: string;
    type: string;
    url: string;
    metadata?: any;
    created_at: string;
}

export default function MediaVault({ patientId }: { patientId: string }) {
    const [uploading, setUploading] = useState(false);
    const queryClient = useQueryClient();

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['clinical-assets', patientId],
        queryFn: async () => {
            const response = await fetch(`/api/clinical/assets/patient/${patientId}`);
            return response.json();
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);

            // In production, use proper file upload service (S3, Cloudinary, etc.)
            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const { url } = await uploadResponse.json();

            const assetType = file.type.includes('image') ? 'PHOTO_CLINICAL' : 'XRAY_IOPA';

            return fetch('/api/clinical/assets/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clinicId: 'current-clinic-id', // Replace with actual clinic ID
                    patientId,
                    type: assetType,
                    url,
                    metadata: { filename: file.name, size: file.size }
                })
            }).then(res => res.json());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinical-assets', patientId] });
            toast.success('File uploaded successfully');
            setUploading(false);
        },
        onError: () => {
            toast.error('Upload failed');
            setUploading(false);
        }
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        for (const file of Array.from(files)) {
            await uploadMutation.mutateAsync(file);
        }
    };

    const getAssetIcon = (type: string) => {
        if (type.includes('PHOTO')) return <ImageIcon className="w-4 h-4" />;
        return <FileImage className="w-4 h-4" />;
    };

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Media Vault</h3>
                <label htmlFor="file-upload">
                    <Button disabled={uploading} asChild>
                        <span className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload'}
                        </span>
                    </Button>
                    <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>

            {
                isLoading ? (
                    <div className="text-center text-muted-foreground py-8">Loading assets...</div>
                ) : assets.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No clinical photos or X-rays uploaded yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {assets.map((asset: Asset) => (
                            <div key={asset.id} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                    <img
                                        src={asset.url}
                                        alt={asset.type}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute top-2 left-2">
                                    <div className="bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                        {getAssetIcon(asset.type)}
                                        {asset.type}
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </Card >
    );
}
