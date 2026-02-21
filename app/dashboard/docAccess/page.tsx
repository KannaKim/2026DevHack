"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Copy,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorAccessPage() {
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate Token (Server)
  const generateToken = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/access/generate", {
        method: "POST",
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setToken(data.data.token);
      setExpiresAt(data.data.expiresAt);
    } finally {
      setLoading(false);
    }
  };

  // Revoke Token (Server)
  const revokeToken = async () => {
    if (!token) return;

    setLoading(true);

    await fetch("/api/access/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    setToken(null);
    setExpiresAt(null);
    setLoading(false);
  };

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl w-full"
    >
      <Card className="rounded-2xl shadow-xl border bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Temporary Doctor Access
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {!token ? (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Generate a secure, time-limited access token to share your
                medical records with a clinic. The token automatically expires
                in 24 hours.
              </p>

              <Button
                onClick={generateToken}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Generate Access Token
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Token Display */}
              <div className="p-4 bg-muted rounded-xl border flex justify-between items-center">
                <span className="text-lg font-mono tracking-wider">
                  {token}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={copyToken}
                  className="hover:bg-muted"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Expiry Info */}
              {expiresAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">
                    Expires: {new Date(expiresAt).toLocaleString()}
                  </Badge>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={revokeToken}
                  disabled={loading}
                  className="flex-1"
                >
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Revoke
                </Button>

                <Button
                  variant="outline"
                  onClick={generateToken}
                  disabled={loading}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Once revoked or expired, the clinic will no longer be able to
                access your records.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
