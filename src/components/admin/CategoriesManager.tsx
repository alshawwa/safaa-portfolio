
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://127.0.0.1:8000/api";

interface Category {
    id: number;
    name: string;
    slug: string;
}

export function CategoriesManager() {
    const { language, dir } = useLanguage();
    const isAr = language === "ar";

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const [editingCategory, setEditingCategory] =
        useState<Category | null>(null);

    const getHeaders = () => {
        const token = localStorage.getItem("admin_token");

        return {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    const loadCategories = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(`${API_URL}/categories`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isAr
                        ? "فشل تحميل التصنيفات"
                        : "Failed to load categories")
                );
            }

            setCategories(data);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : isAr
                        ? "فشل تحميل التصنيفات"
                        : "Failed to load categories"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const resetForm = () => {
        setName("");
        setSlug("");
        setEditingCategory(null);
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!name.trim()) {
            setMessage(
                isAr
                    ? "اسم التصنيف مطلوب."
                    : "Category name is required."
            );
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            const token = localStorage.getItem("admin_token");

            const body: {
                name: string;
                slug?: string;
            } = {
                name: name.trim(),
            };

            if (slug.trim()) {
                body.slug = slug.trim();
            }

            const url = editingCategory
                ? `${API_URL}/categories/${editingCategory.id}`
                : `${API_URL}/categories`;

            const method = editingCategory ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const firstError = Object.values(
                        data.errors
                    )[0];

                    if (Array.isArray(firstError)) {
                        throw new Error(firstError[0]);
                    }
                }

                throw new Error(
                    data.message ||
                    (isAr
                        ? "فشل حفظ التصنيف"
                        : "Failed to save category")
                );
            }

            setMessage(
                editingCategory
                    ? isAr
                        ? "تم تحديث التصنيف بنجاح!"
                        : "Category updated successfully!"
                    : isAr
                        ? "تمت إضافة التصنيف بنجاح!"
                        : "Category added successfully!"
            );

            resetForm();
            await loadCategories();
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : isAr
                        ? "حدث خطأ أثناء الحفظ"
                        : "An error occurred while saving"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setSlug(category.slug);
        setMessage("");
    };

    const handleDelete = async (category: Category) => {
        const confirmed = window.confirm(
            isAr
                ? `هل أنتِ متأكدة من حذف التصنيف "${category.name}"؟`
                : `Are you sure you want to delete "${category.name}"?`
        );

        if (!confirmed) return;

        try {
            setMessage("");

            const response = await fetch(
                `${API_URL}/categories/${category.id}`,
                {
                    method: "DELETE",
                    headers: getHeaders(),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isAr
                        ? "فشل حذف التصنيف"
                        : "Failed to delete category")
                );
            }

            setMessage(
                isAr
                    ? "تم حذف التصنيف بنجاح!"
                    : "Category deleted successfully!"
            );

            if (editingCategory?.id === category.id) {
                resetForm();
            }

            await loadCategories();
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : isAr
                        ? "فشل حذف التصنيف"
                        : "Failed to delete category"
            );
        }
    };

    if (loading) {
        return (
            <p dir={dir} className="text-[#746673]">
                {isAr ? "جارٍ تحميل التصنيفات..." : "Loading categories..."}
            </p>
        );
    }

    return (
        <div dir={dir} className="space-y-6">
            {message && (
                <div className="rounded-xl bg-[#F1EAFE] px-4 py-3 text-sm text-[#8061D0]">
                    {message}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl bg-white p-6 shadow-sm"
                >
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-[#302630]">
                            {editingCategory
                                ? isAr
                                    ? "تعديل التصنيف"
                                    : "Edit Category"
                                : isAr
                                    ? "إضافة تصنيف جديد"
                                    : "Add New Category"}
                        </h3>

                        <p className="mt-1 text-sm text-[#746673]">
                            {isAr
                                ? "نظّمي مشاريع معرض أعمالك ضمن تصنيفات."
                                : "Organize your portfolio projects into categories."}
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {isAr
                                    ? "اسم التصنيف *"
                                    : "Category Name *"}
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="e.g. Branding"
                                required
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none transition focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {isAr ? "الرابط المختصر" : "Slug"}
                            </label>

                            <input
                                type="text"
                                value={slug}
                                onChange={(e) =>
                                    setSlug(e.target.value)
                                }
                                placeholder={
                                    isAr
                                        ? "اتركيه فارغًا لإنشائه تلقائيًا"
                                        : "Leave empty to generate automatically"
                                }
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none transition focus:border-[#9878E8]"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#9878E8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8061D0] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? isAr
                                        ? "جارٍ الحفظ..."
                                        : "Saving..."
                                    : editingCategory
                                        ? isAr
                                            ? "حفظ التعديلات"
                                            : "Save Changes"
                                        : isAr
                                            ? "إضافة التصنيف"
                                            : "Add Category"}
                            </button>

                            {editingCategory && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-[#EADFE7] px-5 py-3 text-sm text-[#746673] transition hover:bg-[#FFF7F0]"
                                >
                                    {isAr ? "إلغاء" : "Cancel"}
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-[#302630]">
                            {isAr ? "تصنيفاتك" : "Your Categories"}
                        </h3>

                        <p className="mt-1 text-sm text-[#746673]">
                            {isAr
                                ? `${categories.length} تصنيف متاح`
                                : `${categories.length} ${categories.length === 1
                                    ? "category"
                                    : "categories"
                                } available.`}
                        </p>
                    </div>

                    {categories.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#EADFE7] bg-[#FFF7F0]/50 p-8 text-center">
                            <p className="text-sm text-[#746673]">
                                {isAr
                                    ? "لا توجد تصنيفات حتى الآن."
                                    : "No categories yet."}
                            </p>

                            <p className="mt-1 text-xs text-[#A99AA8]">
                                {isAr
                                    ? "أضيفي أول تصنيف لتنظيم مشاريعك."
                                    : "Add your first category to organize your projects."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#EADFE7] p-4"
                                >
                                    <div>
                                        <h4 className="font-semibold text-[#302630]">
                                            {category.name}
                                        </h4>

                                        <p className="mt-1 text-xs text-[#A99AA8]">
                                            /{category.slug}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(category)
                                            }
                                            className="rounded-lg border border-[#EADFE7] px-3 py-2 text-xs text-[#746673] transition hover:bg-[#FFF7F0]"
                                        >
                                            {isAr ? "تعديل" : "Edit"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(category)
                                            }
                                            className="rounded-lg px-3 py-2 text-xs text-red-500 transition hover:bg-red-50"
                                        >
                                            {isAr ? "حذف" : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
