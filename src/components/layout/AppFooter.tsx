import {
  GithubOutlined,
  MailOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons"
import { Col, Layout, Row, Space, Typography, Divider } from "antd"
import { useTranslation } from "react-i18next"
import LanguageSelect from "../LanguageSelect"

const { Footer } = Layout
const { Title, Text, Link } = Typography

const AppFooter = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  return (
    <Footer
      style={{
        background: "#ffffff",
        color: "#0f172a",
        padding: "56px 24px 24px",
        marginTop: 60,
        borderTop: "1px solid #e2e8f0"
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[32, 32]}>
          {/* Brand */}
          <Col xs={24} sm={12} md={8}>
            <div className="mb-3 flex items-center gap-2">
              <SafetyCertificateOutlined
                style={{ fontSize: 24, color: "#1e3a8a" }}
              />
              <Title
                level={4}
                style={{
                  color: "#1e3a8a",
                  margin: 0,
                  fontWeight: 700
                }}
              >
                ElectionPoll
              </Title>
            </div>

            <Text
              style={{
                color: "#334155",
                lineHeight: 1.9,
                fontSize: 15
              }}
            >
              {t("footer.description")}
            </Text>

            <div style={{ marginTop: 10 }}>
              <Text
                style={{
                  color: "#1e3a8a",
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600
                }}
              >
                {t("common.language")}
              </Text>
              <LanguageSelect />
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={5}>
            <Title
              level={5}
              style={{
                color: "#1e3a8a",
                marginBottom: 16,
                fontWeight: 700
              }}
            >
              {t("footer.quickLinks")}
            </Title>

            <Space vertical size={10}>
              <Link href="/" style={{ color: "#334155" }}>
                {t("common.home")}
              </Link>
              <Link href="/elections" style={{ color: "#334155" }}>
                {t("footer.elections")}
              </Link>
              <Link href="/create-election" style={{ color: "#334155" }}>
                {t("footer.createElection")}
              </Link>
              <Link href="/results" style={{ color: "#334155" }}>
                {t("footer.results")}
              </Link>
            </Space>
          </Col>

          {/* Features */}
          <Col xs={24} sm={12} md={5}>
            <Title
              level={5}
              style={{
                color: "#1e3a8a",
                marginBottom: 16,
                fontWeight: 700
              }}
            >
              {t("footer.features")}
            </Title>

            <Space vertical size={10}>
              <Text style={{ color: "#334155" }}>
                {t("footer.blockchainVoting")}
              </Text>
              <Text style={{ color: "#334155" }}>
                {t("footer.smartContracts")}
              </Text>
              <Text style={{ color: "#334155" }}>
                {t("footer.transparency")}
              </Text>
              <Text style={{ color: "#334155" }}>
                {t("footer.security")}
              </Text>
            </Space>
          </Col>

          {/* Contact */}
          <Col xs={24} sm={12} md={6}>
            <Title
              level={5}
              style={{
                color: "#1e3a8a",
                marginBottom: 16,
                fontWeight: 700
              }}
            >
              {t("footer.contact")}
            </Title>

            <Space vertical size={12} style={{ width: "100%" }}>
              <Link
                href="mailto:support@electionpoll.io"
                style={{ color: "#334155" }}
              >
                <MailOutlined style={{ marginRight: 8, color: "#1e3a8a" }} />
                support@electionpoll.io
              </Link>

              <Link
                href="https://github.com/"
                target="_blank"
                style={{ color: "#334155" }}
              >
                <GithubOutlined style={{ marginRight: 8, color: "#1e3a8a" }} />
                {t("footer.githubRepository")}
              </Link>

              <Link href="/docs" style={{ color: "#334155" }}>
                <GlobalOutlined style={{ marginRight: 8, color: "#1e3a8a" }} />
                {t("footer.documentation")}
              </Link>
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: "#e2e8f0", margin: "32px 0 20px" }} />

        {/* Bottom */}
        <div
          style={{
            textAlign: "center"
          }}
        >
          <Text style={{ color: "#64748b", fontSize: 14 }}>
            {t("footer.copyright", { year: currentYear })}
          </Text>
        </div>
      </div>
    </Footer>
  )
}

export default AppFooter