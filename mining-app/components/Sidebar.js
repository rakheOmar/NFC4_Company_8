import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { FontAwesome5 } from '@expo/vector-icons';

const Sidebar = ({ user }) => {
  return (
    <MotiView
      from={{ translateX: -60, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ type: 'timing', duration: 800, easing: 'easeOut' }}
      style={styles.sidebar}
    >
      <View style={styles.profile}>
        <View style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.id}>{user.id}</Text>
        <Text style={styles.level}>{user.level}</Text>
      </View>

      <View style={styles.actions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <ActionButton label="Check In" icon="sign-in-alt" active />
        <ActionButton label="Start Video Call" icon="video" />
        <ActionButton label="View Instructions" icon="clipboard-list" />
        <ActionButton label="Report Safety Issue" icon="exclamation-circle" />
      </View>
    </MotiView>
  );
};

const ActionButton = ({ label, icon, active }) => (
  <TouchableOpacity style={[styles.actionButton, active && styles.activeButton]}>
    <FontAwesome5 name={icon} size={18} color={active ? '#fff' : '#374151'} />
    <Text style={[styles.actionLabel, active && styles.activeLabel]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  profile: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#d1d5db',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  id: {
    fontSize: 14,
    color: '#6b7280',
  },
  level: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 4,
  },
  actions: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  activeButton: {
    backgroundColor: '#2563eb',
  },
  actionLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: '#374151',
  },
  activeLabel: {
    color: '#fff',
  },
});

export default Sidebar;
