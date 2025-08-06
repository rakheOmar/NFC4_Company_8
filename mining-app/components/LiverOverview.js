import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MotiView } from 'moti';

const Section = ({ children, delay = 0 }) => (
  <MotiView
    from={{ opacity: 0, translateY: 50 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ delay, duration: 600, type: 'timing' }}
    style={{ marginBottom: 20 }}
  >
    {children}
  </MotiView>
);

const Card = ({ title, value, subtext, badgeColor }) => (
  <View style={{
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: badgeColor || '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{ fontWeight: 'bold', color: '#333' }}>{title}</Text>
      <Text style={{ color: badgeColor, fontSize: 12 }}>● LIVE</Text>
    </View>
    <Text style={{ fontSize: 28, fontWeight: 'bold', color: badgeColor }}>{value}</Text>
    <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{subtext}</Text>
  </View>
);

const ModuleCard = ({ emoji, title, description, points, color }) => (
  <View style={{
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 12
  }}>
    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
      <Text style={{ fontSize: 22, marginRight: 10 }}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
        <Text style={{ fontSize: 13, color: '#666' }}>{description}</Text>
        {points.map((pt, idx) => (
          <Text key={idx} style={{ color, fontSize: 13, marginTop: 2 }}>• {pt}</Text>
        ))}
      </View>
    </View>
  </View>
);

const LiveOverview = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f3f4f6' }}>
      <Section>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
          Live Overview
        </Text>
      </Section>

      {/* Cards Row 1 */}
      <Section delay={100}>
        <Card
          title="Workers Safe"
          value="342"
          subtext="↑ 12 workers since shift start"
          badgeColor="green"
        />
        <Card
          title="Machines Running"
          value="89"
          subtext="98.5% operational efficiency"
          badgeColor="orange"
        />
        <Card
          title="Air Quality Index"
          value="Good"
          subtext="AQI: 45 • ↓ from yesterday"
          badgeColor="green"
        />
      </Section>

      {/* Module Title */}
      <Section delay={200}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
          Comprehensive Mining Intelligence
        </Text>
        <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', marginVertical: 8 }}>
          Four core modules designed to transform coal mining operations with cutting-edge technology.
        </Text>
      </Section>

      {/* Module Cards */}
      <Section delay={300}>
        <ModuleCard
          emoji="🛡️"
          title="Worker Safety Monitoring"
          description="Real-time tracking of worker locations, vitals, and equipment."
          color="green"
          points={[
            'Live health vitals monitoring',
            'GPS location tracking',
            'Automatic emergency alerts'
          ]}
        />

        <ModuleCard
          emoji="⚡"
          title="AI-Powered Alerts"
          description="ML algorithms predict hazards and optimize safety."
          color="orange"
          points={[
            'Predictive hazard detection',
            'Equipment failure prediction',
            'Pattern recognition analytics'
          ]}
        />

        <ModuleCard
          emoji="🌿"
          title="Carbon Footprint Estimation"
          description="Environmental monitoring to support sustainability goals."
          color="green"
          points={[
            'Real-time emissions monitoring',
            'Carbon footprint analytics',
            'Regulatory reporting automation'
          ]}
        />

        <ModuleCard
          emoji="📊"
          title="R&D Project Tracker"
          description="Manage innovation and track research outcomes."
          color="orange"
          points={[
            'Project milestone tracking',
            'Innovation metrics dashboard',
            'Team collaboration tools'
          ]}
        />
      </Section>
    </ScrollView>
  );
};

export default LiveOverview;
