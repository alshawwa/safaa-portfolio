
import { useEffect, useState } from "react";
import {
    Save,
    Loader2,
    Settings,
    Globe,
    Mail,
    Phone,
    RefreshCw,
    X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://127.0.0.1:8000/api";

interface SettingsData {
    site_name_ar: string;
    site_name_en: string;
    tagline_ar: string;
    tagline_en: string;
    email: string;
    phone: string;
    location_ar: string;
    location_en: string;
    description_ar: string;
    description_en: string;
    default_language: string;
    is_published: boolean;
}

const initialSettings: SettingsData = {
    site_name_ar: "",
    site_name_en: "",
    tagline_ar: "",
    tagline_en: "",
    email: "",
    phone: "",
    location_ar: "",
    location_en: "",
    description_ar: "",
    description_en: "",
    default_language: "en",
    is_published: true,
};

export function SettingsManager() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const dir = isAr ? "rtl" : "ltr";

    const text = {
        title: isAr ? "الإعدادات" : "Settings",
        description: isAr
            ? "إدارة إعدادات موقع معرض الأعمال."
            : "Manage your portfolio website settings.",
        refresh: isAr ? "تحديث" : "Refresh",
        general: isAr ? "المعلومات العامة" : "General Information",
        generalDesc: isAr
            ? "معلومات الموقع باللغتين العربية والإنجليزية."
            : "Website information in both languages.",
        siteName: isAr ? "اسم الموقع" : "Site Name",
        tagline: isAr ? "الشعار التعريفي" : "Tagline",
        websiteDescription: isAr ? "وصف الموقع" : "Website Description",
        contact: isAr ? "معلومات التواصل" : "Contact Information",
        contactDesc: isAr
            ? "بيانات التواصل المعروضة على الموقع."
            : "Contact details displayed on your website.",
        email: isAr ? "البريد الإلكتروني" : "Email Address",
        phone: isAr ? "رقم الهاتف" : "Phone Number",
        location: isAr ? "الموقع" : "Location",
        preferences: isAr ? "التفضيلات" : "Preferences",
        preferencesDesc: isAr
            ? "لغة الموقع وإمكانية ظهوره للزوار."
            : "Language and website visibility.",
        defaultLanguage: isAr ? "اللغة الافتراضية" : "Default Language",
        publish: isAr ? "نشر الموقع" : "Publish Website",
        publishDesc: isAr
            ? "السماح للزوار بالوصول إلى معرض أعمالك."
            : "Allow visitors to access your portfolio.",
        save: isAr ? "حفظ الإعدادات" : "Save Settings",
        saving: isAr ? "جارٍ الحفظ..." : "Saving...",
        loadingError: isAr
            ? "تعذّر تحميل الإعدادات."
            : "Failed to load settings.",
        saveError: isAr
            ? "تعذّر حفظ الإعدادات."
            : "Could not save settings.",
        saveSuccess: isAr
            ? "تم حفظ الإعدادات بنجاح."
            : "Settings saved successfully.",
        generalError: isAr
            ? "حدث خطأ غير متوقع."
            : "Something went wrong.",
        arabic: "العربية",
        english: "English",
        close: isAr ? "إغلاق التنبيه" : "Close alert",
        siteNameAr: "معرض صفاء",
        siteNameEn: "Safaa Portfolio",
        taglineAr: "مصممة جرافيك إبداعية",
        taglineEn: "Creative Graphic Designer",
        descriptionAr: "اكتبي وصف الموقع بالعربية...",
        descriptionEn: "Describe your portfolio website...",
        locationAr: "الموقع بالعربية",
        locationEn: "Your location",
    };

    const [settings, setSettings] = useState<SettingsData>(initialSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("admin_token");

    const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await fetch(`${API_URL}/admin/settings`, {
                headers,
            });

            if (!response.ok) {
                throw new Error(text.loadingError);
            }

            const data = await response.json();
            const result = data.data || data;

            setSettings({
                ...initialSettings,
                site_name_ar: result.site_name_ar || result.site_name || "",
                site_name_en: result.site_name_en || result.site_name || "",
                tagline_ar: result.tagline_ar || result.tagline || "",
                tagline_en: result.tagline_en || result.tagline || "",
                email: result.email || "",
                phone: result.phone || "",
                location_ar: result.location_ar || result.location || "",
                location_en: result.location_en || result.location || "",
                description_ar: result.description_ar || result.description || "",
                description_en: result.description_en || result.description || "",
                default_language: result.default_language || "en",
                is_published:
                    result.is_published === undefined
                        ? true
                        : result.is_published === true ||
                        result.is_published === "1" ||
                        result.is_published === 1,
            });
        } catch (err) {
            setError(
                err instanceof Error ? err.message : text.generalError
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                ...settings,
                site_name: settings.site_name_en,
                tagline: settings.tagline_en,
                location: settings.location_en,
                description: settings.description_en,
            };

            const response = await fetch(`${API_URL}/admin/settings`, {
                method: "PUT",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(text.saveError);
            }

            setSuccess(text.saveSuccess);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : text.generalError
            );
        } finally {
            setSaving(false);
        }
    };

    const updateField = <K extends keyof SettingsData>(
        key: K,
        value: SettingsData[K]
    ) => {
        setSettings((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const inputClass =
        "w-full rounded-xl border border-[#EADFE7] bg-[#FFF7F0] px-4 py-3 outline-none focus:border-[#9878E8]";

    const renderLanguageFields = (
        arKey: "site_name_ar" | "tagline_ar" | "location_ar" | "description_ar",
        enKey: "site_name_en" | "tagline_en" | "location_en" | "description_en",
        label: string,
        placeholderAr: string,
        placeholderEn: string,
        multiline = false
    ) => (
        <>
            <div>
                <label className="mb-2 block text-sm font-medium">
                    {label} ({text.arabic})
                </label>
                {multiline ? (
                    <textarea
                        dir="rtl"
                        rows={4}
                        value={settings[arKey]}
                        onChange={(e) => updateField(arKey, e.target.value)}
                        placeholder={placeholderAr}
                        className={`${inputClass} resize-none`}
                    />
                ) : (
                    <input
                        dir="rtl"
                        value={settings[arKey]}
                        onChange={(e) => updateField(arKey, e.target.value)}
                        placeholder={placeholderAr}
                        className={inputClass}
                    />
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    {label} ({text.english})
                </label>
                {multiline ? (
                    <textarea
                        dir="ltr"
                        rows={4}
                        value={settings[enKey]}
                        onChange={(e) => updateField(enKey, e.target.value)}
                        placeholder={placeholderEn}
                        className={`${inputClass} resize-none text-left`}
                    />
                ) : (
                    <input
                        dir="ltr"
                        value={settings[enKey]}
                        onChange={(e) => updateField(enKey, e.target.value)}
                        placeholder={placeholderEn}
                        className={`${inputClass} text-left`}
                    />
                )}
            </div>
        </>
    );

    if (loading) {
        return (
            <div className="flex justify-center py-20" dir={dir}>
                <Loader2 className="animate-spin text-[#9878E8]" size={30} />
            </div>
        );
    }

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
                    type="button"
                    onClick={fetchSettings}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#EADFE7] bg-white px-5 py-3 font-medium hover:bg-[#F3A6C8]/10"
                >
                    <RefreshCw size={17} />
                    {text.refresh}
                </button>
            </div>

            {error && (
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label={text.close}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {success && (
                <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    <span>{success}</span>
                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                        aria-label={text.close}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div className="rounded-2xl border border-[#EADFE7] bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-[#F3A6C8]/20 p-3 text-[#9878E8]">
                            <Globe size={21} />
                        </div>
                        <div>
                            <h3 className="font-semibold">{text.general}</h3>
                            <p className="text-xs text-[#746673]">
                                {text.generalDesc}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {renderLanguageFields(
                            "site_name_ar",
                            "site_name_en",
                            text.siteName,
                            text.siteNameAr,
                            text.siteNameEn
                        )}

                        {renderLanguageFields(
                            "tagline_ar",
                            "tagline_en",
                            text.tagline,
                            text.taglineAr,
                            text.taglineEn
                        )}

                        <div className="md:col-span-2 grid gap-5 md:grid-cols-2">
                            {renderLanguageFields(
                                "description_ar",
                                "description_en",
                                text.websiteDescription,
                                text.descriptionAr,
                                text.descriptionEn,
                                true
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#EADFE7] bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-[#F3A6C8]/20 p-3 text-[#9878E8]">
                            <Mail size={21} />
                        </div>
                        <div>
                            <h3 className="font-semibold">{text.contact}</h3>
                            <p className="text-xs text-[#746673]">
                                {text.contactDesc}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Mail size={15} /> {text.email}
                            </label>
                            <input
                                type="email"
                                dir="ltr"
                                value={settings.email}
                                onChange={(e) =>
                                    updateField("email", e.target.value)
                                }
                                placeholder="hello@example.com"
                                className={`${inputClass} text-left`}
                            />
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Phone size={15} /> {text.phone}
                            </label>
                            <input
                                dir="ltr"
                                value={settings.phone}
                                onChange={(e) =>
                                    updateField("phone", e.target.value)
                                }
                                placeholder="+970 000 000 000"
                                className={`${inputClass} text-left`}
                            />
                        </div>

                        <div className="md:col-span-2 grid gap-5 md:grid-cols-2">
                            {renderLanguageFields(
                                "location_ar",
                                "location_en",
                                text.location,
                                text.locationAr,
                                text.locationEn
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#EADFE7] bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-[#F3A6C8]/20 p-3 text-[#9878E8]">
                            <Settings size={21} />
                        </div>
                        <div>
                            <h3 className="font-semibold">{text.preferences}</h3>
                            <p className="text-xs text-[#746673]">
                                {text.preferencesDesc}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                {text.defaultLanguage}
                            </label>
                            <select
                                value={settings.default_language}
                                onChange={(e) =>
                                    updateField("default_language", e.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="en">English</option>
                                <option value="ar">العربية</option>
                            </select>
                        </div>

                        <label className="flex items-center justify-between gap-4 rounded-xl border border-[#EADFE7] p-4">
                            <div>
                                <p className="font-medium">{text.publish}</p>
                                <p className="mt-1 text-xs text-[#746673]">
                                    {text.publishDesc}
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.is_published}
                                onChange={(e) =>
                                    updateField("is_published", e.target.checked)
                                }
                                className="h-5 w-5 accent-[#9878E8]"
                            />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#9878E8] px-7 py-3 font-medium text-white transition hover:bg-[#8563d8] disabled:opacity-60"
                    >
                        {saving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {saving ? text.saving : text.save}
                    </button>
                </div>
            </form>
        </div>
    );
}
