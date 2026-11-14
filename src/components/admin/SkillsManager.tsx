
import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://127.0.0.1:8000/api";

interface Skill {
    id: number;
    name?: string;
    name_ar?: string;
    name_en?: string;
    category?: string;
    category_ar?: string;
    category_en?: string;
    proficiency?: number;
    level?: number;
    sort_order?: number;
    is_active?: boolean;
}

const emptyForm = {
    name_ar: "",
    name_en: "",
    category_ar: "",
    category_en: "",
    proficiency: 80,
    sort_order: 0,
    is_active: true,
};

export function SkillsManager() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const dir = isAr ? "rtl" : "ltr";

    const text = {
        title: isAr ? "المهارات" : "Skills",
        description: isAr
            ? "إدارة مهاراتك المهنية باللغتين العربية والإنجليزية."
            : "Manage your professional skills in Arabic and English.",
        addSkill: isAr ? "إضافة مهارة" : "Add Skill",
        allSkills: isAr ? "جميع المهارات" : "All Skills",
        skills: isAr ? "مهارات" : "Skills",
        noSkills: isAr ? "لا توجد مهارات بعد" : "No skills yet",
        addFirst: isAr ? "أضف مهارتك الأولى." : "Add your first skill.",
        general: isAr ? "عام" : "General",
        proficiency: isAr ? "مستوى الإتقان" : "Proficiency",
        editSkill: isAr ? "تعديل المهارة" : "Edit Skill",
        addNewSkill: isAr ? "إضافة مهارة جديدة" : "Add New Skill",
        skillNameAr: isAr ? "اسم المهارة (بالعربية)" : "Skill Name (Arabic)",
        skillNameEn: isAr ? "اسم المهارة (بالإنجليزية)" : "Skill Name (English)",
        categoryAr: isAr ? "التصنيف (بالعربية)" : "Category (Arabic)",
        categoryEn: isAr ? "التصنيف (بالإنجليزية)" : "Category (English)",
        skillLevel: isAr ? "مستوى المهارة" : "Skill Level",
        sortOrder: isAr ? "ترتيب العرض" : "Sort Order",
        showSkill: isAr
            ? "إظهار هذه المهارة على الموقع"
            : "Show this skill on the website",
        cancel: isAr ? "إلغاء" : "Cancel",
        save: isAr ? "حفظ المهارة" : "Save Skill",
        saving: isAr ? "جارٍ الحفظ..." : "Saving...",
        loadingError: isAr
            ? "تعذّر تحميل المهارات."
            : "Failed to load skills.",
        saveError: isAr
            ? "تعذّر حفظ المهارة."
            : "Could not save skill.",
        deleteError: isAr
            ? "تعذّر حذف المهارة."
            : "Could not delete skill.",
        generalError: isAr
            ? "حدث خطأ غير متوقع."
            : "Something went wrong.",
        confirmDelete: isAr
            ? "هل أنت متأكد من حذف هذه المهارة؟"
            : "Are you sure you want to delete this skill?",
    };

    const [skills, setSkills] = useState<Skill[]>([]);
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

    const fetchSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/skills`, { headers });

            if (!response.ok) {
                throw new Error(text.loadingError);
            }

            const data = await response.json();
            setSkills(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : text.generalError
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const openAddForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setError("");
    };

    const openEditForm = (skill: Skill) => {
        setEditingId(skill.id);

        setForm({
            name_ar: skill.name_ar || "",
            name_en: skill.name_en || skill.name || "",
            category_ar: skill.category_ar || "",
            category_en: skill.category_en || skill.category || "",
            proficiency: skill.proficiency ?? skill.level ?? 80,
            sort_order: skill.sort_order ?? 0,
            is_active: skill.is_active ?? true,
        });

        setShowForm(true);
        setError("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const legacyName = form.name_en || form.name_ar;
            const legacyCategory = form.category_en || form.category_ar;

            const payload = {
                ...form,
                name: legacyName,
                category: legacyCategory,
            };

            const url = editingId
                ? `${API_URL}/skills/${editingId}`
                : `${API_URL}/skills`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(text.saveError);
            }

            setShowForm(false);
            setForm(emptyForm);
            setEditingId(null);

            await fetchSkills();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : text.generalError
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

            const response = await fetch(`${API_URL}/skills/${id}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                throw new Error(text.deleteError);
            }

            await fetchSkills();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : text.generalError
            );
        }
    };

    return (
        <div className="space-y-6 text-[#302630]" dir={dir}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold">{text.title}</h2>
                    <p className="mt-1 text-sm text-[#746673]">
                        {text.description}
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#9878E8] px-5 py-3 font-medium text-white hover:bg-[#8563d8]"
                >
                    <Plus size={18} />
                    {text.addSkill}
                </button>
            </div>

            {error && (
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
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
                    <h3 className="font-semibold">{text.allSkills}</h3>
                    <span className="rounded-full bg-[#F3A6C8]/20 px-3 py-1 text-sm text-[#746673]">
                        {skills.length} {text.skills}
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2
                            className="animate-spin text-[#9878E8]"
                            size={28}
                        />
                    </div>
                ) : skills.length === 0 ? (
                    <div className="py-14 text-center">
                        <Sparkles
                            className="mx-auto mb-3 text-[#9878E8]"
                            size={36}
                        />
                        <h3 className="font-semibold">{text.noSkills}</h3>
                        <p className="mt-1 text-sm text-[#746673]">
                            {text.addFirst}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {skills.map((skill) => {
                            const proficiency =
                                skill.proficiency ?? skill.level ?? 80;

                            return (
                                <div
                                    key={skill.id}
                                    className="rounded-xl border border-[#EADFE7] p-5"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <h4 className="font-semibold">
                                                {isAr
                                                    ? skill.name_ar || skill.name || skill.name_en
                                                    : skill.name_en || skill.name || skill.name_ar}
                                            </h4>

                                            <p
                                                className="text-sm text-[#746673]"
                                                dir="ltr"
                                            >
                                                {isAr
                                                    ? skill.name_en || skill.name
                                                    : skill.name_ar || skill.name}
                                            </p>

                                            <p className="mt-2 text-xs text-[#746673]">
                                                {isAr
                                                    ? skill.category_ar || skill.category || skill.category_en || text.general
                                                    : skill.category_en || skill.category || skill.category_ar || text.general}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => openEditForm(skill)}
                                                aria-label={isAr ? "تعديل المهارة" : "Edit skill"}
                                                className="rounded-lg bg-[#9878E8]/10 p-2 text-[#9878E8]"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(skill.id)}
                                                aria-label={isAr ? "حذف المهارة" : "Delete skill"}
                                                className="rounded-lg bg-red-50 p-2 text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between text-xs text-[#746673]">
                                        <span>{text.proficiency}</span>
                                        <span>{proficiency}%</span>
                                    </div>

                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EADFE7]">
                                        <div
                                            className="h-full rounded-full bg-[#9878E8]"
                                            style={{
                                                width: `${Math.min(100, Math.max(0, proficiency))}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
                    <div className="my-auto w-full max-w-lg rounded-2xl bg-[#FFF7F0] p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold">
                                {editingId ? text.editSkill : text.addNewSkill}
                            </h3>

                            <button
                                onClick={() => setShowForm(false)}
                                aria-label={isAr ? "إغلاق" : "Close"}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.skillNameAr}
                                </label>
                                <input
                                    value={form.name_ar}
                                    onChange={(e) =>
                                        setForm({ ...form, name_ar: e.target.value })
                                    }
                                    placeholder="مثال: تصميم الجرافيك"
                                    dir="rtl"
                                    className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.skillNameEn}
                                </label>
                                <input
                                    value={form.name_en}
                                    onChange={(e) =>
                                        setForm({ ...form, name_en: e.target.value })
                                    }
                                    placeholder="e.g. Graphic Design"
                                    dir="ltr"
                                    className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 text-left outline-none focus:border-[#9878E8]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.categoryAr}
                                </label>
                                <input
                                    value={form.category_ar}
                                    onChange={(e) =>
                                        setForm({ ...form, category_ar: e.target.value })
                                    }
                                    placeholder="مثال: أدوات التصميم"
                                    dir="rtl"
                                    className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 outline-none focus:border-[#9878E8]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.categoryEn}
                                </label>
                                <input
                                    value={form.category_en}
                                    onChange={(e) =>
                                        setForm({ ...form, category_en: e.target.value })
                                    }
                                    placeholder="e.g. Design Tools"
                                    dir="ltr"
                                    className="w-full rounded-xl border border-[#EADFE7] bg-white px-4 py-3 text-left outline-none focus:border-[#9878E8]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {text.skillLevel}: {form.proficiency}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={form.proficiency}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            proficiency: Number(e.target.value),
                                        })
                                    }
                                    className="w-full accent-[#9878E8]"
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
                                {text.showSkill}
                            </label>

                            <div className="flex gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 rounded-xl border border-[#EADFE7] bg-white px-4 py-3"
                                >
                                    {text.cancel}
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#9878E8] px-4 py-3 text-white disabled:opacity-60"
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
