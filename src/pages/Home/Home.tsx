import {
  ArrowRightOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  AppstoreOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroBg from "../../assets/bg-hero.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <LockOutlined />,
      title: t("home.features.items.0.title"),
      color: "bg-blue-100 text-blue-700",
      desc: t("home.features.items.0.desc")
    },
    {
      icon: <ThunderboltOutlined />,
      title: t("home.features.items.1.title"),
      color: "bg-sky-100 text-sky-700",
      desc: t("home.features.items.1.desc")
    },
    {
      icon: <BarChartOutlined />,
      title: t("home.features.items.2.title"),
      color: "bg-cyan-100 text-cyan-700",
      desc: t("home.features.items.2.desc")
    },
    {
      icon: <CheckCircleOutlined />,
      title: t("home.features.items.3.title"),
      color: "bg-indigo-100 text-indigo-700",
      desc: t("home.features.items.3.desc")
    }
  ];

  const steps = [
    {
      number: "01",
      title: t("home.steps.items.0.title"),
      desc: t("home.steps.items.0.desc")
    },
    {
      number: "02",
      title: t("home.steps.items.1.title"),
      desc: t("home.steps.items.1.desc")
    },
    {
      number: "03",
      title: t("home.steps.items.2.title"),
      desc: t("home.steps.items.2.desc")
    }
  ];

  const useCases = [
    {
      icon: <TeamOutlined />,
      title: t("home.useCases.items.0.title"),
      desc: t("home.useCases.items.0.desc")
    },
    {
      icon: <AppstoreOutlined />,
      title: t("home.useCases.items.1.title"),
      desc: t("home.useCases.items.1.desc")
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: t("home.useCases.items.2.title"),
      desc: t("home.useCases.items.2.desc")
    }
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 md:px-6 md:pt-12">
        <div
          className="relative overflow-hidden rounded-3xl shadow-xl bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-950 via-blue-950" />
          <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-52 w-52 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-6 py-10 md:px-12 md:py-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center rounded-full border border-blue-300/20 bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur-sm">
                {t("home.hero.badge")}
              </div>

              <h1 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
                {t("home.hero.titleLine1")}
                <br />
                <span className="text-sky-300">{t("home.hero.titleLine2")}</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-100 md:text-lg">
                {t("home.hero.description")}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="primary"
                  className="h-11! rounded-xl! border-none! bg-white! px-8! text-sm! font-bold! text-blue-900! shadow-md! hover:bg-blue-50!"
                  onClick={() => navigate("/create-election")}
                >
                  {t("home.hero.primaryButton")}
                </Button>

                <Button
                  className="h-11! rounded-xl! border border-white/20! bg-blue-700/80! px-8! text-sm! font-bold! text-white! backdrop-blur-sm! hover:bg-blue-600!"
                  onClick={() => navigate("/demo")}
                >
                  {t("home.hero.secondaryButton")} <ArrowRightOutlined className="ml-1" />
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-sm">
                  {t("home.hero.tags.0")}
                </div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-sm">
                  {t("home.hero.tags.1")}
                </div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-sm">
                  {t("home.hero.tags.2")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST HIGHLIGHTS */}
      <section className="mx-auto mt-10 w-full max-w-5xl px-4 md:mt-14 md:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-blue-900">
                {t(`home.highlights.items.${index}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t(`home.highlights.items.${index}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto mt-16 w-full max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
            {t("home.features.title")}
          </h2>
          <p className="mt-2 text-base text-slate-500">
            {t("home.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-800">{feature.title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto mt-20 w-full max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
            {t("home.steps.title")}
          </h2>
          <p className="mt-2 text-base text-slate-500">
            {t("home.steps.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div className="text-sm font-bold tracking-[0.2em] text-blue-700">
                {step.number}
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-800">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section className="mx-auto mt-20 w-full max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
            {t("home.useCases.title")}
          </h2>
          <p className="mt-2 text-base text-slate-500">
            {t("home.useCases.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {useCases.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-700">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mb-16 mt-20 w-full max-w-5xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 px-6 py-10 text-center shadow-xl md:px-12 md:py-14">
          <div className="absolute -top-10 left-10 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white md:text-4xl">
              {t("home.cta.title")}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base text-blue-100/85">
              {t("home.cta.description")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                type="primary"
                className="h-12! rounded-xl! border-none! bg-white! px-10! text-base! font-bold! text-blue-900! shadow-md! hover:bg-blue-50!"
                onClick={() => navigate("/create-election")}
              >
                {t("home.cta.primaryButton")}
              </Button>

              <Button
                className="h-12! rounded-xl! border border-white/20! bg-white/10! px-8! text-base! font-semibold! text-white! backdrop-blur-sm! hover:bg-white/15!"
                onClick={() => navigate("/demo")}
              >
                {t("home.cta.secondaryButton")} <LinkOutlined className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;