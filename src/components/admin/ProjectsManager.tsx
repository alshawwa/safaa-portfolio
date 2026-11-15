import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const API_URL = '/api';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProjectImage {
    id: number;
    image: string;
    image_url?: string;
    alt_text?: string;
    sort_order: number;
}

interface Project {
    id: number;
    title: string;
    title_ar?: string | null;
    title_en?: string | null;
    slug: string;
    description: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    client: string | null;
    project_url: string | null;
    cover_image: string | null;
    cover_image_url?: string | null;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    categories: Category[];
    images: ProjectImage[];
}

const emptyForm = {
    title_ar: '',
    title_en: '',
    slug: '',
    description_ar: '',
    description_en: '',
    client: '',
    project_url: '',
    sort_order: '0',
    is_featured: false,
    is_published: true,
};

export function ProjectsManager() {
    const { language, dir } = useLanguage();
    const isAr = language === 'ar';

    const text = {
        title: isAr ? 'مشاريعك' : 'Your Projects',
        subtitle: isAr
            ? 'أضيفي مشاريع معرض أعمالك وعدّليها وأديريها.'
            : 'Add, edit and manage your portfolio projects.',
        add: isAr ? 'إضافة مشروع' : 'Add Project',
        edit: isAr ? 'تعديل' : 'Edit',
        delete: isAr ? 'حذف' : 'Delete',
        cancel: isAr ? 'إلغاء' : 'Cancel',
        editProject: isAr ? 'تعديل المشروع' : 'Edit Project',
        addNewProject: isAr ? 'إضافة مشروع جديد' : 'Add New Project',
        titleAr: isAr ? 'عنوان المشروع (بالعربية)' : 'Project Title (Arabic)',
        titleEn: isAr ? 'عنوان المشروع (بالإنجليزية)' : 'Project Title (English)',
        slug: isAr ? 'الرابط المختصر (Slug)' : 'Slug',
        slugPlaceholder: isAr
            ? 'اتركيه فارغًا لإنشائه تلقائيًا'
            : 'Leave empty to generate automatically',
        client: isAr ? 'العميل' : 'Client',
        projectUrl: isAr ? 'رابط المشروع' : 'Project URL',
        sortOrder: isAr ? 'ترتيب العرض' : 'Sort Order',
        coverImage: isAr ? 'صورة الغلاف' : 'Cover Image',
        coverPreview: isAr ? 'معاينة صورة الغلاف' : 'Cover preview',
        descriptionAr: isAr ? 'وصف المشروع (بالعربية)' : 'Project Description (Arabic)',
        descriptionEn: isAr ? 'وصف المشروع (بالإنجليزية)' : 'Project Description (English)',
        categories: isAr ? 'التصنيفات' : 'Categories',
        noCategories: isAr ? 'لا توجد تصنيفات متاحة حاليًا.' : 'No categories available yet.',
        gallery: isAr ? 'صور المعرض' : 'Gallery Images',
        publish: isAr ? 'نشر المشروع' : 'Publish project',
        featured: isAr ? 'مشروع مميز' : 'Featured project',
        saveChanges: isAr ? 'حفظ التغييرات' : 'Save Changes',
        saving: isAr ? 'جارٍ الحفظ...' : 'Saving...',
        loading: isAr ? 'جارٍ تحميل المشاريع...' : 'Loading projects...',
        noProjects: isAr ? 'لا توجد مشاريع حتى الآن.' : 'No projects yet.',
        addFirst: isAr ? 'أضيفي مشروعك الأول!' : 'Add your first project!',
        noCover: isAr ? 'لا توجد صورة غلاف' : 'No cover image',
        live: isAr ? 'منشور' : 'Live',
        featuredLabel: isAr ? 'مميز' : 'Featured',
        loadProjectsError: isAr ? 'فشل تحميل المشاريع.' : 'Failed to load projects.',
        loadCategoriesError: isAr ? 'فشل تحميل التصنيفات.' : 'Failed to load categories.',
        loadDataError: isAr ? 'فشل تحميل البيانات.' : 'Failed to load data.',
        titleRequired: isAr
            ? 'يرجى إدخال عنوان المشروع بالعربية أو الإنجليزية.'
            : 'Please enter the project title in Arabic or English.',
        saveError: isAr ? 'فشل حفظ المشروع.' : 'Failed to save project.',
        generalSaveError: isAr
            ? 'حدث خطأ أثناء حفظ المشروع.'
            : 'An error occurred while saving.',
        updated: isAr ? 'تم تحديث المشروع بنجاح!' : 'Project updated successfully!',
        added: isAr ? 'تمت إضافة المشروع بنجاح!' : 'Project added successfully!',
        confirmDelete: isAr
            ? 'هل أنت متأكد من حذف هذا المشروع؟'
            : 'Are you sure you want to delete this project?',
        deleted: isAr ? 'تم حذف المشروع بنجاح!' : 'Project deleted successfully!',
        deleteError: isAr ? 'فشل حذف المشروع.' : 'Failed to delete project.',
    };

    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [form, setForm] = useState(emptyForm);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState('');

    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const getHeaders = () => {
        const token = localStorage.getItem('admin_token');

        return {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setMessage('');

            const [projectsResponse, categoriesResponse] = await Promise.all([
                fetch(`${API_URL}/admin/projects`, {
                    headers: getHeaders(),
                }),
                fetch(`${API_URL}/categories`, {
                    headers: { Accept: 'application/json' },
                }),
            ]);

            if (!projectsResponse.ok) {
                throw new Error(text.loadProjectsError);
            }

            if (!categoriesResponse.ok) {
                throw new Error(text.loadCategoriesError);
            }

            const projectsData = await projectsResponse.json();
            const categoriesData = await categoriesResponse.json();

            setProjects(Array.isArray(projectsData) ? projectsData : projectsData.data || []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || []);
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : text.loadDataError
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const input = e.target as HTMLInputElement;

            setForm((current) => ({
                ...current,
                [name]: input.checked,
            }));

            return;
        }

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((current) =>
            current.includes(categoryId)
                ? current.filter((id) => id !== categoryId)
                : [...current, categoryId]
        );
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setGalleryImages(files);
        setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setSelectedCategories([]);
        setCoverImage(null);
        setCoverPreview('');
        setGalleryImages([]);
        setGalleryPreviews([]);
        setEditingProject(null);
        setIsFormOpen(false);
    };

    const openCreateForm = () => {
        setMessage('');
        setEditingProject(null);
        setForm(emptyForm);
        setSelectedCategories([]);
        setCoverImage(null);
        setCoverPreview('');
        setGalleryImages([]);
        setGalleryPreviews([]);
        setIsFormOpen(true);
    };

    const openEditForm = (project: Project) => {
        setMessage('');
        setEditingProject(project);

        setForm({
            title_ar: project.title_ar ?? '',
            title_en: project.title_en ?? project.title ?? '',
            slug: project.slug ?? '',
            description_ar: project.description_ar ?? '',
            description_en: project.description_en ?? project.description ?? '',
            client: project.client ?? '',
            project_url: project.project_url ?? '',
            sort_order: String(project.sort_order ?? 0),
            is_featured: Boolean(project.is_featured),
            is_published: Boolean(project.is_published),
        });

        setSelectedCategories(
            (project.categories || []).map((category) => category.id)
        );

        setCoverImage(null);
        setCoverPreview(project.cover_image_url ?? '');

        setGalleryImages([]);
        setGalleryPreviews(
            (project.images || [])
                .map((image) => image.image_url)
                .filter((image): image is string => Boolean(image))
        );

        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.title_ar.trim() && !form.title_en.trim()) {
            setMessage(text.titleRequired);
            return;
        }

        try {
            setSaving(true);
            setMessage('');

            const formData = new FormData();

            formData.append('title_ar', form.title_ar);
            formData.append('title_en', form.title_en);
            formData.append('title', form.title_en || form.title_ar);

            formData.append('slug', form.slug);

            formData.append('description_ar', form.description_ar);
            formData.append('description_en', form.description_en);
            formData.append(
                'description',
                form.description_en || form.description_ar
            );

            formData.append('client', form.client);
            formData.append('project_url', form.project_url);
            formData.append('sort_order', form.sort_order);

            formData.append('is_featured', form.is_featured ? '1' : '0');
            formData.append('is_published', form.is_published ? '1' : '0');

            selectedCategories.forEach((categoryId) => {
                formData.append('categories[]', String(categoryId));
            });

            if (coverImage) {
                formData.append('cover_image', coverImage);
            }

            galleryImages.forEach((image) => {
                formData.append('images[]', image);
            });

            let url = `${API_URL}/projects`;
            const method = 'POST';

            if (editingProject) {
                url = `${API_URL}/projects/${editingProject.id}`;
                formData.append('_method', 'PUT');
            }

            const response = await fetch(url, {
                method,
                headers: getHeaders(),
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0];

                    if (Array.isArray(firstError)) {
                        throw new Error(firstError[0] as string);
                    }
                }

                throw new Error(data.message || text.saveError);
            }

            setMessage(editingProject ? text.updated : text.added);

            resetForm();
            await loadData();
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : text.generalSaveError
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (project: Project) => {
        const projectTitle = isAr
            ? project.title_ar || project.title_en || project.title
            : project.title_en || project.title;

        const confirmed = window.confirm(
            isAr
                ? `هل أنت متأكد من حذف المشروع "${projectTitle}"؟`
                : `Are you sure you want to delete "${projectTitle}"?`
        );

        if (!confirmed) return;

        try {
            setMessage('');

            const response = await fetch(
                `${API_URL}/projects/${project.id}`,
                {
                    method: 'DELETE',
                    headers: getHeaders(),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.deleteError);
            }

            setMessage(text.deleted);
            await loadData();
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : text.deleteError
            );
        }
    };

    if (loading) {
        return (
            <p className="text-[#746673]" dir={dir}>
                {text.loading}
            </p>
        );
    }

    return (
        <div className="space-y-6" dir={dir}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-bold text-[#302630]">
                        {text.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#746673]">
                        {text.subtitle}
                    </p>
                </div>

                <button
                    onClick={openCreateForm}
                    className="rounded-xl bg-[#9878E8] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#8061D0]"
                >
                    + {text.add}
                </button>
            </div>

            {message && (
                <div
                    role="status"
                    className="rounded-xl bg-[#F1EAFE] px-4 py-3 text-sm text-[#8061D0]"
                >
                    {message}
                </div>
            )}

            {isFormOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-3xl bg-white p-6 shadow-sm md:p-8"
                >
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-[#302630]">
                            {editingProject ? text.editProject : text.addNewProject}
                        </h3>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-sm text-[#746673] hover:text-[#302630]"
                        >
                            {text.cancel}
                        </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.titleAr}
                            </label>
                            <input
                                type="text"
                                name="title_ar"
                                value={form.title_ar}
                                onChange={handleChange}
                                dir="rtl"
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.titleEn}
                            </label>
                            <input
                                type="text"
                                name="title_en"
                                value={form.title_en}
                                onChange={handleChange}
                                dir="ltr"
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.slug}
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                placeholder={text.slugPlaceholder}
                                dir="ltr"
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.client}
                            </label>
                            <input
                                type="text"
                                name="client"
                                value={form.client}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.projectUrl}
                            </label>
                            <input
                                type="url"
                                name="project_url"
                                value={form.project_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                dir="ltr"
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.sortOrder}
                            </label>
                            <input
                                type="number"
                                name="sort_order"
                                value={form.sort_order}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.coverImage}
                            </label>

                            {coverPreview && (
                                <img
                                    src={coverPreview}
                                    alt={text.coverPreview}
                                    className="mb-3 h-32 w-full rounded-xl object-cover"
                                />
                            )}

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleCoverChange}
                                className="w-full rounded-xl border border-[#EADFE7] p-3 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-[#746673]">
                            {text.descriptionAr}
                        </label>
                        <textarea
                            name="description_ar"
                            value={form.description_ar}
                            onChange={handleChange}
                            dir="rtl"
                            rows={5}
                            className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-[#746673]">
                            {text.descriptionEn}
                        </label>
                        <textarea
                            name="description_en"
                            value={form.description_en}
                            onChange={handleChange}
                            dir="ltr"
                            rows={5}
                            className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-sm text-[#746673]">
                            {text.categories}
                        </label>

                        {categories.length === 0 ? (
                            <p className="text-sm text-[#A99AA8]">
                                {text.noCategories}
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#EADFE7] px-4 py-2 text-sm text-[#746673]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => handleCategoryChange(category.id)}
                                        />
                                        {category.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-[#746673]">
                            {text.gallery}
                        </label>

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            onChange={handleGalleryChange}
                            className="w-full rounded-xl border border-[#EADFE7] p-3 text-sm"
                        />

                        {galleryPreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {galleryPreviews.map((preview, index) => (
                                    <img
                                        key={`${preview}-${index}`}
                                        src={preview}
                                        alt={`${text.gallery} ${index + 1}`}
                                        className="h-24 w-full rounded-xl object-cover"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-5">
                        <label className="flex cursor-pointer items-center gap-3 text-sm text-[#746673]">
                            <input
                                type="checkbox"
                                name="is_published"
                                checked={form.is_published}
                                onChange={handleChange}
                            />
                            {text.publish}
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 text-sm text-[#746673]">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={form.is_featured}
                                onChange={handleChange}
                            />
                            {text.featured}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-[#9878E8] px-6 py-3 text-white transition hover:bg-[#8061D0] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? text.saving
                            : editingProject
                                ? text.saveChanges
                                : text.add}
                    </button>
                </form>
            )}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {projects.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#EADFE7] bg-white p-8 text-sm text-[#746673] md:col-span-2 xl:col-span-3">
                        {text.noProjects} {text.addFirst}
                    </div>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            className="overflow-hidden rounded-3xl bg-white shadow-sm"
                        >
                            {project.cover_image_url ? (
                                <img
                                    src={project.cover_image_url}
                                    alt={project.title_en || project.title}
                                    className="h-48 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-48 items-center justify-center bg-[#FFF7F0] text-sm text-[#A99AA8]">
                                    {text.noCover}
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-[#302630]">
                                            {isAr
                                                ? project.title_ar || project.title_en || project.title
                                                : project.title_en || project.title}
                                        </h4>

                                        {project.client && (
                                            <p className="mt-1 text-sm text-[#746673]">
                                                {project.client}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {project.is_published && (
                                            <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">
                                                {text.live}
                                            </span>
                                        )}

                                        {project.is_featured && (
                                            <span className="rounded-full bg-[#F1EAFE] px-2 py-1 text-xs text-[#8061D0]">
                                                {text.featuredLabel}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {project.categories.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.categories.map((category) => (
                                            <span
                                                key={category.id}
                                                className="rounded-lg bg-[#FFF7F0] px-2 py-1 text-xs text-[#746673]"
                                            >
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => openEditForm(project)}
                                        className="rounded-xl border border-[#EADFE7] px-4 py-2 text-sm text-[#746673] transition hover:bg-[#FFF7F0]"
                                    >
                                        {text.edit}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(project)}
                                        className="rounded-xl px-4 py-2 text-sm text-red-500 transition hover:bg-red-50"
                                    >
                                        {text.delete}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
