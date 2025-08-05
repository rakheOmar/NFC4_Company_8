import { faker } from '@faker-js/faker';

const sentiments = ['positive', 'neutral', 'negative'];
const toolsUsed = ['Yes', 'No'];
const locations = ['Mine A', 'Mine B', 'Mine C'];

function generateSurveyResponse() {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    date: faker.date.between('2024-01-01', '2025-08-01'),
    comment: faker.lorem.sentence(),
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    toolsUsed: toolsUsed[Math.floor(Math.random() * toolsUsed.length)],
  };
}

// Generate 200 responses
const sampleSurveyData = Array.from({ length: 200 }, generateSurveyResponse);

export default sampleSurveyData;
