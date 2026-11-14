
import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    RefreshCw,
    ExternalLink,
    Share2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://127.0.0.1:8000/api";

interface SocialLink {
    id: number;
    platform: string;
    url: string;
    icon?: string;
    is_active?: boolean;
    sort_order?: number;
}

const emptyForm = {
    platform: "",
    url: "",
    icon: "",
    is_active: true,
    sort_order: 0,
};

export function SocialLinksManager() {
    const { language, dir } = useLanguage();
    const isAr = language === "ar";

    const text = {
        title: isAr ? "روابط التواصل الاجتماعي" : "Social Links",
        subtitle: isAr
            ? "أديري حسابات التواصل الاجتماعي وروابط المواقع الخاصة بك."
            : "Manage your social media profiles and website links.",
        add: isAr ? "إضافة رابط" : "Add Social Link",
        profiles: isAr ? "حسابات التواصل الخاصة بك" : "Your Social Profiles",
        refresh: isAr ? "تحديث" : "Refresh",
        loading: isAr ? "جارٍ تحميل الروابط..." : "Loading social links...",
        noLinks: isAr ? "لا توجد روابط تواصل حتى الآن" : "No social links yet",
        addFirst: isAr
            ? "أضيفي أول حساب من حسابات التواصل الاجتماعي."
            : "Add your first social media profile.",
        active: isAr ? "مفعّل" : "Active",
        inactive: isAr ? "غير مفعّل" : "Inactive",
        edit: isAr ? "تعديل" : "Edit",
        delete: isAr ? "حذف" : "Delete",
        editTitle: isAr ? "تعديل رابط التواصل" : "Edit Social Link",
        addTitle: isAr ? "إضافة رابط تواصل" : "Add Social Link",
        platform: isAr ? "اسم المنصة" : "Platform Name",
        platformPlaceholder: isAr ? "مثال: Instagram" : "e.g. Instagram",
        url: isAr ? "رابط الحساب" : "Profile URL",
        urlPlaceholder: "https://instagram.com/username",
        icon: isAr ? "اسم الأيقونة (اختياري)" : "Icon Name (Optional)",
        iconPlaceholder: isAr ? "مثال: Instagram" : "e.g. Instagram",
        sortOrder: isAr ? "ترتيب العرض" : "Sort Order",
        showOnWebsite: isAr
            ? "إظهار هذا الرابط على الموقع"
            : "Show this link on the website",
        cancel: isAr ? "إلغاء" : "Cancel",
        saving: isAr ? "جارٍ الحفظ..." : "Saving...",
        save: isAr ? "حفظ الرابط" : "Save Link",
        loadError: isAr
            ? "فشل تحميل روابط التواصل."
            : "Failed to load social links.",
        generalError: isAr ? "حدث خطأ غير متوقع." : "Something went wrong.",
        saveError: isAr
            ? "تعذّر حفظ رابط التواصل."
            : "Could not save social link.",
        deleteError: isAr
            ? "تعذّر حذف رابط التواصل."
            : "Could not delete social link.",
        confirmDelete: isAr
            ? "هل أنت متأكد من حذف رابط التواصل هذا؟"
            : "Are you sure you want to delete this social link?",
    };

    const [links, setLinks] = useState<SocialLink[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("admin_token");

    const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchLinks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/admin/social-links`, {
                headers,
            });

            if (!response.ok) {
                throw new Error(text.loadError);
            }

            const data = await response.json();
            setLinks(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : text.generalError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const openAddForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setShowForm(true);
    };

    const openEditForm = (link: SocialLink) => {
        setEditingId(link.id);
        setForm({
            platform: link.platform || "",
            url: link.url || "",
            icon: link.icon || "",
            is_active: link.is_active ?? true,
            sort_order: link.sort_order ?? 0,
        });
        setError("");
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const url = editingId
                ? `${API_URL}/social-links/${editingId}`
                : `${API_URL}/social-links`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.message || text.saveError);
            }

            closeForm();
            await fetchLinks();
        } catch (err) {
            setError(err instanceof Error ? err.message : text.generalError);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(text.confirmDelete)) {
            return;
        }

        try {
            setError("");

            const response = await fetch(`${API_URL}/social-links/${id}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                throw new Error(text.deleteError);
            }

            await fetchLinks();
        } catch (err) {
            setError(err instanceof Error ? err.message : text.generalError);
        }
    };

    return (
        <div className="space-y-6 text-[#302630]" dir={dir}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold">{text.title}</h2>
                    <p className="mt-1 text-sm text-[#746673]">
                        {text.subtitle}
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#9878E8] px-5 py-3 font-medium text-white hover:bg-[#8563d8]"
                >
                    <Plus size={18} />
                    {text.add}
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
                >
                    <span>{error}</span>
                    <button
                        onClick={() => setError("")}
                        aria-label={isAr ? "إغلاق التنبيه" : "Close alert"}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="rounded-2xl border border-[#EADFE7] bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-semibold">{text.profiles}</h3>
                    <button
                        onClick={fetchLinks}
                        disabled={loading}
                        className="rounded-lg border border-[#EADFE7] p-2 text-[#746673] hover:bg-[#F3A6C8]/10"
                        title={text.refresh}
                        aria-label={text.refresh}
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? "animate-spin" : ""}
                        />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2
                            className="animate-spin text-[#9878E8]"
                            size={28}
                        />
                    </div>
                ) : links.length === 0 ? (
                    <div className="py-14 text-center">
                        <Share2
                            className="mx-auto mb-3 text-[#9878E8]"
                            size={36}
                        />
                        <h3 className="font-semibold">{text.noLinks}</h3>
                        <p className="mt-1 text-sm text-[#746673]">
                            {text.addFirst}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {links.map((link) => (
                            <div
                                key={link.id}
                                className="flex items-center justify-between gap-4 rounded-xl border border-[#EADFE7] p-5"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3A6C8]/20 text-[#9878E8]">
                                        <Share2 size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="font-semibold">
                                            {link.platform}
                                        </h4>

                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            dir="ltr"
                                            className="mt-1 flex items-center gap-1 truncate text-xs text-[#9878E8] hover:underline"
                                        >
                                            <span className="truncate">
                                                {link.url}
                                            </span>
                                            <ExternalLink
                                                size={12}
                                                className="shrink-0"
                                            />
                                        </a>

                                        <span
                                            className={`mt-2 inline-block text-xs ${link.is_active === false
                                                ? "text-gray-400"
                                                : "text-green-600"
                                                }`}
                                        >
                                            {link.is_active === false
                                                ? text.inactive
                                                : text.active}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    <button
                                        onClick={() => openEditForm(link)}
                                        className="rounded-lg bg-[#9878E8]/10 p-2 text-[#9878E8] hover:bg-[#9878E8]/20"
                                        title={text.edit}
                                        aria-label={text.edit}
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                                        title={text.delete}
                                        aria-label={text.delete}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
                    <div className="my-auto w-full max-w-lg rounded-2xl bg-[#FFF7F0] p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold">
                                {editingId ? text.editTitle : text.addTitle}
                            </h3>

                            <button
                                onClick={closeForm}
                                aria-label={text.cancel}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.platform}
                                </label>
                                <input
                                    required
                                    value={form.platform}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            platform: e.target.value,
                                        })
                                    }
                                    placeholder={text.platformPlaceholder}
                                    className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.url}
                                </label>
                                <input
                                    required
                                    type="url"
                                    dir="ltr"
                                    value={form.url}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            url: e.target.value,
                                        })
                                    }
                                    placeholder={text.urlPlaceholder}
                                    className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 text-left outline-none focus:border-[#9878E8]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.icon}
                                </label>
                                <input
                                    value={form.icon}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            icon: e.target.value,
                                        })
                                    }
                                    placeholder={text.iconPlaceholder}
                                    className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.sortOrder}
                                </label>
                                <input
                                    type="number"
                                    value={form.sort_order}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            sort_order: Number(e.target.value),
                                        })
                                    }
                                    className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                />
                            </div>

                            <label className="flex items-center gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            is_active: e.target.checked,
                                        })
                                    }
                                    className="accent-[#9878E8]"
                                />
                                {text.showOnWebsite}
                            </label>

                            <div className="flex gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex-1 rounded-xl border border-[#EADFE7] bg-white px-4 py-3"
                                >
                                    {text.cancel}
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#9878E8] px-4 py-3 font-medium text-white disabled:opacity-60"
                                >
                                    {saving && (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    )}
                                    {saving ? text.saving : text.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
