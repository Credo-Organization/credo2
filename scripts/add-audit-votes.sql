-- Stores each model's individual verdict so a flag is auditable rather than
-- asserted. Drives the "3 of 3 models flagged this" line in the audit console.
--
-- Added to github_repos as well as evidence: the audit console renders from
-- github_repos, and the evidence row is only written for verified repos, so a
-- flagged repository would otherwise carry no votes at all.
ALTER TABLE public.github_repos
  ADD COLUMN IF NOT EXISTS audit_votes JSONB;

ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS audit_votes JSONB;

COMMENT ON COLUMN public.github_repos.audit_votes IS
  'Per-model ensemble votes: model id, normalised score, derived status, flags, latency, ok.';
COMMENT ON COLUMN public.evidence.audit_votes IS
  'Per-model ensemble votes for this evidence item.';
