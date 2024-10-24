import { DatePicker, Space } from "antd";
import "./DatePicker.css";
const { RangePicker } = DatePicker;

const App = () => (
  <Space
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    }}
  >
    <RangePicker inputReadOnly />
  </Space>
);

export default App;
