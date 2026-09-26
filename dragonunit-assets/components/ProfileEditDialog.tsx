"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, FileText, Image as ImageIcon, Pencil, Save, UserRound, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ProfileTab = "name" | "bio" | "avatar" | "banner";

type ProfileValues = {
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
};

const tabs: { id: ProfileTab; label: string; icon: typeof Pencil }[] = [
  { id: "name", label: "Name", icon: Pencil },
  { id: "bio", label: "Bio", icon: FileText },
  { id: "avatar", label: "Avatar", icon: UserRound },
  { id: "banner", label: "Banner", icon: ImageIcon },
];

export function ProfileEditDialog({
  open,
  initialValues,
  initialTab = "name",
  onClose,
  onSaved,
}: {
  open: boolean;
  initialValues: ProfileValues;
  initialTab?: ProfileTab;
  onClose: () => void;
  onSaved: (values: ProfileValues) => void;
}) {
  const [tab, setTab] = useState<ProfileTab>(initialTab);
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState<"avatar" | "banner" | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const { displayName, bio, avatarUrl, bannerUrl } = initialValues;

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (!open || !portalTarget) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose, portalTarget]);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setTab(initialTab);
      setError("");
    }
  }, [displayName, bio, avatarUrl, bannerUrl, initialTab, open]);

  if (!open || !portalTarget) return null;

  function updateValue<K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function uploadProfileImage(event: ChangeEvent<HTMLInputElement>, kind: "avatar" | "banner") {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or AVIF image.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setUploadingImage(kind);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Sign in again to change your profile image.");
        return;
      }

      const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
      const folder = kind === "avatar" ? "avatars" : "banners";
      const path = `${user.id}/${folder}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { contentType: file.type, cacheControl: "3600" });

      if (uploadError) {
        setError(uploadError.message.includes("Bucket not found")
          ? "Profile image storage is not set up yet. Apply supabase/avatars.sql first."
          : uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      updateValue(kind === "avatar" ? "avatarUrl" : "bannerUrl", data.publicUrl);
    } catch {
      setError("The image could not be uploaded. Please try again.");
    } finally {
      setUploadingImage(null);
      event.target.value = "";
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const displayName = values.displayName.trim();
    if (!displayName) {
      setError("Enter a display name before saving.");
      setTab("name");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        bio: values.bio.trim(),
        avatar_url: values.avatarUrl.trim(),
        banner_url: values.bannerUrl.trim(),
      },
    });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    onSaved({ ...values, displayName });
  }

  return createPortal(
    <div
      className="profile-dialog-backdrop fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
        tabIndex={-1}
        className="profile-dialog-panel my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[#303342] bg-[#111218] shadow-2xl shadow-black/60 outline-none"
      >
        <div className="flex items-start justify-between border-b border-[#292B36] px-5 py-4 sm:px-6">
          <div>
            <h2 id="profile-dialog-title" className="text-xl font-semibold text-[#F5F7FA]">Edit profile</h2>
            <p className="mt-1 text-sm text-[#858A99]">Update your public profile details.</p>
          </div>
          <button
            type="button"
            aria-label="Close edit profile"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#303342] text-[#9AA1AE] transition hover:border-[#8B5CF6]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={saveProfile}>
          <div role="tablist" aria-label="Profile fields" className="grid grid-cols-4 gap-1 border-b border-[#292B36] p-3 sm:px-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`profile-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={tab === id}
                aria-controls="profile-tab-panel"
                onClick={() => setTab(id)}
                className={`flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 text-xs font-medium capitalize transition sm:text-sm ${tab === id ? "bg-[#282832] text-white" : "text-[#8B8F9C] hover:bg-[#1A1B23] hover:text-[#D6D9E0]"}`}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div id="profile-tab-panel" role="tabpanel" aria-labelledby={`profile-tab-${tab}`} className="min-h-44 px-5 py-6 sm:px-6">
            {tab === "name" && (
              <>
                <label htmlFor="profile-display-name" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#969AA7]">Display name</label>
                <input
                  id="profile-display-name"
                  autoFocus
                  value={values.displayName}
                  onChange={(event) => updateValue("displayName", event.target.value)}
                  maxLength={30}
                  placeholder="Enter display name"
                  className="mt-2 h-12 w-full rounded-lg border border-[#303342] bg-[#18191F] px-3.5 text-sm text-[#F5F7FA] outline-none transition placeholder:text-[#666A76] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
                <p className="mt-2 text-right text-xs text-[#737784]">{values.displayName.length}/30</p>
              </>
            )}
            {tab === "bio" && (
              <>
                <label htmlFor="profile-bio" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#969AA7]">Bio</label>
                <textarea
                  id="profile-bio"
                  value={values.bio}
                  onChange={(event) => updateValue("bio", event.target.value)}
                  maxLength={160}
                  rows={4}
                  placeholder="A little about you"
                  className="mt-2 w-full resize-y rounded-lg border border-[#303342] bg-[#18191F] px-3.5 py-3 text-sm text-[#F5F7FA] outline-none transition placeholder:text-[#666A76] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
                <p className="mt-2 text-right text-xs text-[#737784]">{values.bio.length}/160</p>
              </>
            )}
            {tab === "avatar" && (
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 grid size-24 place-items-center overflow-hidden rounded-full border border-[#0B6877]/60 bg-[#0D0F15] text-[#858A99] shadow-[0_0_0_4px_rgba(11,104,119,0.08)]">
                  {values.avatarUrl ? (
                    <Image src={values.avatarUrl} alt="Profile photo preview" fill unoptimized className="object-cover" />
                  ) : (
                    <UserRound className="size-9" />
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) => uploadProfileImage(event, "avatar")}
                  className="sr-only"
                  tabIndex={-1}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingImage !== null}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#303342] bg-[#18191F] text-sm font-medium text-[#D6D9E0] transition hover:border-[#0B6877] hover:bg-[#1D2028] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-wait disabled:opacity-60"
                >
                  <Camera className="size-4" /> {uploadingImage === "avatar" ? "Uploading photo..." : "Change photo"}
                </button>
                <p className="mt-3 text-xs text-[#737784]">JPEG, PNG, WebP, or AVIF. Maximum file size 5 MB.</p>
              </div>
            )}
            {tab === "banner" && (
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 flex aspect-[3/1] min-h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-[#303342] bg-[#202126] text-sm text-[#858A99]">
                  {values.bannerUrl ? (
                    <Image src={values.bannerUrl} alt="Profile banner preview" fill unoptimized className="object-cover" />
                  ) : (
                    <span>No banner set</span>
                  )}
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) => uploadProfileImage(event, "banner")}
                  className="sr-only"
                  tabIndex={-1}
                />
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={uploadingImage !== null}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#303342] bg-[#18191F] text-sm font-medium text-[#D6D9E0] transition hover:border-[#0B6877] hover:bg-[#1D2028] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-wait disabled:opacity-60"
                >
                  <ImageIcon className="size-4" /> {uploadingImage === "banner" ? "Uploading banner..." : "Upload banner"}
                </button>
                <p className="mt-3 text-xs text-[#737784]">JPEG, PNG, WebP, or AVIF. Maximum 5 MB. Recommended: 600 × 200 px.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#292B36] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p role="status" className="min-h-5 text-sm text-[#E69A9A]">{error}</p>
            <div className="flex shrink-0 gap-2 sm:ml-auto">
              <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#303342] px-4 text-sm font-medium text-[#A6A9B3] transition hover:bg-[#1A1B23] hover:text-white">Cancel</button>
              <button type="submit" disabled={saving || uploadingImage !== null} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0B6877] px-5 text-sm font-semibold text-white transition hover:bg-[#0D7B8B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-wait disabled:opacity-60">
                <Save className="size-4" /> {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    portalTarget,
  );
}
