
import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Briefcase,
    Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://127.0.0.1:8000/api";

interface Service {
    id: number;
    title: string;
    title_ar: string | null;
    title_en: string | null;
    description: string | null;
    description_ar: string | null;
    description_en: string | null;
    icon?: string;
    is_active?: boolean;
    sort_order?: number;
}

const emptyForm = {
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    icon: "",
    is_active: true,
    sort_order: 0,
};

export function ServicesManager() {
    const { language, dir } = useLanguage();
    const isAr = language === "ar";

    const text = {
        title: isAr ? "الخدمات" : "Services",
        subtitle: isAr
            ? "إدارة خدماتك باللغتين العربية والإنجليزية."
            : "Manage your services in Arabic and English.",
        add: isAr ? "إضافة خدمة" : "Add Service",
        all: isAr ? "جميع الخدمات" : "All Services",
        serviceCount: isAr ? "خدمة" : "Services",
        noServices: isAr ? "لا توجد خدمات حتى الآن" : "No services yet",
        startAdding: isAr
            ? "ابدأ بإضافة خدمتك الأولى."
            : "Start by adding your first service.",
        addFirst: isAr ? "إضافة أول خدمة" : "Add your first service",
        active: isAr ? "نشطة" : "Active",
        inactive: isAr ? "غير نشطة" : "Inactive",
        edit: isAr ? "تعديل" : "Edit",
        delete: isAr ? "حذف" : "Delete",
        editService: isAr ? "تعديل الخدمة" : "Edit Service",
        addNew: isAr ? "إضافة خدمة جديدة" : "Add New Service",
        arabicContent: isAr ? "المحتوى العربي" : "Arabic Content",
        englishContent: isAr ? "المحتوى الإنجليزي" : "English Content",
        arabicTitle: isAr ? "عنوان الخدمة بالعربي" : "Arabic Service Title",
        arabicDescription: isAr ? "وصف الخدمة بالعربي" : "Arabic Service Description",
        englishTitle: isAr ? "عنوان الخدمة بالإنجليزية" : "English Service Title",
        englishDescription: isAr ? "وصف الخدمة بالإنجليزية" : "English Service Description",
        arabicTitlePlaceholder: "مثال: تصميم الهوية البصرية",
        arabicDescriptionPlaceholder: "اكتب وصف الخدمة بالعربي...",
        englishTitlePlaceholder: "e.g. Brand Identity Design",
        englishDescriptionPlaceholder: "Describe this service...",
        icon: isAr ? "اسم الأيقونة (اختياري)" : "Icon Name (Optional)",
        iconPlaceholder: "e.g. Palette",
        sortOrder: isAr ? "ترتيب العرض" : "Sort Order",
        showOnWebsite: isAr
            ? "إظهار هذه الخدمة على الموقع"
            : "Show this service on the website",
        cancel: isAr ? "إلغاء" : "Cancel",
        save: isAr ? "حفظ الخدمة" : "Save Service",
        saving: isAr ? "جارٍ الحفظ..." : "Saving...",
        loading: isAr ? "جارٍ تحميل الخدمات..." : "Loading services...",
        loadError: isAr ? "فشل تحميل الخدمات." : "Failed to load services.",
        genericError: isAr ? "حدث خطأ غير متوقع." : "Something went wrong.",
        requiredFields: isAr
            ? "يرجى تعبئة عناوين وأوصاف الخدمة باللغتين العربية والإنجليزية."
            : "Please fill in all Arabic and English title and description fields.",
        saveError: isAr ? "تعذّر حفظ الخدمة." : "Could not save the service.",
        deleteError: isAr ? "تعذّر حذف الخدمة." : "Could not delete the service.",
        confirmDelete: isAr
            ? "هل أنت متأكد من حذف هذه الخدمة؟"
            : "Are you sure you want to delete this service?",
        noArabicDescription: isAr ? "لا يوجد وصف عربي" : "No Arabic description",
        noEnglishDescription: isAr ? "لا يوجد وصف إنجليزي" : "No English description",
    };

    const [services, setServices] = useState<Service[]>([]);
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

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/services`, {
                headers,
            });

            if (!response.ok) {
                throw new Error(text.loadError);
            }

            const data = await response.json();
            setServices(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : text.genericError
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const openAddForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setShowForm(true);
    };

    const openEditForm = (service: Service) => {
        setEditingId(service.id);

        setForm({
            title_ar: service.title_ar || "",
            title_en: service.title_en || service.title || "",
            description_ar: service.description_ar || "",
            description_en:
                service.description_en || service.description || "",
            icon: service.icon || "",
            is_active: service.is_active ?? true,
            sort_order: service.sort_order ?? 0,
        });

        setError("");
        setShowForm(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !form.title_ar.trim() ||
            !form.title_en.trim() ||
            !form.description_ar.trim() ||
            !form.description_en.trim()
        ) {
            setError(text.requiredFields);
            return;
        }

        try {
            setSaving(true);
            setError("");

            const url = editingId
                ? `${API_URL}/services/${editingId}`
                : `${API_URL}/services`;

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

                throw new Error(
                    result.message || text.saveError
                );
            }

            setShowForm(false);
            setForm(emptyForm);
            setEditingId(null);

            await fetchServices();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : text.genericError
            );
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

            const response = await fetch(`${API_URL}/services/${id}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                throw new Error(text.deleteError);
            }

            await fetchServices();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : text.genericError
            );
        }
    };

    return (
        <div dir={dir} className="space-y-6 text-[#302630]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold">{text.title}</h2>
                    <p className="mt-1 text-sm text-[#746673]">
                        {text.subtitle}
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#9878E8] px-5 py-3 font-medium text-white transition hover:bg-[#8563d8]"
                >
                    <Plus size={18} />
                    {text.add}
                </button>
            </div>

            {error && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label={isAr ? "إغلاق الرسالة" : "Close message"}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="rounded-2xl border border-[#EADFE7] bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{text.all}</h3>

                    <span className="rounded-full bg-[#F3A6C8]/20 px-3 py-1 text-sm text-[#746673]">
                        {services.length} {text.serviceCount}
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#746673]">
                        <Loader2
                            className="animate-spin text-[#9878E8]"
                            size={28}
                        />
                        <span className="text-sm">{text.loading}</span>
                    </div>
                ) : services.length === 0 ? (
                    <div className="py-14 text-center">
                        <Briefcase
                            className="mx-auto mb-3 text-[#9878E8]"
                            size={36}
                        />

                        <h3 className="font-semibold">{text.noServices}</h3>

                        <p className="mt-1 text-sm text-[#746673]">
                            {text.startAdding}
                        </p>

                        <button
                            onClick={openAddForm}
                            className="mt-4 text-sm font-semibold text-[#9878E8]"
                        >
                            + {text.addFirst}
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="rounded-xl border border-[#EADFE7] p-5 transition hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3A6C8]/20 text-[#9878E8]">
                                            <Briefcase size={20} />
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className="font-semibold">
                                                {service.title_ar ||
                                                    service.title_en ||
                                                    service.title}
                                            </h4>

                                            <p
                                                className="mt-1 text-sm text-[#746673]"
                                                dir="ltr"
                                            >
                                                {service.title_en ||
                                                    service.title}
                                            </p>

                                            <span
                                                className={`mt-2 inline-block text-xs ${service.is_active === false
                                                    ? "text-gray-400"
                                                    : "text-green-600"
                                                    }`}
                                            >
                                                {service.is_active === false
                                                    ? text.inactive
                                                    : text.active}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => openEditForm(service)}
                                            className="rounded-lg bg-[#9878E8]/10 p-2 text-[#9878E8] hover:bg-[#9878E8]/20"
                                            title={text.edit}
                                            aria-label={text.edit}
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                                            title={text.delete}
                                            aria-label={text.delete}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3 text-sm leading-6 text-[#746673]">
                                    <p dir="rtl">
                                        {service.description_ar ||
                                            service.description ||
                                            text.noArabicDescription}
                                    </p>

                                    <p dir="ltr">
                                        {service.description_en ||
                                            service.description ||
                                            text.noEnglishDescription}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
                    <div className="my-auto w-full max-w-2xl rounded-2xl bg-[#FFF7F0] p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h3 className="text-xl font-bold">
                                {editingId ? text.editService : text.addNew}
                            </h3>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-lg p-2 hover:bg-[#EADFE7]"
                                aria-label={isAr ? "إغلاق" : "Close"}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-4" dir="rtl">
                                    <h4 className="border-b border-[#EADFE7] pb-2 font-bold text-[#9878E8]">
                                        {text.arabicContent}
                                    </h4>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            {text.arabicTitle}
                                        </label>

                                        <input
                                            type="text"
                                            dir="rtl"
                                            value={form.title_ar}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    title_ar: e.target.value,
                                                })
                                            }
                                            placeholder={text.arabicTitlePlaceholder}
                                            className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            {text.arabicDescription}
                                        </label>

                                        <textarea
                                            dir="rtl"
                                            value={form.description_ar}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    description_ar: e.target.value,
                                                })
                                            }
                                            placeholder={text.arabicDescriptionPlaceholder}
                                            rows={5}
                                            className="w-full resize-none rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4" dir="ltr">
                                    <h4 className="border-b border-[#EADFE7] pb-2 font-bold text-[#9878E8]">
                                        {text.englishContent}
                                    </h4>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            {text.englishTitle}
                                        </label>

                                        <input
                                            type="text"
                                            value={form.title_en}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    title_en: e.target.value,
                                                })
                                            }
                                            placeholder={text.englishTitlePlaceholder}
                                            className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            {text.englishDescription}
                                        </label>

                                        <textarea
                                            value={form.description_en}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    description_en: e.target.value,
                                                })
                                            }
                                            placeholder={text.englishDescriptionPlaceholder}
                                            rows={5}
                                            className="w-full resize-none rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.icon}
                                </label>

                                <input
                                    type="text"
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
                                    className="h-4 w-4 accent-[#9878E8]"
                                />
                                {text.showOnWebsite}
                            </label>

                            <div className="flex gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 rounded-xl border border-[#EADFE7] bg-white px-4 py-3 font-medium"
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
