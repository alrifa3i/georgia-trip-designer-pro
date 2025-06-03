
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';
import { useBookingManagement } from '@/hooks/useBookingManagement';

interface FileUploadSectionProps {
  bookingId: string;
  adults: number;
  hasTravelInsurance: boolean;
}

interface UploadedFile {
  id?: string;
  name: string;
  type: 'passport' | 'ticket';
  url?: string;
  uploading?: boolean;
}

export const FileUploadSection = ({ bookingId, adults, hasTravelInsurance }: FileUploadSectionProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { uploadFile, loading } = useBookingManagement();

  const handleFileUpload = async (file: File, type: 'passport' | 'ticket', personIndex?: number) => {
    if (!bookingId) {
      console.warn('No booking ID available for file upload');
      return;
    }

    const fileName = personIndex !== undefined 
      ? `${type}_person_${personIndex + 1}_${file.name}` 
      : `${type}_${file.name}`;

    // Add temporary file to show uploading state
    const tempFile: UploadedFile = {
      name: fileName,
      type,
      uploading: true
    };
    setUploadedFiles(prev => [...prev, tempFile]);

    try {
      const fileUrl = await uploadFile(bookingId, file, type);
      if (fileUrl) {
        // Update the file with success state
        setUploadedFiles(prev => 
          prev.map(f => 
            f.name === fileName && f.uploading 
              ? { ...f, url: fileUrl, uploading: false }
              : f
          )
        );
      } else {
        // Remove failed upload
        setUploadedFiles(prev => prev.filter(f => !(f.name === fileName && f.uploading)));
      }
    } catch (error) {
      console.error('File upload error:', error);
      // Remove failed upload
      setUploadedFiles(prev => prev.filter(f => !(f.name === fileName && f.uploading)));
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          رفع المستندات المطلوبة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ticket Upload */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-blue-800">رفع التذكرة</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'ticket');
              }}
              className="hidden"
              id="ticket-upload"
            />
            <Label htmlFor="ticket-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">اضغط لرفع التذكرة</span>
                <span className="text-xs text-gray-500">(PDF, JPG, PNG)</span>
              </div>
            </Label>
          </div>
        </div>

        {/* Passport Upload */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-green-800">رفع الجواز الأساسي</Label>
          <p className="text-sm text-gray-600">
            برفع الجواز أنت توافق على استخدامه لتثبيت الحجز في الفنادق
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'passport');
              }}
              className="hidden"
              id="passport-upload"
            />
            <Label htmlFor="passport-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">اضغط لرفع الجواز</span>
                <span className="text-xs text-gray-500">(PDF, JPG, PNG)</span>
              </div>
            </Label>
          </div>
        </div>

        {/* Additional Passports for Travel Insurance */}
        {hasTravelInsurance && adults > 1 && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-orange-800">
              جوازات إضافية للتأمين ({adults - 1} مطلوب)
            </Label>
            <p className="text-sm text-gray-600">
              يرجى رفع جوازات باقي المسافرين للتأمين
            </p>
            {Array.from({ length: adults - 1 }, (_, index) => (
              <div key={index} className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'passport', index + 1);
                  }}
                  className="hidden"
                  id={`passport-upload-${index + 1}`}
                />
                <Label htmlFor={`passport-upload-${index + 1}`} className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-6 h-6 text-orange-400" />
                    <span className="text-sm text-gray-600">جواز المسافر {index + 2}</span>
                    <span className="text-xs text-gray-500">(PDF, JPG, PNG)</span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold">الملفات المرفوعة</Label>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {file.uploading ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      file.type === 'passport' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {file.type === 'passport' ? 'جواز' : 'تذكرة'}
                    </span>
                  </div>
                  {!file.uploading && (
                    <Button
                      onClick={() => removeFile(file.name)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center text-blue-600">
            جارٍ رفع الملف...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
