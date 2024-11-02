import { ConfigProvider, DatePicker, Space } from "antd";
import "./DatePicker.css";
const { RangePicker } = DatePicker;

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#60a487",
        colorPrimaryHover: "#60a487",
        colorBgTextHover: "#60a487",
        colorBgTextActive: "#60a487",
        hoverBorderColor: "#60a487",
      },
    }}
  >
    <Space
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <RangePicker inputReadOnly />
    </Space>
  </ConfigProvider>
);

export default App;
