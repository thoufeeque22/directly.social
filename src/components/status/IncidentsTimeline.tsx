"use client";

import React from 'react';
import { Paper, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Chip, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BetterStackIncident } from '@/lib/schemas/status';
import { friendlyNames } from './ServiceListItem';

export function IncidentsTimeline({ incidents = [] }: { incidents?: BetterStackIncident[] }) {
  // Only show resolved incidents from the last 30 days, sorted by newest first. Limit to 5.
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const pastIncidents = incidents
    .filter(inc => inc.attributes.resolved_at !== null)
    .filter(inc => new Date(inc.attributes.started_at) > thirtyDaysAgo)
    .sort((a, b) => new Date(b.attributes.started_at).getTime() - new Date(a.attributes.started_at).getTime())
    .slice(0, 5);
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Past Incidents</Typography>
      <Divider sx={{ mb: 3 }} />
      {pastIncidents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No incidents reported in the last 30 days.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pastIncidents.map((incident, idx) => {
            const dateStr = new Date(incident.attributes.started_at).toLocaleString(undefined, { 
              month: 'short', day: 'numeric', year: 'numeric',
              hour: 'numeric', minute: '2-digit'
            });
            const displayName = friendlyNames[incident.attributes.name] || incident.attributes.name;
            return (
              <Accordion key={incident.id} disableGutters sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, '&:before': { display: 'none' }, boxShadow: 'none', '&:not(:last-child)': { mb: 1 } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`incident-panel-${idx}-content`} id={`incident-panel-${idx}-header`} sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 150 }}>{dateStr}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>{displayName}</Typography>
                    <Chip label="Resolved" size="small" color="success" variant="outlined" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, pb: 2, pt: 0, bgcolor: 'background.default' }}>
                  <Typography variant="body2" color="text.secondary">
                    A temporary service disruption occurred. All systems have been fully restored and are operating normally.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}
