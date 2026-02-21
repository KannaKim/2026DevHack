"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorAccessPage() {
  const [token, setToken] = useState<string | null>(null);

  const generateToken = () => {
    const newToken = "MED-" + crypto.randomUUID().slice(0, 8).toUpperCase();

    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day

    const accessData = {
      token: newToken,
      patientId: 99,
      expiresAt,
    };

    localStorage.setItem("tempAccess", JSON.stringify(accessData));
    setToken(newToken);
  };

  const revokeToken = () => {
    localStorage.removeItem("tempAccess");
    setToken(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("tempAccess");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.expiresAt > Date.now()) {
        setToken(parsed.token);
      } else {
        localStorage.removeItem("tempAccess");
      }
    }
  }, []);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Temporary Doctor Access</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!token ? (
          <Button onClick={generateToken}>
            Generate Temporary Access Token
          </Button>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg text-lg font-mono">
              {token}
            </div>
            <Button variant="destructive" onClick={revokeToken}>
              Revoke Access
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
