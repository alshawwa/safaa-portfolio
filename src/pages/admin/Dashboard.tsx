import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

import { ProfileManager } from "../../components/admin/ProfileManager";
import { ProjectsManager } from "../../components/admin/ProjectsManager";
import { CategoriesManager } from "../../components/admin/CategoriesManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";
import { SettingsManager } from "@/components/admin/SettingsManager";

const API_URL = "/api";

export function Dashboard() {
    const [activeSection, setActiveSection] = useState("overview");
    const navigate = useNavigate();
    const { language, dir } = useLanguage();

    const isAr = language === "ar";

    const sections = [
        {
            id: "overview",
            label: isAr ? "نظرة عامة" : "Overview",
            description: isAr ? "نظرة عامة على لوحة التحكم" : "Dashboard overview",
            icon: "⌂",
        },
        {
            id: "profile",
            label: isAr ? "ملفي الشخصي" : "My Profile",
            description: isAr ? "إدارة معلوماتك الشخصية" : "Manage your profile",
            icon: "○",
        },
        {
            id: "projects",
            label: isAr ? "المشاريع" : "Projects",
            description: isAr ? "إدارة مشاريعك وأعمالك" : "Manage your projects",
            icon: "▣",
        },
        {
            id: "categories",
            label: isAr ? "التصنيفات" : "Categories",
            description: isAr ? "إدارة تصنيفات المشاريع" : "Manage project categories",
            icon: "▤",
        },
        {
            id: "services",
            label: isAr ? "الخدمات" : "Services",
            description: isAr ? "إدارة الخدمات التي تقدمينها" : "Manage your services",
            icon: "◇",
        },
        {
            id: "skills",
            label: isAr ? "المهارات" : "Skills",
            description: isAr ? "إدارة مهاراتك وأدواتك" : "Manage your skills",
            icon: "◈",
        },
        {
            id: "messages",
            label: isAr ? "الرسائل" : "Messages",
            description: isAr ? "عرض رسائل الزوار" : "View visitor messages",
            icon: "✉",
        },
        {
            id: "social",
            label: isAr ? "روابط التواصل" : "Social Links",
            description: isAr ? "إدارة روابط التواصل الاجتماعي" : "Manage social links",
            icon: "↗",
        },
        {
            id: "settings",
            label: isAr ? "الإعدادات" : "Settings",
            description: isAr ? "إدارة إعدادات الموقع" : "Manage website settings",
            icon: "⚙",
        },
    ];

    const handleLogout = async () => {
        const token = localStorage.getItem("admin_token");

        try {
            await fetch(`${API_URL}/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
        } finally {
            localStorage.removeItem("admin_token");
            navigate("/admin/login");
        }
    };

    const activeItem = sections.find(
        (section) => section.id === activeSection
    );

    const renderContent = () => {
        if (activeSection === "overview") {
            return (
                <div>
                    <div
                        className="mb-8 rounded-3xl bg-white p-8 shadow-sm"
                    >
                        <p className="text-sm text-[#9878E8]">
                            {isAr ? "أهلًا وسهلًا بالقمر!" : "Welcome back!"}
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-[#302630]">
                            {isAr
                                ? "مساحتك الإبداعية جاهزة!"
                                : "Your creative space is ready!"}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-[#746673]">
                            {isAr
                                ? "من هنا يمكنك إدارة ملفك الشخصي، ومشاريعك، وخدماتك، والتحكم بكل ما يظهر للزوار في موقعك."
                                : "Manage your profile, projects, services, and everything visitors see on your website from one place."}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sections.slice(1).map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className="rounded-2xl border border-[#EADFE7] bg-white p-6 text-start transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <span className="text-2xl text-[#9878E8]">
                                    {section.icon}
                                </span>

                                <h4 className="mt-4 font-semibold text-[#302630]">
                                    {section.label}
                                </h4>

                                <p className="mt-1 text-sm text-[#746673]">
                                    {section.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeSection === "profile") {
            return <ProfileManager />;
        }

        if (activeSection === "projects") {
            return <ProjectsManager />;
        }

        if (activeSection === "categories") {
            return <CategoriesManager />;
        }

        if (activeSection === "services") {
            return <ServicesManager />;
        }

        if (activeSection === "skills") {
            return <SkillsManager />;
        }

        if (activeSection === "messages") {
            return <MessagesManager />;
        }

        if (activeSection === "social") {
            return <SocialLinksManager />;
        }

        if (activeSection === "settings") {
            return <SettingsManager />;
        }

        return (
            <div className="rounded-3xl border border-[#EADFE7] bg-white p-8">
                <h3 className="text-xl font-semibold text-[#302630]">
                    {activeItem?.label}
                </h3>

                <p className="mt-3 text-sm text-[#746673]">
                    {isAr
                        ? "هذا القسم جاهز لإضافة أدوات الإدارة الخاصة به."
                        : "This section is ready for its management tools."}
                </p>
            </div>
        );
    };

    return (
        <div
            dir={dir}
            className="min-h-screen bg-[#FFF7F0] md:flex"
        >
            <aside className="w-full border-b border-[#EADFE7] bg-white p-6 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-e">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-[#302630]">
                        Safaa<span className="text-[#9878E8]">.</span>
                    </h1>

                    <p className="mt-1 text-xs text-[#746673]">
                        {isAr
                            ? "إدارة معرض الأعمال"
                            : "Portfolio Administration"}
                    </p>
                </div>

                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#A99AA8]">
                    {isAr ? "مساحة العمل" : "Workspace"}
                </p>

                <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-start text-sm transition ${activeSection === section.id
                                ? "bg-[#F1EAFE] font-semibold text-[#8061D0]"
                                : "text-[#746673] hover:bg-[#FFF7F0]"
                                }`}
                        >
                            <span>{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-8 w-full rounded-xl border border-[#EADFE7] px-4 py-3 text-start text-sm text-[#746673] transition hover:bg-red-50 hover:text-red-600"
                >
                    {isAr ? "تسجيل الخروج" : "Sign Out"}
                </button>
            </aside>

            <main className="min-w-0 flex-1 p-6 md:p-10">
                <header className="mb-10">
                    <p className="text-sm text-[#9878E8]">
                        {isAr ? "معرض أعمال صفاء" : "Safaa Portfolio"}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-[#302630]">
                        {activeItem?.label}
                    </h2>

                    <p className="mt-2 text-sm text-[#746673]">
                        {isAr
                            ? "أديري محتوى معرض أعمالك من مكان واحد."
                            : "Manage your portfolio content from one place."}
                    </p>
                </header>

                {renderContent()}
            </main>
        </div>
    );
}
