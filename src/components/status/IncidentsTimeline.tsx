import React from 'react';
import { Paper, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Chip, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PastIncident {
  date: string;
  title: string;
  status: string;
  severity: 'success' | 'warning' | 'info';
  details: string;
}

const pastIncidents: PastIncident[] = [];

export function IncidentsTimeline() {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Past Incidents</Typography>
      <Divider sx={{ mb: 3 }} />
      {pastIncidents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No incidents reported in the last 90 days.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pastIncidents.map((incident, idx) => (
            <Accordion key={idx} disableGutters sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, '&:before': { display: 'none' }, boxShadow: 'none', '&:not(:last-child)': { mb: 1 } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`incident-panel-${idx}-content`} id={`incident-panel-${idx}-header`} sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 100 }}>{incident.date}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>{incident.title}</Typography>
                  <Chip label={incident.status} size="small" color={incident.severity} variant="outlined" />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2, pt: 0, bgcolor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary">{incident.details}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Paper>
  );
}
