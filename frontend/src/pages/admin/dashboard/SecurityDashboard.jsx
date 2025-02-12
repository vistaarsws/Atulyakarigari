import React, { useEffect, useState } from "react";
import axios from "axios";

const SecurityDashboard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/security-logs").then((res) => {
      setLogs(res.data.events || []);
    });
  }, []);

  return (
    <div>
      <h2>Security Logs</h2>
      {logs.length > 0 ? (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{log.title}</strong> - {log.description} ({log.severity})
            </li>
          ))}
        </ul>
      ) : (
        <p>No security events detected.</p>
      )}
    </div>
  );
};

export default SecurityDashboard;
