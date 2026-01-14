"use client";

import { showErrorToast, showSuccessToast } from "@/components/layout/snackbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { api, apiRequest } from "@/lib/axios"; // <-- matikan
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface UserProfile {
  id: string;
  username: string;
  role: string;
  status: boolean;
  img_profile: string;
  created_at: string;
  updated_at: string;
}

const DUMMY_PROFILE: UserProfile = {
  id: "user-001",
  username: "Pemimpin",
  role: "pemimpin",
  status: true,
  img_profile: "/assets/defaultprofile.jpg",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function UserProfileForm() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    "/assets/genteng.jpg"
  );
  const [uploadLoading, setUploadLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /** ====== DUMMY FETCH PROFILE ====== */
  useEffect(() => {
    const fetchProfileDummy = async () => {
      try {
        setLoading(true);
        setError(null);

        // simulasi delay
        await new Promise((r) => setTimeout(r, 400));

        setUserData(DUMMY_PROFILE);
        setUsername(DUMMY_PROFILE.username);

        if (DUMMY_PROFILE.img_profile) {
          setPreviewImage(DUMMY_PROFILE.img_profile);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDummy();
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validasi file size (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        showErrorToast("File terlalu besar. Maksimum 1MB");
        return;
      }

      // Validasi file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Format file tidak didukung. Gunakan JPG, JPEG, atau PNG");
        return;
      }

      setError(null);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Auto upload dummy setelah file dipilih
      handleUploadDummy(file, previewUrl);
    }
  };

  /** ====== DUMMY UPLOAD ====== */
  const handleUploadDummy = async (file: File, previewUrl: string) => {
    try {
      setUploadLoading(true);
      setError(null);

      // simulasi request upload (delay)
      await new Promise((r) => setTimeout(r, 900));

      // update "database" state lokal
      const updatedProfile: UserProfile = {
        ...(userData ?? DUMMY_PROFILE),
        img_profile: previewUrl,
        updated_at: new Date().toISOString(),
      };

      setUserData(updatedProfile);
      setUsername(updatedProfile.username);
      setPreviewImage(updatedProfile.img_profile);

      showSuccessToast("Foto profil berhasil diupdate! (dummy)");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengupload foto profil";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  if (loading)
    return (
      <div className="max-w-2xl p-6 bg-white rounded-xl shadow-md">
        Memuat profil...
      </div>
    );

  return (
    <div className="max-w-2xl p-6 bg-white rounded-xl shadow-md space-y-6">
      <div className="flex gap-6 items-start">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="w-full h-60 relative">
            <Image
              src={previewImage}
              alt="avatar"
              sizes="fill"
              fill
              className="w-full rounded-sm object-cover"
              priority
              onError={() => setPreviewImage("/assets/genteng.jpg")}
            />
            {uploadLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white">Mengupload...</div>
              </div>
            )}
          </div>

          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploadLoading}
            ref={fileInputRef}
          />

          <Button
            onClick={handleButtonClick}
            className="w-full rounded-sm font-extralight bg-[#0892D8] hover:bg-[#0892D8]/80 mt-3"
            disabled={uploadLoading}
            type="button"
          >
            {uploadLoading ? "Mengupload..." : "Upload Foto Profile"}
          </Button>

          <p className="text-xs text-gray-500 mt-1 text-center">
            Besar file: maksimum 1 mb. <br />
            Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
          </p>
        </div>

        {/* Form Section */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              type="text"
              value={username || "Loading..."}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value="********"
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="text-xs"
              >
                Coba Lagi
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
