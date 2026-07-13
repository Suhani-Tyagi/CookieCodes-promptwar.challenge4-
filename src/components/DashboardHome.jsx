import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import FanDashboardView from './FanDashboardView.jsx';
import VolunteerDashboardView from './VolunteerDashboardView.jsx';
import VenueStaffDashboardView from './VenueStaffDashboardView.jsx';
import OrganizerDashboardView from './OrganizerDashboardView.jsx';

/**
 * DashboardHome component routing and rendering the correct layout based on user roles.
 * Supports Fan, Volunteer, Venue Staff, and Organizer dashboards with nested error boundaries.
 * @returns {React.ReactElement} The composed Dashboard Home page.
 */
export default function DashboardHome() {
  const { 
    complaints, 
    userProfile, 
    setActiveTab, 
    theme,
    addEcoPoints,
    matchesList,
    selectedMatchId,
    setSelectedMatchId,
    liveDemoActive,
    setLiveDemoActive,
    t
  } = useApp();

  const [simulatedVolunteerCheckin, setSimulatedVolunteerCheckin] = useState(false);
  const [volTasksCompleted, setVolTasksCompleted] = useState({
    ticketScan: false,
    wheelchairGuide: false,
    recycleCups: false
  });

  // Calculate statistics
  const resolvedIssues = complaints.filter(c => c.status === 'Resolved').length;
  const inProgressIssues = complaints.filter(c => c.status === 'In Progress').length;
  const underReviewIssues = complaints.filter(c => c.status === 'In Triage' || c.status === 'Submitted').length;

  // ECharts Configurations for Organizer Dashboard
  const getGateFlowOption = () => ({
    title: {
      text: 'Gate Flow Rates (Fans / min)',
      left: 'center',
      textStyle: { color: theme === 'dark' ? '#fafafa' : '#09090b', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme === 'dark' ? '#1e1e24' : '#e4e4e7' } },
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    yAxis: {
      type: 'category',
      data: ['Gate 5', 'Gate 4', 'Gate 3 (Issue)', 'Gate 2', 'Gate 1'],
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    series: [
      {
        name: 'Inflow',
        type: 'bar',
        data: [120, 140, 45, 110, 130],
        itemStyle: {
          color: (params) => {
            return params.dataIndex === 2 ? '#ef4444' : '#10b981';
          },
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  });

  const getZoneDensityOption = () => ({
    title: {
      text: 'Zone Crowd Density (%)',
      left: 'center',
      textStyle: { color: theme === 'dark' ? '#fafafa' : '#09090b', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }
    },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Density',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: theme === 'dark' ? '#0c0c0f' : '#ffffff',
          borderWidth: 2
        },
        label: { show: true, color: theme === 'dark' ? '#a1a1aa' : '#71717a' },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' }
        },
        data: [
          { value: 85, name: 'Concourse A (High)' },
          { value: 65, name: 'Concourse B (Med)' },
          { value: 40, name: 'Concourse C (Low)' },
          { value: 92, name: 'Concourse D (Critical)' }
        ],
        color: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444']
      }
    ]
  });

  const getSustainabilityOption = () => ({
    title: {
      text: 'Sustainability Index (Tons Saved)',
      left: 'center',
      textStyle: { color: theme === 'dark' ? '#fafafa' : '#09090b', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Recycled Plastic', 'Composted Food', 'Water Saved', 'Carbon offset'],
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a', rotate: 15 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme === 'dark' ? '#1e1e24' : '#e4e4e7' } },
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    series: [
      {
        name: 'Tons',
        type: 'bar',
        data: [12.4, 8.2, 15.6, 5.1],
        itemStyle: { color: '#059669', borderRadius: [4, 4, 0, 0] }
      }
    ]
  });

  const getTransitOption = () => ({
    title: {
      text: 'Transit Queue Wait Times (mins)',
      left: 'center',
      textStyle: { color: theme === 'dark' ? '#fafafa' : '#09090b', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Rideshare Zone', 'Metro Link', 'North Shuttle', 'South Shuttle'],
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme === 'dark' ? '#1e1e24' : '#e4e4e7' } },
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    series: [
      {
        name: 'Wait Time (Min)',
        type: 'line',
        data: [15, 25, 8, 35],
        smooth: true,
        lineStyle: { width: 3, color: '#3b82f6' },
        itemStyle: { color: '#1d4ed8' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        }
      }
    ]
  });

  const handleVolunteerCheckin = () => {
    setSimulatedVolunteerCheckin(!simulatedVolunteerCheckin);
  };

  const toggleVolTask = (taskKey) => {
    setVolTasksCompleted(prev => {
      const updated = { ...prev, [taskKey]: !prev[taskKey] };
      if (updated[taskKey]) {
        addEcoPoints(25);
      }
      return updated;
    });
  };

  const activeMatch = matchesList.find(m => m.id === selectedMatchId) || matchesList[0];

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        {(userProfile.role === 'Fan' || userProfile.role === 'Fan (Guest)') && (
          <FanDashboardView 
            userProfile={userProfile}
            activeMatch={activeMatch}
            matchesList={matchesList}
            selectedMatchId={selectedMatchId}
            setSelectedMatchId={setSelectedMatchId}
            liveDemoActive={liveDemoActive}
            setLiveDemoActive={setLiveDemoActive}
            setActiveTab={setActiveTab}
            t={t}
          />
        )}
        {userProfile.role === 'Volunteer' && (
          <VolunteerDashboardView 
            userProfile={userProfile}
            simulatedVolunteerCheckin={simulatedVolunteerCheckin}
            handleVolunteerCheckin={handleVolunteerCheckin}
            volTasksCompleted={volTasksCompleted}
            toggleVolTask={toggleVolTask}
          />
        )}
        {userProfile.role === 'Venue Staff' && (
          <VenueStaffDashboardView 
            userProfile={userProfile}
            underReviewIssues={underReviewIssues}
            inProgressIssues={inProgressIssues}
            resolvedIssues={resolvedIssues}
            setActiveTab={setActiveTab}
          />
        )}
        {userProfile.role === 'Organizer' && (
          <OrganizerDashboardView 
            underReviewIssues={underReviewIssues}
            inProgressIssues={inProgressIssues}
            resolvedIssues={resolvedIssues}
            gateFlowOption={getGateFlowOption()}
            zoneDensityOption={getZoneDensityOption()}
            sustainabilityOption={getSustainabilityOption()}
            transitOption={getTransitOption()}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
