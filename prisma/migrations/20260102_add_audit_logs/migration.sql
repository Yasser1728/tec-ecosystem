-- CreateTable: Add AuditLog table for forensic audit tracking
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "operationType" TEXT NOT NULL,
    "operationData" JSONB NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "rejectionReason" TEXT,
    "hash" TEXT NOT NULL,
    "identityVerified" BOOLEAN NOT NULL,
    "identityReason" TEXT,
    "operationValid" BOOLEAN NOT NULL,
    "validationErrors" TEXT[],
    "riskLevel" TEXT NOT NULL,
    "suspicious" BOOLEAN NOT NULL,
    "suspicionIndicators" TEXT[],
    "threatLevel" TEXT,
    "requestIp" TEXT,
    "requestUserAgent" TEXT,
    "requestOrigin" TEXT,
    "domain" TEXT,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "audit_logs_hash_key" ON "audit_logs"("hash");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_operationType_idx" ON "audit_logs"("operationType");

-- CreateIndex
CREATE INDEX "audit_logs_approved_idx" ON "audit_logs"("approved");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_domain_idx" ON "audit_logs"("domain");
