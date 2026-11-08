# Reporting release review

This branch is an editorial preview. Do not merge or publish the reports until the user approves their copy. The prior briefing chat requires an approve-before-publishing model. This preview preserves that requirement; preparing graphics or a review link does not approve publication.

## Proposed stories

All six reports in `content/reports.json` are pending review. Each has a separate page under `reports/`, a homepage card and a shared placeholder SVG. The source check date is November 8, 2026, not a claim that field reporting occurred that day.

- Sandra Moon: current City facility page confirms it is open; the July forecast has been replaced by the actual September opening and current amenities. Local-vendor opportunities are identified as potential uses, not booked events.
- Transportation: funding follow-through; no unsupported new construction or opening date.
- Zoning: permitted land uses after the vote; no claim that construction has started.
- Biotechnology: investment-to-workforce context using the employer and City announcements; planned jobs are not presented as filled positions.
- Data center: current company directory lists $1.5 billion-plus; older $1 billion-plus framing is updated. No inferred electricity use or customer-bill effects.
- Wellstone: funding commitments and future milestones; existing services are not confused with the newly funded facility.

These are NAGR-written, source-attributed reports based on prior research and checked public sources, not claims of on-site interviews or footage. The Briefing Room remains separate below them, with its original text, source links and filters.

## Media replacement

All 11 story cards use lightweight branded placeholders under `assets/placeholders/`. No generated images, source-publication photographs or third-party footage are used. Each report card and full report share a media path recorded in `content/reports.json`.

When the user supplies their own visuals, add those files under `assets/`, update the matching card and report image sources and record the new path in the JSON. Keep a 16:9 poster for story cards. Full reports may use a video player with controls and a poster; avoid autoplay with sound. Add useful alt text for informative still images and captions/transcripts for spoken video.

## Final publication step

After explicit approval of these reports, change their editorial status in the JSON, remove the editorial preview notice and report-page noindex directives, and remove the homepage preview noindex directive. Review the final diff, merge through the normal workflow, and verify the production deploy. Domain configuration is outside this release.
