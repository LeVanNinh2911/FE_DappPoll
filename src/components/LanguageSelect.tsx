import { GlobalOutlined } from "@ant-design/icons";
import { Select } from "antd";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const LanguageSelect: FC = () => {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  return (
    <div className="flex items-center gap-2">
      <GlobalOutlined style={{ color: "#1e3a8a", fontSize: 16 }} />
      <Select
        className="footer-language-select"
        value={i18n.language}
        onChange={handleChangeLanguage}
        style={{ width: 140 }}
        size="middle"
        popupMatchSelectWidth={false}
      >
        <Option value="en">English</Option>
        <Option value="vi">Tiếng Việt</Option>
      </Select>
    </div>
  );
};

export default LanguageSelect;