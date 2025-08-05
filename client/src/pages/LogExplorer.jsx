import React, { useState } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, FileText, Share2, AlertCircle } from "lucide-react";

const LogExplorer = () => {
  const [hash, setHash] = useState("");
  const [log, setLog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setLog(null);

    try {
      const { data } = await axios.get(`/logs/tx/${hash}`);
      setLog(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            Blockchain Log Explorer
          </CardTitle>
          <CardDescription>
            Enter a blockchain transaction hash to retrieve the corresponding operational log.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="0x..."
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {log && (
            <Card className="mt-4 bg-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" /> Log Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Log Type:</span>
                  <span>{log.logType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Source:</span>
                  <span>{log.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Timestamp:</span>
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Log Data:</span>
                  <div className="mt-2 border bg-background rounded-md px-4 py-2 text-xs">
                    {log.logData &&
                    typeof log.logData === "object" &&
                    !Array.isArray(log.logData) ? (
                      <ul className="list-none space-y-1">
                        {Object.entries(log.logData).map(([key, value]) => (
                          <li key={key} className="flex items-baseline">
                            <span className="inline-block min-w-[110px] font-medium capitalize text-muted-foreground mr-4">
                              {/* Key, render with newlines if any */}
                              {key.split("\n").map((line, idx) => (
                                <React.Fragment key={idx}>
                                  {line}
                                  {idx !== key.split("\n").length - 1 && <br />}
                                </React.Fragment>
                              ))}
                              :
                            </span>
                            <span className="break-all">
                              {/* Value, render with newlines if any */}
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)
                                    .split("\n")
                                    .map((line, idx, arr) => (
                                      <React.Fragment key={idx}>
                                        {line}
                                        {idx !== arr.length - 1 && <br />}
                                      </React.Fragment>
                                    ))}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      String(log.logData)
                        .split("\n")
                        .map((line, idx, arr) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx !== arr.length - 1 && <br />}
                          </React.Fragment>
                        ))
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-muted-foreground flex items-center gap-1">
                    <Share2 className="h-3 w-3" /> Blockchain Tx Hash:
                  </span>
                  <p className="text-xs text-primary break-all mt-1">{log.blockchainTxHash}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogExplorer;
