import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const API_URL = '/api/profile';
const STORAGE_URL = '/storage/';

type ProfileData = {
    name: string;
    title: string;
    title_ar: string;
    title_en: string;
    bio: string;
    bio_ar: string;
    bio_en: string;
    email: string;
    phone: string;
    location: string;
    profile_image: string;
    cv_file: string;
};

const getStorageUrl = (path: string) => {
    if (!path) return '';

    if (path.startsWith('http')) {
        return path;
    }

    return `${STORAGE_URL}${path
        .replace(/^storage\//, '')
        .replace(/^\/+/, '')}`;
};

export function ProfileManager() {
    const { language, dir } = useLanguage();
    const isAr = language === 'ar';

    const text = {
        loading: isAr ? 'جارٍ تحميل الملف الشخصي...' : 'Loading profile...',
        editProfile: isAr ? 'تعديل الملف الشخصي' : 'Edit Profile',
        profileImage: isAr ? 'الصورة الشخصية' : 'Profile Image',
        fullName: isAr ? 'الاسم الكامل' : 'Full Name',
        professionalInfo: isAr ? 'المعلومات المهنية' : 'Professional Information',
        arabic: 'العربية',
        english: 'English',
        jobTitle: isAr ? 'المسمى الوظيفي' : 'Professional Title',
        aboutMe: isAr ? 'نبذة عني' : 'About Me',
        arabicTitlePlaceholder: 'مثال: مصممة جرافيك',
        arabicBioPlaceholder: 'اكتبي نبذة تعريفية عنك...',
        englishTitlePlaceholder: 'Example: Graphic Designer',
        englishBioPlaceholder: 'Write a short introduction about yourself...',
        email: isAr ? 'البريد الإلكتروني' : 'Email',
        phone: isAr ? 'رقم الهاتف' : 'Phone',
        location: isAr ? 'الموقع' : 'Location',
        cv: isAr ? 'السيرة الذاتية (CV)' : 'Curriculum Vitae (CV)',
        currentCv: isAr ? 'السيرة الذاتية الحالية' : 'Current CV',
        viewCv: isAr ? 'عرض السيرة الذاتية' : 'View CV',
        uploadCv: isAr ? 'رفع أو استبدال السيرة الذاتية (PDF)' : 'Upload or Replace CV (PDF)',
        pdfOnly: isAr
            ? 'يُسمح بملفات PDF فقط. الحد الأقصى لحجم الملف: 10 ميجابايت.'
            : 'PDF files only. Maximum file size: 10 MB.',
        selected: isAr ? 'الملف المحدد:' : 'Selected:',
        selectedCv: isAr ? 'السيرة الذاتية المحددة:' : 'Selected CV:',
        save: isAr ? 'حفظ التغييرات' : 'Save Changes',
        saving: isAr ? 'جارٍ الحفظ...' : 'Saving...',
        saved: isAr ? 'تم حفظ الملف الشخصي بنجاح!' : 'Profile saved successfully!',
        loadError: isAr
            ? 'حدث خطأ أثناء تحميل الملف الشخصي.'
            : 'Failed to load profile.',
        saveError: isAr
            ? 'فشل حفظ الملف الشخصي.'
            : 'Failed to save profile.',
        generalError: isAr
            ? 'حدث خطأ أثناء الحفظ.'
            : 'An error occurred while saving.',
        pdfError: isAr
            ? 'يرجى اختيار ملف PDF للسيرة الذاتية.'
            : 'Please select a PDF file for the CV.',
        sizeError: isAr
            ? 'يجب ألا يتجاوز حجم ملف السيرة الذاتية 10 ميجابايت.'
            : 'CV file size must not exceed 10 MB.',
        preview: isAr ? 'معاينة الصورة الشخصية' : 'Profile preview',
    };

    const [profile, setProfile] = useState<ProfileData>({
        name: '',
        title: '',
        title_ar: '',
        title_en: '',
        bio: '',
        bio_ar: '',
        bio_en: '',
        email: '',
        phone: '',
        location: '',
        profile_image: '',
        cv_file: '',
    });

    const [activeLanguage, setActiveLanguage] = useState<'ar' | 'en'>('ar');

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedCv, setSelectedCv] = useState<File | null>(null);

    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetch(API_URL, {
            headers: {
                Accept: 'application/json',
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(text.loadError);
                }

                return res.json();
            })
            .then((response) => {
                const data = response.data ?? response;

                if (!data) return;

                setProfile({
                    name: data.name ?? '',
                    title: data.title ?? '',
                    title_ar: data.title_ar ?? data.title ?? '',
                    title_en: data.title_en ?? data.title ?? '',
                    bio: data.bio ?? '',
                    bio_ar: data.bio_ar ?? data.bio ?? '',
                    bio_en: data.bio_en ?? data.bio ?? '',
                    email: data.email ?? '',
                    phone: data.phone ?? '',
                    location: data.location ?? '',
                    profile_image: data.profile_image ?? '',
                    cv_file: data.cv_file ?? '',
                });

                if (data.profile_image) {
                    setImagePreview(getStorageUrl(data.profile_image));
                }
            })
            .catch(() => {
                setMessage(text.loadError);
                setMessageType('error');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setProfile((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleCvChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.type !== 'application/pdf') {
            setMessage(text.pdfError);
            setMessageType('error');
            e.target.value = '';
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setMessage(text.sizeError);
            setMessageType('error');
            e.target.value = '';
            return;
        }

        setSelectedCv(file);
        setMessage('');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('admin_token');
            const formData = new FormData();

            formData.append('_method', 'PUT');
            formData.append('name', profile.name);

            formData.append('title_ar', profile.title_ar);
            formData.append('title_en', profile.title_en);
            formData.append('bio_ar', profile.bio_ar);
            formData.append('bio_en', profile.bio_en);

            formData.append('title', profile.title_en || profile.title_ar);
            formData.append('bio', profile.bio_en || profile.bio_ar);

            formData.append('email', profile.email);
            formData.append('phone', profile.phone);
            formData.append('location', profile.location);

            if (selectedImage) {
                formData.append('profile_image', selectedImage);
            }

            if (selectedCv) {
                formData.append('cv_file', selectedCv);
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    ...(token
                        ? { Authorization: `Bearer ${token}` }
                        : {}),
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                const validationErrors = data.errors
                    ? Object.values(data.errors).flat().join(' ')
                    : '';

                throw new Error(
                    validationErrors ||
                    data.message ||
                    text.saveError
                );
            }

            const savedProfile = data.data ?? data;

            setProfile((previous) => ({
                ...previous,
                title: savedProfile.title ?? previous.title,
                bio: savedProfile.bio ?? previous.bio,
                profile_image:
                    savedProfile.profile_image ?? previous.profile_image,
                cv_file: savedProfile.cv_file ?? previous.cv_file,
            }));

            setSelectedImage(null);
            setSelectedCv(null);

            setMessage(text.saved);
            setMessageType('success');
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : text.generalError
            );
            setMessageType('error');
        } finally {
            setSaving(false);
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
        <form
            onSubmit={handleSave}
            dir={dir}
            className="space-y-5 rounded-3xl bg-white p-8 shadow-sm"
        >
            <h3 className="text-xl font-bold text-[#302630]">
                {text.editProfile}
            </h3>

            <div>
                <label className="mb-2 block text-sm text-[#746673]">
                    {text.profileImage}
                </label>

                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt={text.preview}
                        className="mb-4 h-28 w-28 rounded-2xl object-cover"
                    />
                )}

                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="w-full rounded-xl border border-[#EADFE7] p-3 text-sm"
                />

                {selectedImage && (
                    <p className="mt-2 text-xs text-[#746673]">
                        {text.selected} {selectedImage.name}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm text-[#746673]">
                    {text.fullName}
                </label>

                <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                />
            </div>

            <div className="space-y-4 rounded-2xl border border-[#EADFE7] p-5">
                <h4 className="font-semibold text-[#302630]">
                    {text.professionalInfo}
                </h4>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveLanguage('ar')}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${activeLanguage === 'ar'
                            ? 'bg-[#9878E8] text-white'
                            : 'bg-[#FFF7F0] text-[#746673]'
                            }`}
                    >
                        {text.arabic}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveLanguage('en')}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${activeLanguage === 'en'
                            ? 'bg-[#9878E8] text-white'
                            : 'bg-[#FFF7F0] text-[#746673]'
                            }`}
                    >
                        {text.english}
                    </button>
                </div>

                {activeLanguage === 'ar' ? (
                    <div className="space-y-4" dir="rtl">
                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {isAr ? 'المسمى الوظيفي' : 'المسمى الوظيفي'}
                            </label>

                            <input
                                name="title_ar"
                                value={profile.title_ar}
                                onChange={handleChange}
                                placeholder={text.arabicTitlePlaceholder}
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.aboutMe}
                            </label>

                            <textarea
                                name="bio_ar"
                                value={profile.bio_ar}
                                onChange={handleChange}
                                rows={5}
                                placeholder={text.arabicBioPlaceholder}
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4" dir="ltr">
                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.jobTitle}
                            </label>

                            <input
                                name="title_en"
                                value={profile.title_en}
                                onChange={handleChange}
                                placeholder={text.englishTitlePlaceholder}
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[#746673]">
                                {text.aboutMe}
                            </label>

                            <textarea
                                name="bio_en"
                                value={profile.bio_en}
                                onChange={handleChange}
                                rows={5}
                                placeholder={text.englishBioPlaceholder}
                                className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                            />
                        </div>
                    </div>
                )}
            </div>

            {([
                ['email', text.email],
                ['phone', text.phone],
                ['location', text.location],
            ] as const).map(([name, label]) => (
                <div key={name}>
                    <label className="mb-2 block text-sm text-[#746673]">
                        {label}
                    </label>

                    <input
                        name={name}
                        value={profile[name]}
                        onChange={handleChange}
                        dir={name === 'email' ? 'ltr' : dir}
                        className="w-full rounded-xl border border-[#EADFE7] p-3 outline-none focus:border-[#9878E8]"
                    />
                </div>
            ))}

            <div className="rounded-2xl border border-[#EADFE7] bg-[#FFF7F0] p-5">
                <h4 className="mb-3 font-semibold text-[#302630]">
                    {text.cv}
                </h4>

                {profile.cv_file && (
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-[#302630]">
                                {text.currentCv}
                            </p>

                            <p className="mt-1 text-xs text-[#746673]" dir="ltr">
                                {profile.cv_file.split('/').pop()}
                            </p>
                        </div>

                        <a
                            href={getStorageUrl(profile.cv_file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[#8061D0] underline"
                        >
                            {text.viewCv}
                        </a>
                    </div>
                )}

                <label className="mb-2 block text-sm text-[#746673]">
                    {text.uploadCv}
                </label>

                <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCvChange}
                    className="w-full rounded-xl border border-[#EADFE7] bg-white p-3 text-sm"
                />

                {selectedCv && (
                    <p className="mt-2 text-sm text-[#8061D0]">
                        {text.selectedCv} {selectedCv.name}
                    </p>
                )}

                <p className="mt-2 text-xs text-[#746673]">
                    {text.pdfOnly}
                </p>
            </div>

            {message && (
                <p
                    role="status"
                    className={`rounded-xl p-3 text-sm ${messageType === 'success'
                        ? 'bg-[#FFF7F0] text-[#8061D0]'
                        : 'bg-red-50 text-red-600'
                        }`}
                >
                    {message}
                </p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#9878E8] px-6 py-3 text-white transition hover:bg-[#8061D0] disabled:opacity-50"
            >
                {saving ? text.saving : text.save}
            </button>
        </form>
    );
}
